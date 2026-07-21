# Alamia Print ERP System - API DTO Reference

This document provides a comprehensive reference of all Data Transfer Objects (DTOs) used by the REST API endpoints in the Alamia Print ERP System.

---

# Company

## CompanyDto

Purpose: Data Transfer Object for Company entity, used for transferring company data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the company |
| name | String | Required | `@NotBlank`, `@Size(max=100)` | Company name |
| address | String | Required | `@NotBlank`, `@Size(max=200)` | Company address |
| phone | String | Optional | `@Size(max=20)` | Company phone number |
| email | String | Required | `@NotBlank`, `@Email`, `@Size(max=100)` | Company email address |
| notes | String | Optional | `@Size(max=500)` | Additional notes about the company |
| managerName | String | Required | `@NotBlank`, `@Size(max=100)` | Name of the company manager |
| products | List<ProductDto> | Optional | None | List of products associated with the company |
| orders | List<ProductionOrderDto> | Optional | None | List of production orders for the company |

### Example JSON Request
```json
{
  "name": "Alamia Print Solutions",
  "address": "123 Printing Street, Industrial Zone",
  "phone": "+1-555-123-4567",
  "email": "info@alamiaprint.com",
  "notes": "Leading printing company in the region",
  "managerName": "John Smith"
}
```

### Example JSON Response
```json
{
  "id": 1,
  "name": "Alamia Print Solutions",
  "address": "123 Printing Street, Industrial Zone",
  "phone": "+1-555-123-4567",
  "email": "info@alamiaprint.com",
  "notes": "Leading printing company in the region",
  "managerName": "John Smith",
  "products": [],
  "orders": [],
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---

# Product

## ProductDto

Purpose: Data Transfer Object for Product entity, used for transferring product data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the product |
| name | String | Required | `@NotBlank`, `@Size(max=100)` | Product name |
| code | String | Required | `@NotBlank`, `@Size(max=50)` | Product code/SKU |
| type | ProductType | Optional | None | Type of product (enum: PRINTING, PACKAGING, DESIGN, etc.) |
| notes | String | Optional | `@Size(max=500)` | Additional notes about the product |
| orders | List<ProductionOrderDto> | Optional | None | List of production orders for this product |
| company_id | Long | Required | `@NotNull` | Foreign key referencing the company |

### Example JSON Request
```json
{
  "name": "Premium Quality Paper",
  "code": "PQP-001",
  "type": "PAPER",
  "notes": "High-quality paper suitable for premium printing",
  "company_id": 1
}
```

### Example JSON Response
```json
{
  "id": 1,
  "name": "Premium Quality Paper",
  "code": "PQP-001",
  "type": "PAPER",
  "notes": "High-quality paper suitable for premium printing",
  "orders": [],
  "company_id": 1,
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---

# ProductionOrder

## ProductionOrderDto

Purpose: Data Transfer Object for ProductionOrder entity, used for transferring production order data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the production order |
| company | CompanyDto | Required | `@NotNull` | Company associated with the production order |
| product | List<ProductDto> | Required | `@NotNull` | List of products in the production order |
| quantity | Double | Required | `@Positive` | Quantity of product to be produced |
| paper | PaperDto | Required | `@NotNull` | Paper type used for the production |
| material | List<MaterialDto> | Optional | `@Size(max=500)` | List of materials required for production |
| requiredSheets | Double | Optional | `@Positive` | Number of sheets required |
| status | ProductionStatus | Required | `@NotNull` | Current status of the production order (enum: PENDING, APPROVED, MONTAGE, PRINTING, FINISHING, COMPLETED, SHIPPED, DELIVERED, CANCELLED) |
| description | String | Optional | None | Detailed description of the production order |

### Example JSON Request
```json
{
  "company": {
    "id": 1,
    "name": "Alamia Print Solutions",
    "address": "123 Printing Street, Industrial Zone",
    "phone": "+1-555-123-4567",
    "email": "info@alamiaprint.com",
    "notes": "Leading printing company in the region",
    "managerName": "John Smith"
  },
  "product": [
    {
      "id": 1,
      "name": "Premium Quality Paper",
      "code": "PQP-001",
      "type": "PAPER",
      "notes": "High-quality paper suitable for premium printing",
      "company_id": 1
    }
  ],
  "quantity": 1000.0,
  "paper": {
    "id": 1,
    "name": "Glossy Art Paper",
    "type": "GLOSSY",
    "weight": 150.0,
    "brightness": 95.0,
    "color": "WHITE",
    "material_id": 1
  },
  "material": [
    {
      "id": 1,
      "name": "CMYK Ink Set",
      "type": "INK",
      "unit": "ML",
      "price": 25.50
    }
  ],
  "requiredSheets": 1200.0,
  "status": "PENDING",
  "description": "Production of 1000 premium quality brochures"
}
```

### Example JSON Response
```json
{
  "id": 1,
  "company": {
    "id": 1,
    "name": "Alamia Print Solutions",
    "address": "123 Printing Street, Industrial Zone",
    "phone": "+1-555-123-4567",
    "email": "info@alamiaprint.com",
    "notes": "Leading printing company in the region",
    "managerName": "John Smith",
    "products": [],
    "orders": [],
    "createdAt": "2026-07-14T10:30:00",
    "updatedAt": "2026-07-14T10:30:00"
  },
  "product": [
    {
      "id": 1,
      "name": "Premium Quality Paper",
      "code": "PQP-001",
      "type": "PAPER",
      "notes": "High-quality paper suitable for premium printing",
      "orders": [],
      "company_id": 1,
      "createdAt": "2026-07-14T10:30:00",
      "updatedAt": "2026-07-14T10:30:00"
    }
  ],
  "quantity": 1000.0,
  "paper": {
    "id": 1,
    "name": "Glossy Art Paper",
    "type": "GLOSSY",
    "weight": 150.0,
    "brightness": 95.0,
    "color": "WHITE",
    "material_id": 1,
    "createdAt": "2026-07-14T10:30:00",
    "updatedAt": "2026-07-14T10:30:00"
  },
  "material": [
    {
      "id": 1,
      "name": "CMYK Ink Set",
      "type": "INK",
      "unit": "ML",
      "price": 25.50,
      "createdAt": "2026-07-14T10:30:00",
      "updatedAt": "2026-07-14T10:30:00"
    }
  ],
  "requiredSheets": 1200.0,
  "status": "PENDING",
  "description": "Production of 1000 premium quality brochures",
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---

# Paper

## PaperDto

Purpose: Data Transfer Object for Paper entity, used for transferring paper data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the paper |
| name | String | Required | `@NotBlank`, `@Size(max=100)` | Name/type of the paper |
| type | String | Optional | `@Size(max=50)` | Paper type (e.g., GLOSSY, MATTE, TEXTURED) |
| weight | Double | Optional | `@Positive` | Weight of the paper in GSM (grams per square meter) |
| brightness | Double | Optional | `@Positive`, `@Max(100)` | Brightness percentage of the paper |
| color | String | Optional | `@Size(max=50)` | Color of the paper |
| material_id | Long | Required | `@NotNull` | Foreign key referencing the base material |

### Example JSON Request
```json
{
  "name": "Glossy Art Paper",
  "type": "GLOSSY",
  "weight": 150.0,
  "brightness": 95.0,
  "color": "WHITE",
  "material_id": 1
}
```

### Example JSON Response
```json
{
  "id": 1,
  "name": "Glossy Art Paper",
  "type": "GLOSSY",
  "weight": 150.0,
  "brightness": 95.0,
  "color": "WHITE",
  "material_id": 1,
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---

# Material

## MaterialDto

Purpose: Data Transfer Object for Material entity, used for transferring material data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the material |
| name | String | Required | `@NotBlank`, `@Size(max=100)` | Name of the material |
| type | MaterialType | Optional | None | Type of material (enum: PAPER, INK, CHEMICAL, etc.) |
| unit | MaterialUnit | Optional | None | Unit of measurement (enum: KG, G, L, ML, PCS, MT, etc.) |
| price | Double | Optional | `@Positive` | Price per unit of material |

### Example JSON Request
```json
{
  "name": "CMYK Ink Set",
  "type": "INK",
  "unit": "ML",
  "price": 25.50
}
```

### Example JSON Response
```json
{
  "id": 1,
  "name": "CMYK Ink Set",
  "type": "INK",
  "unit": "ML",
  "price": 25.50,
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---

# Chemical

## ChemicalDto

Purpose: Data Transfer Object for Chemical entity, used for transferring chemical data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the chemical |
| material_id | Long | Optional | `@Positive` | Foreign key referencing the base material |
| name | String | Optional | None | Name of the chemical |
| chemicalTypes | List<String> | Optional | `@Size(max=500)` | List of chemical types or classifications |

### Example JSON Request
```json
{
  "material_id": 1,
  "name": "Photo Developer Solution",
  "chemicalTypes": ["Developer", "Photographic", "Liquid"]
}
```

### Example JSON Response
```json
{
  "id": 1,
  "material_id": 1,
  "name": "Photo Developer Solution",
  "chemicalTypes": ["Developer", "Photographic", "Liquid"],
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---

# Supplier

## SupplierDto

Purpose: Data Transfer Object for Supplier entity, used for transferring supplier data between client and server.

### Fields

| Field Name | Java Type | Required/Optional | Validation Annotations | Description |
|------------|-----------|-------------------|------------------------|-------------|
| id | Long | Optional (auto-generated) | None | Unique identifier for the supplier |
| name | String | Required | `@NotBlank`, `@Size(max=100)` | Supplier name |
| contactPerson | String | Optional | `@Size(max=100)` | Name of the contact person |
| phone | String | Optional | `@Size(max=20)` | Contact phone number |
| email | String | Optional | `@Email`, `@Size(max=100)` | Contact email address |
| address | String | Optional | `@Size(max=200)` | Supplier address |
| materials | List<MaterialDto> | Optional | None | List of materials supplied by this supplier |
| type | SupplierType | Optional | None | Type of supplier (enum: MATERIAL, EQUIPMENT, SERVICE, etc.) |
| notes | String | Optional | `@Size(max=500)` | Additional notes about the supplier |

### Example JSON Request
```json
{
  "name": "InkTech Supplies",
  "contactPerson": "Sarah Johnson",
  "phone": "+1-555-987-6543",
  "email": "sales@inktech.com",
  "address": "456 Industrial Ave, Manufacturing District",
  "type": "MATERIAL",
  "notes": "Premium supplier of printing inks and chemicals"
}
```

### Example JSON Response
```json
{
  "id": 1,
  "name": "InkTech Supplies",
  "contactPerson": "Sarah Johnson",
  "phone": "+1-555-987-6543",
  "email": "sales@inktech.com",
  "address": "456 Industrial Ave, Manufacturing District",
  "materials": [],
  "type": "MATERIAL",
  "notes": "Premium supplier of printing inks and chemicals",
  "createdAt": "2026-07-15T10:30:00",
  "updatedAt": "2026-07-15T10:30:00"
}
```

---
*This document was generated based on the Alamia Print ERP System codebase as of 2026-07-15.*