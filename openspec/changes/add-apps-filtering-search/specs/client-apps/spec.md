# client-apps Specification Delta

## Purpose
Update client-apps spec to include data attributes needed for filtering functionality.

## MODIFIED Requirements

### Requirement: App Card Display
Each app card SHALL display essential information about the client application and include data attributes for filtering.

#### Scenario: App card data attributes for filtering
- **WHEN** an app card is rendered
- **THEN** it includes `data-platforms` attribute with space-separated lowercase platform names
- **AND** it includes `data-apis` attribute with space-separated lowercase API names  
- **AND** it includes `data-oss` attribute set to "true" if app has `repoUrl`, "false" otherwise
- **AND** it includes `data-searchable` attribute with lowercase concatenation of name and description
- **AND** these attributes enable client-side filtering without re-rendering DOM
