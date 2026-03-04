# Refactor: DataForm + Core Settings API

**Status:** Proposal for team discussion before implementation.

**Reference:** [How to use DataForm to create plugin settings pages](https://developer.wordpress.org/news/2026/01/how-to-use-dataform-to-create-plugin-settings-pages/)  
**Example project:** `/Users/nilambar/Code/projects/unadorned-announcement-bar`

This document analyses adopting WordPress’s **DataForm** component and the **core Settings REST API** so Optify can align with core UX, reduce custom REST surface, and simplify the frontend.

---

## 1. Current state

### 1.1 Optify today

| Layer | Implementation |
|-------|----------------|
| **PHP** | Panels registered via `Panel_Manager`; each panel has `get_field_configuration()`, `get_options_name()`, sanitize/validate. Options stored with `Options_Manager::get_option` / `update_option`. |
| **REST** | **Custom routes** (e.g. `optify/v1/`): `GET /fields/{panelId}`, `GET /options/{panelId}`, `POST /options/{panelId}`. See `Rest_Handler`, `Api_Handler`. |
| **Frontend** | React panel: on load calls `getFields(restUrl, panelId, nonce)` and `getOptions(restUrl, panelId, nonce)`; save via `saveOptions(..., values)`. Renders fields via `field-renderer` + registry (text, textarea, toggle, select, sortable, etc.), with conditional visibility (`logic.js`). |

So Optify owns both **field config** and **option values** over its own REST API.

### 1.2 Unadorned Announcement Bar (example project)

| Layer | Implementation |
|-------|----------------|
| **PHP** | Single setting: `register_setting('options', 'unadorned_announcement_bar', ['type' => 'object', 'default' => ..., 'show_in_rest' => ['schema' => $schema]])`. No custom REST routes. |
| **REST** | **No custom endpoints.** Uses core: `GET /wp/v2/settings` and `POST /wp/v2/settings` with body `{ "unadorned_announcement_bar": { ... } }`. |
| **Frontend** | `useSettings`: `apiFetch({ path: '/wp/v2/settings' })` for load; `apiFetch({ path: '/wp/v2/settings', method: 'POST', data: { unadorned_announcement_bar: settings } })` for save. Field definitions are **hardcoded in React** (DataForm `fields` / `form` config). |

So the example uses **core Settings API only** for data; form structure lives in the app.

---

## 2. Goal: use DataForm and (where possible) core Settings

- **UI:** Use `@wordpress/dataviews` **DataForm** for the settings form (declarative, core-aligned layout and components).
- **Data:** Prefer **core Settings REST API** (`/wp/v2/settings`) for reading/writing panel values so we can avoid or reduce **custom REST endpoints**.

---

## 3. Can we avoid our own REST endpoints?

### 3.1 Option values (get/save)

**Yes.** Core already provides:

- `GET /wp/v2/settings` — returns all settings that have `show_in_rest`.
- `POST /wp/v2/settings` — updates one or more of those settings.

So for each Optify panel we can:

1. **Register a WordPress setting** with the same logical “option” (or a namespaced key, e.g. `optify_panel_{panel_id}`) and `show_in_rest` with a schema that matches the panel’s fields (type, properties, enum where applicable).
2. **Frontend:** Load via `apiFetch({ path: '/wp/v2/settings' })` and use the key for that panel; save via `apiFetch({ path: '/wp/v2/settings', method: 'POST', data: { [settingKey]: values } })`.

That replaces the need for custom **GET/POST options** routes. Sanitization/validation can stay in PHP via the existing panel API and the registered setting’s sanitize callback.

### 3.2 Field configuration (structure, labels, choices, conditions)

Core Settings API exposes **values** and **schema** (e.g. type, enum). It does **not** expose:

- Which input component to use (textarea vs text, toggle vs checkbox).
- Labels, descriptions, sections, layout (cards, panels).
- Conditional visibility rules.

So we still need a way to get “field config” (what we currently return from `GET /fields/{panelId}`). Two main options:

| Approach | Description | Custom REST? |
|----------|-------------|--------------|
| **A. Inline field config** | When rendering the panel, PHP passes field config in the initial payload (e.g. extend `get_react_config()` or localized script) so the frontend receives `panels[panelId].fields` (and optionally initial values). No REST call for fields. | **No.** Only core `/wp/v2/settings` for read/write. |
| **B. Keep one custom route** | Keep a single endpoint, e.g. `GET /fields/{panelId}` (or a combined “bootstrap” that returns fields + initial values). Frontend fetches config (and maybe values) from our API; values could still be saved via core Settings API. | **Yes**, but only for config (and optionally one-time bootstrap). |

Recommendation: **Option A** is the only way to fully “not register our own REST endpoints.” Option B minimizes custom REST (no options routes) but keeps one config route unless we inline.

---

## 4. Implementation sketch: core settings + inline field config (no custom REST)

### 4.1 PHP

- **On panel registration (or at a suitable init hook):** For each panel, call `register_setting('options', $options_name, [...])` with:
  - `type => 'object'`, `default` from panel defaults.
  - `show_in_rest => ['schema' => $schema]` where `$schema` is built from the panel’s field configuration (so core REST exposes the same shape as today).
  - Sanitize/validate re-use or wrap existing panel sanitize/validate so stored data stays consistent.
- **Field config:** Extend the data passed to the frontend (e.g. `get_react_config()` or the same structure used for `panels[panelId]`) to include `fields` from `$panel->get_field_configuration()`. So the frontend never calls `GET /fields/{panelId}`.

Result: no custom REST routes; read/write via `/wp/v2/settings`; field config from initial page data.

### 4.2 Frontend

- **Bootstrap:** Use existing `config` (now including `config.fields`) and, if desired, initial values from `apiFetch({ path: '/wp/v2/settings' })` for the panel’s setting key (or pass initial values from PHP in the same bootstrap payload to avoid an extra round-trip).
- **Save:** `apiFetch({ path: '/wp/v2/settings', method: 'POST', data: { [settingKey]: values } })`. No call to current `saveOptions(restUrl, panelId, ...)`.
- **DataForm:** Add an adapter that maps `config.fields` (and panel values) to DataForm’s `data`, `fields`, and `form` props; keep conditional visibility by filtering visible fields before passing to DataForm (or by custom Edit components). Custom Edit for sortable, multi-check, heading, message as needed.

(If we keep one custom route for “bootstrap” that returns both fields and initial values, we can still use core only for save; the sketch above is for the “no custom REST at all” variant.)

---

## 5. DataForm integration (summary)

- **Package:** Add `@wordpress/dataviews`; import from `@wordpress/dataviews/wp` when using wp-scripts.
- **Adapter:** Map Optify field config (from API or inline) to DataForm `fields` (id, label, type, Edit, elements) and `form` (sections, layout). Map current values to `data`.
- **State:** Single `data` object; `onChange(newData)` updates React state and, on save, POST to `/wp/v2/settings`.
- **Conditional visibility:** Keep `isFieldVisible()` and filter the field list (or form sections) before passing to DataForm so only visible fields are rendered.
- **Custom Edit components:** Retain for sortable, multi-check, heading, message (and optionally email/url/password) where DataForm has no built-in equivalent.
- **Display modes:** Keep existing inline/toggle/modal wrappers; DataForm only replaces the inner form content.

---

## 6. What we can remove or simplify (after refactor)

- **Custom REST:** Can remove `GET/POST /options/{panelId}` entirely if we use core Settings API. Can remove `GET /fields/{panelId}` if we use inline field config (Option A).
- **panel-api.js:** `getOptions` / `saveOptions` become calls to `apiFetch` with `/wp/v2/settings`; `getFields` is either removed (inline config) or kept as a single bootstrap (Option B).
- **Rest_Handler:** Options-related routes and callbacks can be removed; optionally keep one minimal route for field/config bootstrap if we choose Option B.

---

## 7. Open points for the team

1. **Zero custom REST vs one config route**  
   Prefer **inline field config** (no custom REST) or **one GET config/bootstrap route** (simpler migration, one less change to asset/localize flow)?

2. **Setting key strategy**  
   Use each panel’s existing `options_name` as the core setting key (must be unique site-wide), or namespace with something like `optify_<panel_id>` and keep a separate internal option name for backward compatibility?

3. **Backward compatibility**  
   Should existing installs keep reading/writing the same option keys (e.g. `get_option`/`update_option`) and we only *expose* them via `register_setting` + REST, or is a one-time migration acceptable?

4. **Multi-instance / namespacing**  
   Current REST can support multiple Optify “instances” (e.g. different namespaces). With core Settings, we need a clear mapping from (instance, panel_id) to a single setting key and ensure no collisions. Agree on naming and where instance is applied.

5. **DataForm scope**  
   Roll out DataForm for “standard” fields first and keep custom field components for sortable/multi-check/heading/message, or aim for full DataForm coverage with custom Edit for everything that doesn’t map 1:1?

6. **Docs and example**  
   After refactor, document “Optify now uses core Settings API (and optionally no custom REST)” and, if useful, add or point to a small example (e.g. unadorned-announcement-bar style) that uses DataForm + core settings only.

---

## 8. References

- [How to use DataForm to create plugin settings pages](https://developer.wordpress.org/news/2026/01/how-to-use-dataform-to-create-plugin-settings-pages/)
- [How to use WordPress React components for plugin pages](https://developer.wordpress.org/news/2024/03/how-to-use-wordpress-react-components-for-plugin-pages/) (prerequisite for the DataForm article)
- [DataViews package (DataForm)](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dataviews/)
- Example codebase: `/Users/nilambar/Code/projects/unadorned-announcement-bar` (core Settings only, no custom REST; DataForm refactor branch: `dataform-refactor`)
