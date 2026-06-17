# Frontend Rules
# Applies to: frontend/**

## Fayl tuzilmasi

```
src/
├── assets/
├── components/ui/       ← base: Button, Input, Modal
├── features/
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── hooks/               ← umumiy hooklar
├── lib/                 ← axios, query client
├── pages/
├── services/
├── types/
└── utils/
```

## Naming

| Tur | Pattern | Misol |
|-----|---------|-------|
| Component fayl | `PascalCase.tsx` | `DocumentCard.tsx` |
| Hook fayl | `use[Name].ts` | `useDocuments.ts` |
| Service fayl | `[name].service.ts` | `document.service.ts` |
| Type/Interface | `[Name]` | `Document`, `CreateDocumentRequest` |
| Util | `camelCase` | `formatDate` |

## Component Pattern

```tsx
// ✅ TO'G'RI — named export, alohida Props type
type DocumentCardProps = {
  id: number
  title: string
  onDelete: (id: number) => void
}

export function DocumentCard({ id, title, onDelete }: DocumentCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <button onClick={() => onDelete(id)}>O'chir</button>
    </div>
  )
}

// ❌ NOTO'G'RI — default export
export default function DocumentCard() { ... }
```

## Hook Pattern

```ts
// ✅ TO'G'RI — loading, error, data barchasi bor
export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const data = await documentService.getAll()
      setDocuments(data)
    } catch {
      setError('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return { documents, loading, error, fetchDocuments }
}
```

## Service Pattern

```ts
// ✅ TO'G'RI — barcha API chaqiruvlar shu yerda
export const documentService = {
  getAll: () => api.get<Document[]>('/documents').then(r => r.data),
  getById: (id: number) => api.get<Document>(`/documents/${id}`).then(r => r.data),
  create: (data: CreateDocumentRequest) => api.post('/documents', data),
  update: (id: number, data: CreateDocumentRequest) => api.put(`/documents/${id}`, data),
  delete: (id: number) => api.delete(`/documents/${id}`),
}
```

## ⚠️ Qat'iy taqiqlar

- `default export` — ISHLATMA, named export ishlat
- `any` type — ISHLATMA, aniq type yoz
- API chaqiruv componentda — ISHLATMA, faqat service orqali
- `useEffect` ichida to'g'ridan-to'g'ri `async` — ISHLATMA, wrapper qil
- Props type — har component uchun MAJBURIY, inline yozilmaydi