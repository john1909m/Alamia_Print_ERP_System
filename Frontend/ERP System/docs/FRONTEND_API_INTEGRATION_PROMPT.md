# Frontend API Integration Prompt

You are an expert frontend developer tasked with integrating a frontend application with the Alamia Print ERP System backend. Your task is to replace all mock API calls with real service calls while maintaining the existing UI architecture and ensuring perfect synchronization between frontend forms and backend DTOs.

## Instructions

Before beginning any implementation, you must carefully read and understand the following documents:

1. **CLAUDE.md** - Contains the backend development guide, architecture principles, and coding rules for the Alamia Print ERP System
2. **APIEndpoints.md** - Contains the complete API endpoint documentation (HTTP methods, paths, parameters, and response codes)
3. **API_DTO_REFERENCE.md** - Contains the complete Data Transfer Object (DTO) documentation (this document)

## Integration Rules

### Data Transfer Object Usage
- **Use DTO documentation as the single source of truth** for all API interactions
- **Never guess field names** - always refer to the exact field names in API_DTO_REFERENCE.md
- **Never guess request body structure** - always use the exact structure defined in the DTO documentation
- **Never guess response body structure** - always use the exact structure defined in the DTO documentation
- **Bind every form field exactly** to its corresponding DTO field with matching names and types

### Validation Synchronization
- **Keep validation synchronized** with backend DTO validation annotations
- Implement client-side validation that mirrors:
  - `@NotBlank` → required fields
  - `@Size(min=x, max=y)` → min/max length validation
  - `@Min(value=x)` / `@Max(value=y)` → min/max value validation
  - `@NotNull` → required fields (for non-primitive types)
  - `@Positive` → min value > 0 validation
  - `@Email` → email format validation
- Display validation errors exactly as defined in the DTO message attributes

### API Endpoint Mapping
- Map each UI component/form to its corresponding API endpoint based on the entity type
- Use the correct HTTP methods (GET, POST, PUT, DELETE) as defined in APIEndpoints.md
- Include all required path parameters, query parameters, and request bodies as specified
- Handle all response codes appropriately (200, 201, 204, 400, 404, etc.)

### Implementation Requirements
- **Preserve existing UI and architecture** - do not redesign components unless absolutely necessary for functionality
- **Replace all mock service calls** with actual API service calls
- **Maintain loading states** and error handling consistent with existing patterns
- **Ensure proper authentication headers** are included if required (refer to CLAUDE.md security section)
- **Handle pagination** correctly for list endpoints (using Pageable parameters where applicable)

### Verification Process
After implementing each integration:
1. Verify that all form fields map directly to DTO fields with no additions or omissions
2. Confirm that validation rules match exactly those defined in the DTO annotations
3. Test that request payloads match the DTO structure specified in API_DTO_REFERENCE.md
4. Verify that response handling matches the expected DTO structure
5. Report any mismatches between frontend implementation and backend DTO specifications

## Reporting Requirements

If you discover any of the following issues, you must report them immediately:
- Fields in frontend forms that do not exist in the corresponding DTO
- Missing fields in frontend forms that exist in the corresponding DTO
- Validation rules that differ from those specified in DTO annotations
- Request/response structures that don't match DTO definitions
- API endpoint usage that doesn't match APIEndpoints.md specifications
- Any deviation from the architecture principles outlined in CLAUDE.md

## Entities to Integrate

Based on the API_DTO_REFERENCE.md, you need to integrate frontend components for the following entities:
- Company
- Product
- Production Order
- Paper
- Material
- Chemical
- Supplier
- Ink

For each entity, ensure:
- List views properly call GET collection endpoints with pagination
- Detail views properly call GET by ID endpoints
- Create forms properly call POST endpoints with correct request bodies
- Edit forms properly call PUT endpoints with correct request bodies
- Delete actions properly call DELETE endpoints
- All related data (nested objects/lists) are handled according to DTO specifications

Remember: The DTO documentation is your single source of truth. When in doubt, refer back to API_DTO_REFERENCE.md for the exact field names, types, and validation rules.