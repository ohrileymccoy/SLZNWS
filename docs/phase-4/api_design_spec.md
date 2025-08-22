# Phase 4 — API Design (Endpoints & Behavior, Locked Contract)

**Purpose**  
Define a precise, versioned, browser-safe API that matches the Phase 3 schema with zero ambiguity. This document is the **source of truth** for field names, enum values, parameter names, response shapes, and errors.

**Style & Conventions (Contract)**
- **Base path:** `/api/v1`
- **JSON only**. `Content-Type: application/json; charset=utf-8`
- **snake_case** for all JSON keys (matches Phase 3).
- **Timestamps:** ISO 8601 UTC (e.g., `2025-08-18T19:12:47Z`)
- **Sections (enum):** `"news" | "culture" | "sports"`  
  - Display labels (“News”, “Culture”, “Sports”) are a frontend concern.
- **Booleans:** `true`/`false`
- **Pagination:** cursor-based. Cursor = `created_at + "_" + id`
- **Status codes:** 2xx success, 4xx client error, 5xx server error (see Error Model)
- **Versioning:** Bump prefix (`/api/v2`) for any breaking change.

---

## Endpoints

### 1) List Articles
**GET** `/api/v1/articles`

Returns a paginated list of **published** articles (lightweight item projection) ordered by `created_at DESC, id DESC`.

**Query Params**
- `limit` (integer, optional): `1..20` (server clamps >20 to 20). Default: 20
- `cursor` (string, optional): last item marker from previous page, format `"{created_at}_{id}"`
- `section` (string, optional): one of `news|culture|sports` (lowercase enum)

**Visibility**
- Always filters `is_published = true` (drafts never appear).

**Algorithm (must)**
- If `cursor` is provided, return items with `(created_at < C) OR (created_at = C AND id < I)`.
- Sort results by `created_at DESC, id DESC`.
- Return `nextCursor = null` if no more items.

**200 Response (example)**
```json
{
  "items": [
    {
      "id": 101,
      "slug": "riverwalk-ribbon-cutting",
      "title": "Ribbon-Cutting Brings New Life to Riverwalk",
      "dek": "A sunny afternoon and a packed crowd line the banks.",
      "hero_image": "media/2025/08/riverwalk.jpg",
      "section": "news",
      "created_at": "2025-08-18T19:12:47Z"
    }
  ],
  "nextCursor": "2025-08-18T18:01:03Z_100"
}
