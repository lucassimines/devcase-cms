---
name: cms-admin
description: Nuxt 4 admin SPA patterns for Devcase CMS — resource tables, Zod forms, Pinia auth, blocks, and media. Use when adding or editing admin pages, fields, or entity CRUD UI.
---

# CMS admin

Package: `admin/`. Nuxt 4 + Nuxt UI v4 + Pinia + Tailwind 4. Framework details: existing `nuxt`, `vue`, `nuxt-ui` skills under `admin/.agents/skills/`.

## Data access

- `$adminApi` / `useAdminApi`: `public.adminApiUrl`, `Authorization: Bearer` from `useAuthStore`.
- Do not call the public web API from admin mutations.

## CRUD UI

Reuse, do not fork:

- Lists: `ResourceTable` / `ResourceTablePanel`
- Create/update: `ResourceFormCreate` / `ResourceFormUpdate` with a Zod schema (`UForm`)
- Published: `USwitch` bound when the schema has `published`
- Tabs: `useFormTabs` + `FormTabNav`
- Confirm: `useConfirmDialog`

Entity pages live at `admin/app/pages/<entity>/index.vue` and `[id].vue`. Follow `page` or `project` as the template.

## Localized fields and blocks

- `emptyLocalizedString()` for new JSON text/image fields.
- Block editors: `useFormBlocks` + `FieldBlock` / `FieldBlockRepeater`. Types in `admin/app/types/block.ts` must match **devcase-web** `app/types/block.ts`.
- Page-specific JSON (`PageHome`, etc.) lives in `admin/app/types/page.ts` and a `Page*` form component. Update the public site only after the stored shape is stable.

## i18n

Admin chrome: `admin/i18n/locales/en-us.json`. Add keys when adding buttons/labels. Content locales remain `en-US` + `pt-BR` on the model.

## Auth

`stores/auth.ts`, `refreshToken.global.ts`, `authRouteRedirect.global.ts`. Login lives under `pages/auth/`. Do not store passwords in Pinia beyond the submit payload.

## Checks

`npm run test`, `npm run typecheck`, `npm run check` in `admin/`.
