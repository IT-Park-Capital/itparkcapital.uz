yse# BTS Express Delivery Integration Agent

## WHO YOU ARE

You are a senior .NET backend engineer. Your job is to build a complete, production-ready integration between an e-commerce platform (ASP.NET Core Web API) and BTS Express — a local Uzbekistan courier and delivery service.

You have been given the complete BTS API documentation below. You do not need to visit any website. Everything you need is in this prompt.

---

## CORE CONCEPTS — READ THIS FIRST

Before writing any code, understand how BTS Express works as a business and how its API models that business.

### What is BTS Express?

BTS Express is a courier and logistics company in Uzbekistan with 250+ branches across all 14 regions. It handles domestic parcels, documents, and cargo delivery. For an e-commerce platform, BTS is used to:
- Create shipment orders when a customer places an order
- Pick up parcels from the seller's warehouse
- Deliver parcels to the customer's address
- Collect cash from the customer on delivery (COD)
- Provide real-time tracking

---

### Key Business Concept 1: Pickup Type vs Dropoff Type

Every BTS shipment has two logistics decisions:

**pickup_type** — how does the parcel get FROM the seller TO BTS:
- `self` — seller physically carries the parcel to a BTS branch
- `courier` — BTS sends a courier to collect from seller's address

**dropoff_type** — how does the parcel get FROM BTS TO the customer:
- `courier` — BTS courier delivers to customer's door
- `branch` — customer picks up from a BTS branch themselves

For e-commerce: typically `pickup_type = self` (you drop off at BTS) and `dropoff_type = courier` (BTS delivers to customer). This is the cheapest and most common combination.

---

### Key Business Concept 2: COD (Cash on Delivery)

BTS supports collecting payment from the customer at delivery. This is called `back_money`.

- `bringBackMoney: 1` — enable COD
- `back_money: 150000` — collect 150,000 UZS from the customer
- BTS collects this cash and transfers it to your account

For online payments (Click, Payme), set `bringBackMoney: 0`.

---

### Key Business Concept 3: Order Lifecycle

A BTS shipment goes through these statuses in order:

```
100  → At Sender          (just created, parcel still with you)
200  → Courier Picked Up  (BTS courier collected from you)
300  → At Sending Office  (checked in at your local BTS branch)
400  → Internal Transit   (moving between cities)
500  → At Sorting Center  (being sorted at regional hub)
600  → In Bag             (loaded into transport bag)
700  → In Transit         (on route to destination city)
800  → At Delivery Office (arrived at customer's local BTS branch)
1100 → Courier Delivering (BTS courier en route to customer)
1200 → Delivered          (successfully delivered to customer)
1300 → Deleted            (order deleted)
1400 → Expired            (order expired without delivery)
```

**Critical rule:** You can only cancel a BTS order when status = 100.
Once BTS physically has the parcel (status ≥ 200), cancellation is impossible via API.

---

### Key Business Concept 4: Reference Data

BTS uses codes for locations and packaging. Before creating orders, you must know these codes:

- **Region code** — 2-digit string, e.g. `"01"` = Tashkent city, `"60"` = Andijan region
- **City code** — 4-digit string, e.g. `"0101"` = Uchtepa district in Tashkent
- **Branch code** — 4-digit string, e.g. `"0101"` = specific BTS branch
- **Package type ID** — integer, e.g. `7` = Box, `10` = Factory packaging
- **Post type ID** — integer, e.g. `7` = Office equipment, `11` = Clothes/shoes

These codes never change. **Cache them in your database at startup.** Do not call the catalog endpoints on every order.

---

### Key Business Concept 5: Price Calculation

Before showing delivery cost to the customer at checkout, call the calculator endpoint with:
- Sender city code (your warehouse)
- Receiver city code (customer's location)
- Pickup and dropoff types
- Weight in kg

BTS returns 4 price options (branch-to-branch, branch-to-courier, courier-to-branch, courier-to-courier). Pick the one matching your pickup_type and dropoff_type.

---

### Key Business Concept 6: Shipping Label (Sticker)

After creating a BTS order, you receive a PDF label URL. This must be printed and attached to the physical parcel before handing it to BTS. Without the label, BTS will not accept the parcel.

---

### Key Business Concept 7: Webhook vs Polling

BTS can notify you automatically when an order status changes (webhook). You configure one URL once, and BTS will POST to it on every status change.

Webhook payload arrives as `multipart/form-data`, not JSON. The data is in a field called `text` which is a JSON string. You must parse it with `Request.Form["text"]`.

Alternatively, you can poll `GET /v1/order/track?orderId={}` manually, but webhooks are preferred.

---

### Key Business Concept 8: Token Management

BTS uses JWT tokens:
- `access_token` — valid for 24 hours. Include in every API request.
- `refresh_token` — valid for 30 days. Use to get a new access_token without re-entering password.

When you get a 401 response:
1. Try `POST /auth/refresh` with the refresh_token
2. If that also fails (422), call `POST /auth/login` with credentials again
3. Store new tokens and retry the original request

---

## BTS API — COMPLETE REFERENCE

### Base URLs

| Environment | URL |
|---|---|
| Test | `https://apitest.bts.uz:28345` |
| Production | Confirm with BTS (likely `https://api.bts.uz:28345`) |
| WMS | `http://wms.bts.uz:8040` |

### Common Headers (every request)

```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
language: uz
```

---

### AUTH-1: Login
**POST** `/auth/login`

```json
// Request
{ "login": "your_login", "password": "your_password" }

// Response 200
{
  "status": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}

// Response 401
{ "name": "Unauthorized", "message": "Incorrect login or password.", "status": 401 }
```

---

### AUTH-2: Refresh Token
**POST** `/auth/refresh`

```json
// Request
{ "refresh_token": "eyJ..." }

// Response 200
{
  "status": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

---

### ORDER-1: Create Order
**POST** `/v1/order/add`

```json
// Request
{
  "clientId": "your-internal-order-id",
  "pickup_type": "self",
  "dropoff_type": "courier",
  "is_sender_location": false,
  "is_receiver_location": false,
  "sender": {
    "name": "Your Store Name",
    "phone": "+998901234567",
    "address": "Toshkent, Bobur ko'cha 5",
    "city_code": "0101",
    "branch_code": "0101"
  },
  "receiver": {
    "name": "Customer Full Name",
    "phone": "+998991234567",
    "phone1": "+998901234568",
    "address": "Samarkand, Registon ko'cha 10",
    "city_code": "3001"
  },
  "bringBackMoney": 0,
  "back_money": 0,
  "takePhoto": 1,
  "cargo": {
    "weight": 5.5,
    "volume": 0,
    "piece": 1,
    "packageId": 7,
    "postTypeId": 7
  },
  "ready_to_take": true
}

// Response 200
{
  "status": true,
  "data": {
    "orderId": 4293644,
    "clientId": "your-internal-order-id",
    "barcode": "019912312243",
    "cost": 87000,
    "senderDate": "2026-01-05",
    "receiverDate": "2026-01-06",
    "tracking": "https://bts.uz/uz/waybill-tracking?term=..."
  }
}
```

| Field | Type | Req | Notes |
|---|---|---|---|
| `clientId` | string | No | Your order ID for cross-referencing webhook callbacks |
| `pickup_type` | enum | **Yes** | `self` or `courier` |
| `dropoff_type` | enum | No | `courier` or `branch` |
| `is_sender_location` | bool | No | `true` = use lat/lng instead of city_code |
| `is_receiver_location` | bool | No | `true` = use lat/lng instead of city_code |
| `sender.name` | string | **Yes** | |
| `sender.phone` | string | **Yes** | Format: `+998XXXXXXXXX` |
| `sender.address` | string | **Yes** | |
| `sender.city_code` | string | No | Required if `is_sender_location = false` |
| `receiver.name` | string | **Yes** | |
| `receiver.phone` | string | **Yes** | |
| `receiver.city_code` | string | No | Required if `is_receiver_location = false` |
| `bringBackMoney` | int | No | `1` = COD enabled |
| `back_money` | float | No | Amount to collect from receiver (UZS) |
| `takePhoto` | int | No | `1` = photo proof of delivery |
| `cargo.weight` | float | **Yes** | kg, min 0.001, max 10000 |
| `cargo.piece` | int | **Yes** | Number of parcels |
| `cargo.packageId` | int | No | From `/v1/package/index` |
| `cargo.postTypeId` | int | No | From `/v1/inside/index` |

---

### ORDER-2: Edit Order
**POST** `/v1/order/edit?orderId={orderId}`

Same request body as Create Order. Only works while order can still be modified.

---

### ORDER-3: Get Order Detail
**GET** `/v1/order/detail?orderId={orderId}`

Returns full order information. No request body.

---

### ORDER-4: Get Shipping Label
**GET** `/v1/order/sticker?orderId={orderId}`

```json
// Response 200
{
  "status": true,
  "data": {
    "labelEncode": null,
    "labelSticker": "https://bts.uz/sticker/....pdf"
  }
}
```

Download PDF from `labelSticker` URL and print it.

---

### ORDER-5: Cancel Order
**GET** `/v1/order-cancel/index?orderId={orderId}`

⚠️ Only works if `status_code = 100`.

```json
// Response 200
{
  "status": true,
  "data": { "orderId": 4293646, "status": { "id": 0, "name": "Cancelled Order" } }
}

// Response 400 (already cancelled or wrong status)
{ "status": false, "message": "error.already_cancelled", "status_code": 400 }
```

---

### ORDER-6: Track Order
**GET** `/v1/order/track?orderId={orderId}`

```json
// Response 200
{
  "status": true,
  "data": {
    "orderId": 11950975,
    "status": { "code": 800, "name": "В офисе доставки" }
  }
}
```

---

### ORDER-7: Calculate Delivery Cost
**POST** `/v1/order-calculate/index`

```json
// Request
{
  "senderCityCode": "0101",
  "receiverCityCode": "3001",
  "pickup_type": "self",
  "dropoff_type": "courier",
  "is_multiple_cost": 1,
  "weight": 2.5,
  "volume": { "x": 30, "y": 20, "z": 15 }
}

// Response 200
{
  "status": true,
  "data": {
    "branch_to_branch":   { "available": true, "price": 76000 },
    "branch_to_courier":  { "available": true, "price": 83000 },
    "courier_to_branch":  { "available": true, "price": 108000 },
    "courier_to_courier": { "available": true, "price": 138000 }
  }
}
```

| Field | Req | Notes |
|---|---|---|
| `senderCityCode` | **Yes** | Your warehouse city code |
| `receiverCityCode` | **Yes** | Customer's city code |
| `pickup_type` | **Yes** | `self`, `courier`, or `branch` |
| `dropoff_type` | **Yes** | `courier`, `branch`, or `self` |
| `is_multiple_cost` | No | `1` = get all 4 combinations |
| `weight` | **Yes** | kg |
| `volume` | No | Dimensions in cm |

---

### CATALOG-1: Get Regions
**GET** `/v1/directory/regions`

```json
// Response 200 (all 14 regions)
{
  "data": {
    "items": [
      { "code": "01", "name": "Toshkent shahri" },
      { "code": "10", "name": "Toshkent viloyati" },
      { "code": "20", "name": "Sirdaryo viloyati" },
      { "code": "25", "name": "Jizzax viloyati" },
      { "code": "30", "name": "Samarqand viloyati" },
      { "code": "40", "name": "Farg'ona viloyati" },
      { "code": "50", "name": "Namangan viloyati" },
      { "code": "60", "name": "Andijon viloyati" },
      { "code": "70", "name": "Qashqadaryo viloyati" },
      { "code": "75", "name": "Surxondaryo viloyati" },
      { "code": "80", "name": "Buxoro viloyati" },
      { "code": "85", "name": "Navoiy viloyati" },
      { "code": "90", "name": "Xorazm viloyati" },
      { "code": "95", "name": "Qoraqalpog'iston" }
    ]
  }
}
```

---

### CATALOG-2: Get Cities / Districts
**GET** `/v1/directory/cities?regionCode={regionCode}`

```json
// Response 200 (example: regionCode=60, Andijan)
{
  "data": {
    "items": [
      { "code": "6000", "name": "Andijon shahri" },
      { "code": "6001", "name": "Xonobod shahar" },
      { "code": "6002", "name": "Andijon tumani" },
      { "code": "6003", "name": "Jalaquduq tumani" }
    ]
  }
}
```

Use `code` as `city_code` in orders.

---

### CATALOG-3: Get Branches
**GET** `/v1/directory/branches?regionCode={regionCode}&cityCode={cityCode}`

```json
// Response 200 (each branch)
{
  "code": "7017",
  "name": "SHAHRISABZ TOJMAHAL",
  "regionCode": "70",
  "cityCode": "7001",
  "address": "Shahrisabz sh, Ipak yo'li k, 278",
  "lat_long": "39.067442,66.834786",
  "phone": "1230",
  "working_hours": {
    "1": "09:00-18:00",
    "2": "09:00-18:00",
    "3": "09:00-18:00",
    "4": "09:00-18:00",
    "5": "09:00-18:00",
    "6": "09:00-18:00",
    "7": null
  }
}
```

Keys 1–7 = Monday–Sunday. `null` = closed. Use `code` as `branch_code` in orders.

---

### CATALOG-4: Get Package Types
**GET** `/v1/package/index`

```json
// All 9 package types
{ "id": 4,  "name": "Bag (Сумка)" },
{ "id": 5,  "name": "Container (Контейнер)" },
{ "id": 6,  "name": "BTS Envelope" },
{ "id": 7,  "name": "Box (Коробка)" },          ← use for home appliances
{ "id": 8,  "name": "BTS Pack" },
{ "id": 9,  "name": "No packaging" },
{ "id": 10, "name": "Factory packaging" },       ← use for factory-sealed appliances
{ "id": 90, "name": "Wooden crate" },
{ "id": 91, "name": "Black bag" }
```

---

### CATALOG-5: Get Shipment Content Types
**GET** `/v1/inside/index`

Returns 37 types across 2 pages. Important ones for home appliances:

```json
{ "id": 1,  "name": "OTHER (BOSHQA)" },
{ "id": 5,  "name": "SPARE PARTS (EHTIYOT QISMLAR)" },
{ "id": 7,  "name": "OFFICE EQUIPMENT (OFIS JIHOZLARI)" },  ← for appliances
{ "id": 11, "name": "CLOTHES & SHOES" },
{ "id": 12, "name": "MOBILE PHONE" },
{ "id": 15, "name": "FOOD (OZIQ-OVQAT)" }
```

---

### CATALOG-6: Get All Status Codes
**GET** `/v1/status/index`

Returns 12 statuses. See Status Reference Table in section below.

---

### WEBHOOK-1: Configure Webhook
**GET** `/v1/webhook/webhook-config`

```json
// Request
{
  "webhook_url": "https://your-api.com/webhooks/bts",
  "environment": "production",
  "has_token": false,
  "itx-apiKey": ""
}

// Response 200
{
  "status": true,
  "data": {
    "webhook_url": "https://your-api.com/webhooks/bts",
    "method": "POST",
    "environment": "production"
  }
}
```

---

## WHAT YOU MUST BUILD

### Architecture Overview

```
E-Commerce App
     │
     ├── BtsAuthService          — login, token refresh, token storage
     ├── BtsCatalogService       — load & cache regions, cities, branches, types
     ├── BtsCalculatorService    — calculate delivery cost at checkout
     ├── BtsOrderService         — create, edit, cancel, get detail
     ├── BtsTrackingService      — track order status, get sticker
     ├── BtsWebhookService       — receive & process incoming webhooks
     └── BtsIntegrationFacade    — public API used by order placement flow
```

---

### Project Structure

```
src/
├── Integrations/
│   └── BtsExpress/
│       ├── BtsExpressOptions.cs         (configuration: login, password, base URL)
│       ├── BtsHttpClient.cs             (typed HttpClient with auto token refresh)
│       ├── Services/
│       │   ├── BtsAuthService.cs
│       │   ├── BtsCatalogService.cs
│       │   ├── BtsCalculatorService.cs
│       │   ├── BtsOrderService.cs
│       │   ├── BtsTrackingService.cs
│       │   └── BtsWebhookService.cs
│       ├── Models/
│       │   ├── Requests/
│       │   │   ├── BtsLoginRequest.cs
│       │   │   ├── BtsCreateOrderRequest.cs
│       │   │   ├── BtsCalculateRequest.cs
│       │   │   └── BtsWebhookConfigRequest.cs
│       │   ├── Responses/
│       │   │   ├── BtsAuthResponse.cs
│       │   │   ├── BtsOrderResponse.cs
│       │   │   ├── BtsCalculateResponse.cs
│       │   │   ├── BtsTrackResponse.cs
│       │   │   ├── BtsStickerResponse.cs
│       │   │   └── BtsCatalogResponse.cs
│       │   └── Webhooks/
│       │       └── BtsWebhookPayload.cs
│       ├── Enums/
│       │   ├── BtsPickupType.cs
│       │   ├── BtsDropoffType.cs
│       │   └── BtsOrderStatus.cs
│       └── Extensions/
│           └── BtsServiceExtensions.cs  (AddBtsExpress() for DI registration)
├── Controllers/
│   └── Webhooks/
│       └── BtsWebhookController.cs
└── Features/
    └── Orders/
        └── PlaceOrderHandler.cs         (uses BtsIntegrationFacade)
```

---

### Configuration (appsettings.json)

```json
{
  "BtsExpress": {
    "BaseUrl": "https://apitest.bts.uz:28345",
    "Login": "your_bts_login",
    "Password": "your_bts_password",
    "WebhookUrl": "https://your-app.com/webhooks/bts",
    "SenderName": "Your Store Name",
    "SenderPhone": "+998901234567",
    "SenderAddress": "Toshkent, your warehouse address",
    "SenderCityCode": "0101",
    "SenderBranchCode": "0101",
    "DefaultPickupType": "self",
    "DefaultDropoffType": "courier",
    "DefaultPackageId": 7,
    "DefaultPostTypeId": 7
  }
}
```

---

### BtsExpressOptions.cs

```csharp
public class BtsExpressOptions
{
    public const string SectionName = "BtsExpress";

    public string BaseUrl { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string SenderPhone { get; set; } = string.Empty;
    public string SenderAddress { get; set; } = string.Empty;
    public string SenderCityCode { get; set; } = string.Empty;
    public string SenderBranchCode { get; set; } = string.Empty;
    public string DefaultPickupType { get; set; } = "self";
    public string DefaultDropoffType { get; set; } = "courier";
    public int DefaultPackageId { get; set; } = 7;
    public int DefaultPostTypeId { get; set; } = 7;
}
```

---

### All C# Models

#### BtsLoginRequest.cs
```csharp
public class BtsLoginRequest
{
    [JsonPropertyName("login")]
    public string Login { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}
```

#### BtsAuthResponse.cs
```csharp
public class BtsAuthResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("data")]
    public BtsTokenData Data { get; set; } = new();
}

public class BtsTokenData
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;

    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; } = string.Empty;
}
```

#### BtsCreateOrderRequest.cs
```csharp
public class BtsCreateOrderRequest
{
    [JsonPropertyName("clientId")]
    public string? ClientId { get; set; }

    [JsonPropertyName("pickup_type")]
    public string PickupType { get; set; } = "self";

    [JsonPropertyName("dropoff_type")]
    public string DropoffType { get; set; } = "courier";

    [JsonPropertyName("is_sender_location")]
    public bool IsSenderLocation { get; set; } = false;

    [JsonPropertyName("is_receiver_location")]
    public bool IsReceiverLocation { get; set; } = false;

    [JsonPropertyName("sender")]
    public BtsParty Sender { get; set; } = new();

    [JsonPropertyName("receiver")]
    public BtsParty Receiver { get; set; } = new();

    [JsonPropertyName("bringBackMoney")]
    public int BringBackMoney { get; set; } = 0;

    [JsonPropertyName("back_money")]
    public decimal BackMoney { get; set; } = 0;

    [JsonPropertyName("takePhoto")]
    public int TakePhoto { get; set; } = 1;

    [JsonPropertyName("bringBackWaybill")]
    public int BringBackWaybill { get; set; } = 0;

    [JsonPropertyName("cargo")]
    public BtsCargo Cargo { get; set; } = new();

    [JsonPropertyName("ready_to_take")]
    public bool ReadyToTake { get; set; } = true;
}

public class BtsParty
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [JsonPropertyName("phone1")]
    public string? Phone1 { get; set; }

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("city_code")]
    public string? CityCode { get; set; }

    [JsonPropertyName("branch_code")]
    public string? BranchCode { get; set; }

    [JsonPropertyName("latitude")]
    public string? Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public string? Longitude { get; set; }
}

public class BtsCargo
{
    [JsonPropertyName("weight")]
    public double Weight { get; set; }

    [JsonPropertyName("volume")]
    public double Volume { get; set; } = 0;

    [JsonPropertyName("piece")]
    public int Piece { get; set; } = 1;

    [JsonPropertyName("packageId")]
    public int PackageId { get; set; } = 7;

    [JsonPropertyName("postTypeId")]
    public int PostTypeId { get; set; } = 7;
}
```

#### BtsOrderResponse.cs
```csharp
public class BtsOrderResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("status_code")]
    public int StatusCode { get; set; }

    [JsonPropertyName("data")]
    public BtsOrderData? Data { get; set; }
}

public class BtsOrderData
{
    [JsonPropertyName("orderId")]
    public long OrderId { get; set; }

    [JsonPropertyName("clientId")]
    public string? ClientId { get; set; }

    [JsonPropertyName("barcode")]
    public string Barcode { get; set; } = string.Empty;

    [JsonPropertyName("cost")]
    public decimal Cost { get; set; }

    [JsonPropertyName("senderDate")]
    public string SenderDate { get; set; } = string.Empty;

    [JsonPropertyName("receiverDate")]
    public string ReceiverDate { get; set; } = string.Empty;

    [JsonPropertyName("tracking")]
    public string Tracking { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public BtsStatusInfo? StatusInfo { get; set; }
}

public class BtsStatusInfo
{
    [JsonPropertyName("code")]
    public int? Code { get; set; }

    [JsonPropertyName("info")]
    public string? Info { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }
}
```

#### BtsCalculateRequest.cs
```csharp
public class BtsCalculateRequest
{
    [JsonPropertyName("senderCityCode")]
    public string SenderCityCode { get; set; } = string.Empty;

    [JsonPropertyName("receiverCityCode")]
    public string ReceiverCityCode { get; set; } = string.Empty;

    [JsonPropertyName("pickup_type")]
    public string PickupType { get; set; } = "self";

    [JsonPropertyName("dropoff_type")]
    public string DropoffType { get; set; } = "courier";

    [JsonPropertyName("is_multiple_cost")]
    public int IsMultipleCost { get; set; } = 0;

    [JsonPropertyName("weight")]
    public double Weight { get; set; }

    [JsonPropertyName("volume")]
    public BtsVolume? Volume { get; set; }
}

public class BtsVolume
{
    [JsonPropertyName("x")] public double X { get; set; }
    [JsonPropertyName("y")] public double Y { get; set; }
    [JsonPropertyName("z")] public double Z { get; set; }
}
```

#### BtsCalculateResponse.cs
```csharp
public class BtsCalculateResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("data")]
    public BtsCalculateData? Data { get; set; }
}

public class BtsCalculateData
{
    [JsonPropertyName("branch_to_branch")]
    public BtsPriceOption? BranchToBranch { get; set; }

    [JsonPropertyName("branch_to_courier")]
    public BtsPriceOption? BranchToCourier { get; set; }

    [JsonPropertyName("courier_to_branch")]
    public BtsPriceOption? CourierToBranch { get; set; }

    [JsonPropertyName("courier_to_courier")]
    public BtsPriceOption? CourierToCourier { get; set; }
}

public class BtsPriceOption
{
    [JsonPropertyName("available")]
    public bool Available { get; set; }

    [JsonPropertyName("price")]
    public decimal Price { get; set; }
}
```

#### BtsTrackResponse.cs
```csharp
public class BtsTrackResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("data")]
    public BtsTrackData? Data { get; set; }
}

public class BtsTrackData
{
    [JsonPropertyName("orderId")]
    public long OrderId { get; set; }

    [JsonPropertyName("status")]
    public BtsStatusInfo? Status { get; set; }
}
```

#### BtsStickerResponse.cs
```csharp
public class BtsStickerResponse
{
    [JsonPropertyName("status")]
    public bool Status { get; set; }

    [JsonPropertyName("data")]
    public BtsStickerData? Data { get; set; }
}

public class BtsStickerData
{
    [JsonPropertyName("labelSticker")]
    public string? LabelSticker { get; set; }
}
```

#### BtsWebhookPayload.cs
```csharp
public class BtsWebhookPayload
{
    [JsonPropertyName("clientId")]
    public string? ClientId { get; set; }

    [JsonPropertyName("orderId")]
    public long OrderId { get; set; }

    [JsonPropertyName("barcode")]
    public string Barcode { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public BtsWebhookStatus Status { get; set; } = new();

    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;
}

public class BtsWebhookStatus
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}
```

#### BtsOrderStatus.cs (enum)
```csharp
public enum BtsOrderStatus
{
    AtSender = 100,
    CourierPickedUp = 200,
    AtSendingOffice = 300,
    InternalTransit = 400,
    AtSortingCenter = 500,
    InBag = 600,
    InTransit = 700,
    AtDeliveryOffice = 800,
    CourierDelivering = 1100,
    Delivered = 1200,
    Deleted = 1300,
    Expired = 1400
}
```

#### Catalog models
```csharp
public class BtsRegion
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class BtsCity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class BtsBranch
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string RegionCode { get; set; } = string.Empty;
    public string CityCode { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string LatLong { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Dictionary<string, string?> WorkingHours { get; set; } = new();
}

public class BtsPostType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class BtsPackageType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
```

---

### BtsHttpClient.cs

```csharp
public class BtsHttpClient
{
    private readonly HttpClient _http;
    private readonly BtsAuthService _auth;

    public BtsHttpClient(HttpClient http, BtsAuthService auth)
    {
        _http = http;
        _auth = auth;
    }

    public async Task<T?> GetAsync<T>(string path)
    {
        return await SendAsync<T>(HttpMethod.Get, path, null);
    }

    public async Task<T?> PostAsync<T>(string path, object body)
    {
        return await SendAsync<T>(HttpMethod.Post, path, body);
    }

    private async Task<T?> SendAsync<T>(HttpMethod method, string path, object? body, bool isRetry = false)
    {
        var token = await _auth.GetAccessTokenAsync();
        var request = new HttpRequestMessage(method, path);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        request.Headers.Add("language", "uz");

        if (body != null)
            request.Content = JsonContent.Create(body);

        var response = await _http.SendAsync(request);

        if (response.StatusCode == HttpStatusCode.Unauthorized && !isRetry)
        {
            await _auth.RefreshAsync();
            return await SendAsync<T>(method, path, body, isRetry: true);
        }

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }
}
```

---

### BtsAuthService.cs

```csharp
public class BtsAuthService
{
    private readonly HttpClient _http;
    private readonly BtsExpressOptions _options;
    private readonly ILogger<BtsAuthService> _logger;

    private string? _accessToken;
    private string? _refreshToken;
    private DateTime _accessTokenExpiry = DateTime.MinValue;

    public BtsAuthService(HttpClient http, IOptions<BtsExpressOptions> options, ILogger<BtsAuthService> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<string> GetAccessTokenAsync()
    {
        if (_accessToken != null && DateTime.UtcNow < _accessTokenExpiry)
            return _accessToken;

        if (_refreshToken != null)
        {
            try { await RefreshAsync(); return _accessToken!; }
            catch { /* fall through to full login */ }
        }

        await LoginAsync();
        return _accessToken!;
    }

    public async Task LoginAsync()
    {
        var response = await _http.PostAsJsonAsync("/auth/login", new BtsLoginRequest
        {
            Login = _options.Login,
            Password = _options.Password
        });

        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<BtsAuthResponse>();

        if (result?.Data == null) throw new InvalidOperationException("BTS login returned empty token data.");

        _accessToken = result.Data.AccessToken;
        _refreshToken = result.Data.RefreshToken;
        _accessTokenExpiry = DateTime.UtcNow.AddHours(23); // 24h - 1h buffer
        _logger.LogInformation("BTS: Logged in successfully.");
    }

    public async Task RefreshAsync()
    {
        if (_refreshToken == null) throw new InvalidOperationException("No refresh token available.");

        var response = await _http.PostAsJsonAsync("/auth/refresh", new { refresh_token = _refreshToken });

        if (!response.IsSuccessStatusCode)
        {
            _refreshToken = null;
            throw new UnauthorizedAccessException("BTS refresh token expired or invalid.");
        }

        var result = await response.Content.ReadFromJsonAsync<BtsAuthResponse>();
        _accessToken = result!.Data.AccessToken;
        _refreshToken = result.Data.RefreshToken;
        _accessTokenExpiry = DateTime.UtcNow.AddHours(23);
        _logger.LogInformation("BTS: Token refreshed successfully.");
    }
}
```

---

### BtsCatalogService.cs

```csharp
public class BtsCatalogService
{
    private readonly BtsHttpClient _client;
    private readonly IMemoryCache _cache;

    public BtsCatalogService(BtsHttpClient client, IMemoryCache cache)
    {
        _client = client;
        _cache = cache;
    }

    public async Task<List<BtsRegion>> GetRegionsAsync()
    {
        return await _cache.GetOrCreateAsync("bts:regions", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7);
            var response = await _client.GetAsync<BtsCatalogResponse<BtsRegion>>("/v1/directory/regions");
            return response?.Data?.Items ?? new List<BtsRegion>();
        }) ?? new List<BtsRegion>();
    }

    public async Task<List<BtsCity>> GetCitiesAsync(string regionCode)
    {
        return await _cache.GetOrCreateAsync($"bts:cities:{regionCode}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7);
            var response = await _client.GetAsync<BtsCatalogResponse<BtsCity>>($"/v1/directory/cities?regionCode={regionCode}");
            return response?.Data?.Items ?? new List<BtsCity>();
        }) ?? new List<BtsCity>();
    }

    public async Task<List<BtsBranch>> GetBranchesAsync(string regionCode, string cityCode)
    {
        return await _cache.GetOrCreateAsync($"bts:branches:{regionCode}:{cityCode}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            var response = await _client.GetAsync<BtsCatalogResponse<BtsBranch>>($"/v1/directory/branches?regionCode={regionCode}&cityCode={cityCode}");
            return response?.Data?.Items ?? new List<BtsBranch>();
        }) ?? new List<BtsBranch>();
    }

    public async Task<List<BtsPackageType>> GetPackageTypesAsync()
    {
        return await _cache.GetOrCreateAsync("bts:packages", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30);
            var response = await _client.GetAsync<BtsCatalogResponse<BtsPackageType>>("/v1/package/index");
            return response?.Data?.Items ?? new List<BtsPackageType>();
        }) ?? new List<BtsPackageType>();
    }

    public async Task<List<BtsPostType>> GetPostTypesAsync()
    {
        return await _cache.GetOrCreateAsync("bts:posttypes", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30);
            var response = await _client.GetAsync<BtsCatalogResponse<BtsPostType>>("/v1/inside/index");
            return response?.Data?.Items ?? new List<BtsPostType>();
        }) ?? new List<BtsPostType>();
    }
}

public class BtsCatalogResponse<T>
{
    [JsonPropertyName("data")]
    public BtsCatalogData<T>? Data { get; set; }
}

public class BtsCatalogData<T>
{
    [JsonPropertyName("items")]
    public List<T> Items { get; set; } = new();
}
```

---

### BtsCalculatorService.cs

```csharp
public class BtsCalculatorService
{
    private readonly BtsHttpClient _client;
    private readonly BtsExpressOptions _options;

    public BtsCalculatorService(BtsHttpClient client, IOptions<BtsExpressOptions> options)
    {
        _client = client;
        _options = options.Value;
    }

    public async Task<decimal> CalculateAsync(string receiverCityCode, double weightKg)
    {
        var request = new BtsCalculateRequest
        {
            SenderCityCode = _options.SenderCityCode,
            ReceiverCityCode = receiverCityCode,
            PickupType = _options.DefaultPickupType,
            DropoffType = _options.DefaultDropoffType,
            Weight = weightKg,
            IsMultipleCost = 0
        };

        var response = await _client.PostAsync<BtsCalculateResponse>("/v1/order-calculate/index", request);

        if (response?.Data == null)
            throw new InvalidOperationException("BTS calculator returned no data.");

        // Pick the price matching our default pickup/dropoff combo
        var price = (_options.DefaultPickupType, _options.DefaultDropoffType) switch
        {
            ("self", "courier")   => response.Data.BranchToCourier?.Price,
            ("self", "branch")    => response.Data.BranchToBranch?.Price,
            ("courier", "courier") => response.Data.CourierToCourier?.Price,
            ("courier", "branch")  => response.Data.CourierToBranch?.Price,
            _ => response.Data.BranchToCourier?.Price
        };

        return price ?? throw new InvalidOperationException("Delivery not available for this route.");
    }
}
```

---

### BtsOrderService.cs

```csharp
public class BtsOrderService
{
    private readonly BtsHttpClient _client;
    private readonly BtsExpressOptions _options;
    private readonly ILogger<BtsOrderService> _logger;

    public BtsOrderService(BtsHttpClient client, IOptions<BtsExpressOptions> options, ILogger<BtsOrderService> logger)
    {
        _client = client;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<BtsOrderData> CreateAsync(CreateBtsShipmentDto dto)
    {
        var request = new BtsCreateOrderRequest
        {
            ClientId = dto.InternalOrderId,
            PickupType = _options.DefaultPickupType,
            DropoffType = _options.DefaultDropoffType,
            Sender = new BtsParty
            {
                Name = _options.SenderName,
                Phone = _options.SenderPhone,
                Address = _options.SenderAddress,
                CityCode = _options.SenderCityCode,
                BranchCode = _options.SenderBranchCode
            },
            Receiver = new BtsParty
            {
                Name = dto.ReceiverName,
                Phone = dto.ReceiverPhone,
                Address = dto.ReceiverAddress,
                CityCode = dto.ReceiverCityCode
            },
            BringBackMoney = dto.IsCod ? 1 : 0,
            BackMoney = dto.IsCod ? dto.CodAmount : 0,
            Cargo = new BtsCargo
            {
                Weight = dto.WeightKg,
                Piece = dto.Pieces,
                PackageId = _options.DefaultPackageId,
                PostTypeId = _options.DefaultPostTypeId
            }
        };

        var response = await _client.PostAsync<BtsOrderResponse>("/v1/order/add", request);

        if (response?.Data == null || !response.Status)
        {
            _logger.LogError("BTS: Failed to create order for {OrderId}", dto.InternalOrderId);
            throw new InvalidOperationException("BTS order creation failed.");
        }

        _logger.LogInformation("BTS: Created order {BtsOrderId} for {InternalOrderId}", response.Data.OrderId, dto.InternalOrderId);
        return response.Data;
    }

    public async Task<BtsOrderData?> GetDetailAsync(long btsOrderId)
    {
        var response = await _client.GetAsync<BtsOrderResponse>($"/v1/order/detail?orderId={btsOrderId}");
        return response?.Data;
    }

    public async Task<bool> CancelAsync(long btsOrderId)
    {
        var response = await _client.GetAsync<BtsOrderResponse>($"/v1/order-cancel/index?orderId={btsOrderId}");
        return response?.Status == true;
    }
}

public class CreateBtsShipmentDto
{
    public string InternalOrderId { get; set; } = string.Empty;
    public string ReceiverName { get; set; } = string.Empty;
    public string ReceiverPhone { get; set; } = string.Empty;
    public string ReceiverAddress { get; set; } = string.Empty;
    public string ReceiverCityCode { get; set; } = string.Empty;
    public double WeightKg { get; set; } = 1.0;
    public int Pieces { get; set; } = 1;
    public bool IsCod { get; set; } = false;
    public decimal CodAmount { get; set; } = 0;
}
```

---

### BtsTrackingService.cs

```csharp
public class BtsTrackingService
{
    private readonly BtsHttpClient _client;

    public BtsTrackingService(BtsHttpClient client) => _client = client;

    public async Task<BtsStatusInfo?> TrackAsync(long btsOrderId)
    {
        var response = await _client.GetAsync<BtsTrackResponse>($"/v1/order/track?orderId={btsOrderId}");
        return response?.Data?.Status;
    }

    public async Task<string?> GetStickerUrlAsync(long btsOrderId)
    {
        var response = await _client.GetAsync<BtsStickerResponse>($"/v1/order/sticker?orderId={btsOrderId}");
        return response?.Data?.LabelSticker;
    }
}
```

---

### BtsWebhookService.cs

```csharp
public class BtsWebhookService
{
    private readonly IOrderRepository _orderRepo;
    private readonly ILogger<BtsWebhookService> _logger;

    public BtsWebhookService(IOrderRepository orderRepo, ILogger<BtsWebhookService> logger)
    {
        _orderRepo = orderRepo;
        _logger = logger;
    }

    public async Task HandleAsync(BtsWebhookPayload payload)
    {
        _logger.LogInformation("BTS Webhook: OrderId={OrderId} Status={StatusCode}", payload.OrderId, payload.Status.Id);

        // Find our order using either BTS orderId or our clientId
        var order = await _orderRepo.GetByBtsOrderIdAsync(payload.OrderId)
                 ?? await _orderRepo.GetByIdAsync(payload.ClientId ?? "");

        if (order == null)
        {
            _logger.LogWarning("BTS Webhook: No matching order found for BtsOrderId={OrderId}", payload.OrderId);
            return;
        }

        var newStatus = MapStatus(payload.Status.Id);
        order.DeliveryStatus = newStatus;
        order.LastBtsStatusCode = payload.Status.Id;
        order.LastBtsStatusName = payload.Status.Name;
        order.LastBtsStatusUpdatedAt = DateTime.UtcNow;

        if (newStatus == DeliveryStatus.Delivered)
            order.DeliveredAt = DateTime.UtcNow;

        await _orderRepo.SaveAsync();
    }

    private static DeliveryStatus MapStatus(int btsCode) => btsCode switch
    {
        100                                  => DeliveryStatus.Pending,
        >= 200 and <= 700                    => DeliveryStatus.InTransit,
        800 or 1100                          => DeliveryStatus.OutForDelivery,
        1200                                 => DeliveryStatus.Delivered,
        1300 or 1400                         => DeliveryStatus.Failed,
        _                                    => DeliveryStatus.Unknown
    };
}
```

---

### BtsWebhookController.cs

```csharp
[ApiController]
[Route("webhooks/bts")]
public class BtsWebhookController : ControllerBase
{
    private readonly BtsWebhookService _webhookService;
    private readonly ILogger<BtsWebhookController> _logger;

    public BtsWebhookController(BtsWebhookService webhookService, ILogger<BtsWebhookController> logger)
    {
        _webhookService = webhookService;
        _logger = logger;
    }

    // BTS sends form-data with a "text" field containing JSON string
    [HttpPost]
    public async Task<IActionResult> Receive([FromForm] string text)
    {
        try
        {
            _logger.LogDebug("BTS Webhook raw: {Text}", text);
            var payload = JsonSerializer.Deserialize<BtsWebhookPayload>(text);

            if (payload == null)
                return BadRequest("Invalid payload");

            await _webhookService.HandleAsync(payload);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "BTS Webhook processing failed");
            return StatusCode(500);
        }
    }
}
```

---

### BtsServiceExtensions.cs

```csharp
public static class BtsServiceExtensions
{
    public static IServiceCollection AddBtsExpress(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<BtsExpressOptions>(config.GetSection(BtsExpressOptions.SectionName));

        var baseUrl = config[$"{BtsExpressOptions.SectionName}:BaseUrl"]
                      ?? "https://apitest.bts.uz:28345";

        services.AddMemoryCache();

        services.AddHttpClient<BtsAuthService>(client =>
        {
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Add("Content-Type", "application/json");
        });

        services.AddHttpClient<BtsHttpClient>(client =>
        {
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });

        services.AddSingleton<BtsAuthService>();
        services.AddScoped<BtsHttpClient>();
        services.AddScoped<BtsCatalogService>();
        services.AddScoped<BtsCalculatorService>();
        services.AddScoped<BtsOrderService>();
        services.AddScoped<BtsTrackingService>();
        services.AddScoped<BtsWebhookService>();

        return services;
    }
}
```

In `Program.cs`:
```csharp
builder.Services.AddBtsExpress(builder.Configuration);
```

---

## STATUS REFERENCE TABLE

| Code | Name | Your Status | Can Cancel |
|---|---|---|---|
| 100 | At Sender | Pending | ✅ Yes |
| 200 | Courier Picked Up | InTransit | ❌ No |
| 300 | At Sending Office | InTransit | ❌ No |
| 400 | Internal Transit | InTransit | ❌ No |
| 500 | At Sorting Center | InTransit | ❌ No |
| 600 | In Bag | InTransit | ❌ No |
| 700 | In Transit | InTransit | ❌ No |
| 800 | At Delivery Office | OutForDelivery | ❌ No |
| 1100 | Courier Delivering | OutForDelivery | ❌ No |
| 1200 | Delivered | Delivered | ❌ No |
| 1300 | Deleted | Failed | ❌ No |
| 1400 | Expired | Failed | ❌ No |

---

## COMPLETE ORDER FLOW

```
1. Customer selects delivery address
   └─► GET /v1/directory/regions
   └─► GET /v1/directory/cities?regionCode={code}

2. Customer reviews cart at checkout
   └─► POST /v1/order-calculate/index
       (senderCityCode + receiverCityCode + weight)
       → show delivery cost to customer

3. Customer places order → payment succeeds
   └─► POST /v1/order/add
       → store BtsOrderId, Barcode, TrackingUrl in your Order table
       → store BtsStickerUrl

4. Print shipping label
   └─► GET /v1/order/sticker?orderId={btsOrderId}
       → download PDF → print → attach to parcel

5. Drop parcel at BTS branch (pickup_type = self)
   → BTS status changes 100 → 200 → 300 ...

6. Real-time status updates via webhook
   └─► POST https://your-app.com/webhooks/bts
       → parse form-data "text" field
       → update order.DeliveryStatus

7. Order delivered (status 1200)
   └─► Mark order as Delivered
   └─► Notify customer

8. Cancel if needed (only status = 100)
   └─► GET /v1/order-cancel/index?orderId={btsOrderId}
```

---

## FIELDS TO ADD TO YOUR ORDER TABLE

```sql
ALTER TABLE Orders ADD COLUMN BtsOrderId BIGINT NULL;
ALTER TABLE Orders ADD COLUMN BtsBarcode VARCHAR(50) NULL;
ALTER TABLE Orders ADD COLUMN BtsTrackingUrl TEXT NULL;
ALTER TABLE Orders ADD COLUMN BtsStickerUrl TEXT NULL;
ALTER TABLE Orders ADD COLUMN BtsLastStatusCode INT NULL;
ALTER TABLE Orders ADD COLUMN BtsLastStatusName VARCHAR(100) NULL;
ALTER TABLE Orders ADD COLUMN BtsLastStatusUpdatedAt TIMESTAMP NULL;
ALTER TABLE Orders ADD COLUMN DeliveryStatus VARCHAR(50) NOT NULL DEFAULT 'Pending';
ALTER TABLE Orders ADD COLUMN DeliveredAt TIMESTAMP NULL;
```

Or in EF Core (C#):
```csharp
// Add to your Order entity
public long? BtsOrderId { get; set; }
public string? BtsBarcode { get; set; }
public string? BtsTrackingUrl { get; set; }
public string? BtsStickerUrl { get; set; }
public int? BtsLastStatusCode { get; set; }
public string? BtsLastStatusName { get; set; }
public DateTime? BtsLastStatusUpdatedAt { get; set; }
public DeliveryStatus DeliveryStatus { get; set; } = DeliveryStatus.Pending;
public DateTime? DeliveredAt { get; set; }
```

---

## IMPORTANT NOTES

1. **Phone format**: must be `+998XXXXXXXXX` — always 13 characters including `+`
2. **Weight**: in kg. For home appliances, a typical washing machine ≈ 70kg, fridge ≈ 60kg, TV ≈ 15kg
3. **All prices** returned from BTS are in **UZS (Uzbek So'm)** as integers
4. **city_code** is not the region code — it's the 4-digit district code from `/v1/directory/cities`
5. **Test vs Production**: `apitest.bts.uz` is the sandbox. Confirm production URL with BTS before go-live
6. **Webhook endpoint must be public** — BTS cannot reach `localhost`. Use ngrok for local dev testing
7. **clientId in order creation** = your internal order ID string — BTS echoes it back in webhooks, making it easy to match
8. **labelSticker URL** is temporary — download and store the PDF file yourself, don't rely on the URL being permanent
9. **Cache catalog data** — regions, cities, packages, post types almost never change. Refresh weekly
10. **`is_multiple_cost: 1`** in the calculator gives all 4 price combinations at once — use this to let customers choose delivery speed/price