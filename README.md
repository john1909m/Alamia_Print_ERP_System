# Alamia Print ERP System

A full-stack ERP system built for managing printing-related materials, variants, inventory, and production workflows.

## Overview

Alamia Print ERP is designed to help manage the core operations of a printing business, including:

- Materials management
- Paper, ink, and chemical variants
- Stock tracking
- Company and supplier records
- Production orders
- Internal workflow organization

The project includes a **Spring Boot backend** and a **React + Vite frontend**.

---

## Features

### Materials

- Create, edit, delete, and view materials
- Manage material types such as:
  - Paper
  - Ink
  - Chemical

- Track stock and notes for each material

### Variants

- Manage paper variants
- Manage ink variants
- Manage chemical variants
- Each variant is linked to its parent material using `material_id`
- Support for per-variant stock

### Companies

- Manage company records
- Store company contact and manager information

### Suppliers

- Manage suppliers
- Use supplier type selection based on backend enums

### Production Orders

- Create and manage production orders
- Link orders with related business entities

### Inventory / Stock Flow

- Track stock values across the system
- Support ERP-style operational data flow

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- Axios

### Backend

- Spring Boot
- Spring Data JPA
- Spring Security
- MapStruct
- Hibernate
- Oracle Database

---

## Project Structure

```bash
Alamia Print ERP System/
├── Backend/
│   └── ERP/
└── Frontend/
    └── ERP System/
```

### Frontend Structure

```bash
src/
├── components/
├── constants/
├── features/
│   ├── materials/
│   ├── companies/
│   ├── suppliers/
│   ├── products/
│   ├── inventory/
│   └── production-orders/
├── services/
└── utils/
```

### Backend Structure

```bash
src/main/java/com/spring/boot/
├── controller/
├── dto/
├── entity/
├── mapper/
├── repository/
├── service/
└── config/
```

---

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Java 21
- Maven
- Oracle Database

---

## Frontend Setup

```bash
cd "Frontend/ERP System"
npm install
npm run dev
```

The frontend will run on the Vite development server.

---

## Backend Setup

```bash
cd "Backend/ERP"
mvn spring-boot:run
```

Make sure the database connection is configured correctly in the backend `application.properties` or `application.yml`.

---

## Environment Configuration

### Frontend

If your frontend uses environment variables, create a `.env` file if needed:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend

Configure your database connection and any required application settings before running the backend.

---

## API Notes

The frontend communicates with the backend through REST APIs.

Common endpoints include:

- `/api/materials`
- `/api/papers`
- `/api/inks`
- `/api/chemicals`
- `/api/companies`
- `/api/suppliers`
- `/api/production-orders`

Each variant entity is linked to its parent material by `material_id`.

---

## Validation

The project uses:

- Backend validation annotations
- Frontend Zod schemas
- React Hook Form for form handling

Validation is expected to stay synchronized between frontend and backend DTOs.

---

## Development Notes

- The backend is the source of truth for DTOs and enums.
- The frontend should match backend request and response shapes exactly.
- Variant forms are separated from Material forms.
- Material CRUD and Variant CRUD are handled as distinct flows.

---

## Known Conventions

- React component files use `.jsx`
- Duplicate experimental files should be removed during cleanup
- Material-specific logic should stay inside the `materials` feature
- Shared components should remain generic

---

## Future Improvements

Possible next steps:

- Better inventory movement tracking
- More advanced reporting
- User roles and permissions
- Audit logs
- Dashboard analytics
- Export and printing support

---

## License

This project is currently private / internal unless otherwise specified.

---

## Author

Developed for the Alamia Print ERP workflow.
