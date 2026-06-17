# backend-patterns

---
name: backend-patterns
description: Backend kod yozayotganda — Result pattern, Entity, Service,
             Controller, Broker, Job, Migration, DI registration ishlatganda ishlat
---

## 1. Result Pattern (Railway-Oriented)

Biznes xatolarda **hech qachon exception throw qilinmaydi**.

```csharp
// ✅ TO'G'RI
public async Task<Result<DocumentResponse>> GetByIdAsync(long id, ...)
{
    var doc = await dbContext.Documents
        .AsNoTracking()
        .Where(d => d.Id == id && !d.IsDeleted)
        .SingleOrDefaultAsync(cancellationToken);

    return doc is null ? DocumentErrors.NotFound : doc;
}

// ❌ NOTO'G'RI
if (doc == null) throw new Exception("Not found");
```

## 2. Errors Class

```csharp
public static class DocumentErrors
{
    public static readonly Error NotFound      = Error.NotFound("Document.NotFound");
    public static readonly Error AlreadyExists = Error.Conflict("Document.AlreadyExists");
    public static readonly Error InvalidStatus = Error.Failure("Document.InvalidStatus");
}
```

## 3. Entity

```csharp
// AuditableModelBase<long> dan inherit qil
public class Document : AuditableModelBase<long>
{
    [MaxLength(255)]
    public required string Title { get; set; }

    public DocumentStatus Status { get; set; }

    [Column("contract_id")]
    public long ContractId { get; set; }

    [ForeignKey(nameof(ContractId))]
    public Contract Contract { get; set; } = null!;       // ← null! navigation property

    public List<Agreement> Agreements { get; set; } = new(); // ← = new() collection
}
```

## 4. Service

```csharp
public class DocumentService(AppDbContext dbContext) : IDocumentService
{
    // READ — AsNoTracking majburiy
    public async Task<Result<List<DocumentResponse>>> GetAllAsync(...)
    {
        return await dbContext.Documents
            .AsNoTracking()
            .Where(d => !d.IsDeleted)
            .Select(d => new DocumentResponse { ... })
            .ToListAsync(cancellationToken);
    }

    // CREATE — SaveChangesAsync Service da
    public async Task<Result> AddAsync(CreateDocumentRequest request, ...)
    {
        var doc = new Document { Title = request.Title };
        dbContext.Documents.Add(doc);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    // UPDATE — avval topib ol, keyin o'zgartir
    public async Task<Result> UpdateAsync(long id, ...)
    {
        var doc = await dbContext.Documents
            .SingleOrDefaultAsync(d => d.Id == id && !d.IsDeleted, cancellationToken);

        if (doc is null) return DocumentErrors.NotFound;

        doc.Title = request.Title;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    // DELETE — IsDeleted = true, Remove() EMAS
    public async Task<Result> DeleteAsync(long id, ...)
    {
        var doc = await dbContext.Documents
            .SingleOrDefaultAsync(d => d.Id == id && !d.IsDeleted, cancellationToken);

        if (doc is null) return DocumentErrors.NotFound;

        doc.IsDeleted = true;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
```

## 5. Validator

```csharp
public class CreateDocumentRequestValidator : AbstractValidator<CreateDocumentRequest>
{
    public CreateDocumentRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(255).WithMessage("Title must not exceed 255 characters.");
    }
}
```

## 6. Controller

```csharp
[ApiController]
[Route("api/documents")]
public class DocumentsController(IDocumentService documentService) : AuthorizedController
{
    /// <summary>
    /// Get all documents.
    /// </summary>
    [HttpGet]
    public async Task<IResult> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var result = await documentService.GetAllAsync(cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Data) : result.ToProblemDetails();
    }

    /// <summary>
    /// Get document by id.
    /// </summary>
    [HttpGet("{id:long}")]
    public async Task<IResult> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        var result = await documentService.GetByIdAsync(id, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Data) : result.ToProblemDetails();
    }

    /// <summary>
    /// Create new document.
    /// </summary>
    [HttpPost]
    public async Task<IResult> AddAsync(
        [FromBody] CreateDocumentRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = await documentService.AddAsync(request, cancellationToken);
        return result.IsSuccess ? Results.Ok() : result.ToProblemDetails();
    }

    /// <summary>
    /// Update document.
    /// </summary>
    [HttpPut("{id:long}")]
    public async Task<IResult> UpdateAsync(
        long id,
        [FromBody] CreateDocumentRequest request,
        CancellationToken cancellationToken = default)
    {
        var result = await documentService.UpdateAsync(id, request, cancellationToken);
        return result.IsSuccess ? Results.Ok() : result.ToProblemDetails();
    }

    /// <summary>
    /// Delete document.
    /// </summary>
    [HttpDelete("{id:long}")]
    public async Task<IResult> DeleteAsync(long id, CancellationToken cancellationToken = default)
    {
        var result = await documentService.DeleteAsync(id, cancellationToken);
        return result.IsSuccess ? Results.Ok() : result.ToProblemDetails();
    }
}
```

## 7. IResult qoidalari

| Holat | Return |
|-------|--------|
| Ma'lumot bilan | `Results.Ok(result.Data)` |
| Ma'lumotsiz | `Results.Ok()` |
| Yaratildi | `Results.Created(uri, result.Data)` |
| Xato | `result.ToProblemDetails()` |

## 8. DI Registration

```csharp
// Application/Dependencies.cs
services
    .AddScoped<IDocumentService, DocumentService>()
    .AddScoped<IAgreementService, AgreementService>();
```

## 9. Yangi Feature — 12 qadam tartib

```
1.  Domain/Entities/[Entity].cs                          ← AuditableModelBase<long>
2.  Infrastructure/Persistence/AppDbContext.cs           ← DbSet<Entity> qo'sh
3.  Migration: dotnet ef migrations add Add_[Entity]
4.  Application/Services/[Entity]/[Entity]Errors.cs      ← static Error konstantalar
5.  Application/Services/[Entity]/Contracts/[Entity]Request.cs
6.  Application/Services/[Entity]/Contracts/[Entity]Response.cs
7.  Application/Services/[Entity]/Contracts/[Entity]FilterRequest.cs
8.  Application/Services/[Entity]/Contracts/[Entity]RequestValidator.cs
9.  Application/Services/[Entity]/I[Entity]Service.cs
10. Application/Services/[Entity]/[Entity]Service.cs
11. Application/Dependencies.cs                          ← AddScoped qo'sh
12. Api/Controllers/[Scope]/[Entities]Controller.cs      ← XML comment
```

## ⚠️ Gotchas

- `SaveChangesAsync` → **faqat Service da**, Repository/Controller da EMAS
- `Remove()` → **ISHLATMA** — `IsDeleted = true` ishlat
- `.First()` → **ISHLATMA** — `.SingleOrDefaultAsync()` ishlat
- `AsNoTracking()` → **READ** so'rovlarda majburiy
- Navigation property → `= null!` yoki `= new()` bilan initialize qil
- Exception throw → **QILMA** — `Result.Failure(error)` qaytар
- `int` Id → **ISHLATMA** — `long` ishlat (`AuditableModelBase<long>`)
- Soft delete filter → `.Where(x => !x.IsDeleted)` — **unutma**