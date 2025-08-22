# Phase 3 — Data Model and Content Rules (Paper Design)

**Goal**  
Define the article fields, indexing needs, and publishing rules in words, not code.

---

## 1. Article Fields

- **id** — unique identifier (integer, auto).
- **slug** — URL-safe string identifier; must be unique among published articles.
- **title** — headline text.
- **dek** — short subhead/tagline under the headline (≤ 180 chars).
- **body** — article content (markdown or sanitized rich text).
- **author** — display name of writer.
- **section** — one of the defined launch sections.
- **hero_image** — R2 object key for main image (e.g. `media/2025/08/riverwalk.jpg`).
- **created_at** — ISO 8601 UTC timestamp when article was created.
- **updated_at** — ISO 8601 UTC timestamp when article was last modified.
- **is_published** — boolean; true means article is visible publicly.
- **is_featured** — optional boolean flag to highlight the story in a featured rail.

**Indexing plan:**  
- Index on `(is_published, created_at DESC, id DESC)`.  
- Unique index on `slug` (for published only).

---

## 2. Sections at Launch

- News  
- Culture  
- Sports  
- Featured  

> Featured can be treated either as its own section or via `is_featured`. For MVP, the `is_featured` flag overrides.

---

## 3. Sorting Rules

- Default sort: **newest first by `created_at`**.  
- Tiebreaker: **`id` DESC** if two articles share the same timestamp.  
- Server always returns results pre-sorted.

---

## 4. Uniqueness Rules

- Each published `slug` must be unique.  
- Drafts may temporarily duplicate slugs but cannot be published until uniqueness is resolved.  
- `hero_image` must reference a valid R2 key if provided.

---

## 5. Visibility Rules

- Only items with `is_published = true` appear in public API endpoints.  
- Drafts are never exposed in the public API.  
- Single-article requests for unpublished slugs must return **404 Not Found**.

---

## 6. Pagination Rules

- **Maximum page size:** 20 articles.  
- **Cursor format:** `created_at` + `_` + `id` (e.g., `2025-08-19T12:30:00Z_1234`).  
- **How it works:**  
  - First request: no cursor → server returns newest N items.  
  - Next request: client sends `cursor` of the last item from prior page.  
  - Server returns items strictly **older** than that cursor (using `(created_at < C) OR (created_at = C AND id < I)`).  
  - If no items remain, server responds with `"nextCursor": null`.

---

## 7. Example List Response (Conceptual)

```json
{
  "items": [
    {
      "id": 101,
      "slug": "riverwalk-ribbon-cutting",
      "title": "Ribbon-Cutting Brings New Life to Riverwalk",
      "dek": "A sunny afternoon and a packed crowd line the banks.",
      "hero_image": "media/2025/08/riverwalk.jpg",
      "section": "News",
      "created_at": "2025-08-18T19:12:47Z"
    }
  ],
  "nextCursor": "2025-08-18T18:01:03Z_100"
}
