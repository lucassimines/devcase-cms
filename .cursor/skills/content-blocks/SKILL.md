---
name: content-blocks
description: Shared page/project block JSON contract between CMS admin and Devcase Web. Use when adding or changing text, image, web, or text_image blocks, or page `content` JSON.
---

# Content blocks

Blocks are stored as JSON on `Page.blocks` / `Project.blocks`:

```ts
{ type: 'text' | 'image' | 'web' | 'text_image', content: { ... } }
```

`content` fields that are copy or media paths are `LocalizedString` (`en-US` and `pt-BR`).

## Current map

| type | content | Admin field | Web component |
| --- | --- | --- | --- |
| `text` | `text` | `FieldBlockText` | `BlockText` |
| `image` | `image` | `FieldBlockImage` | `BlockImage` |
| `web` | `image.desktop`, `image.mobile` | `FieldBlockWeb` | `BlockWeb` |
| `text_image` | `image`, `title`, `text`, `textPosition` | `FieldBlockTextImage` | `BlockTextImage` |

Factories: `admin/app/composables/useFormBlocks.ts`.

## Adding a type

1. CMS `admin/app/types/block.ts` + factory + `FieldBlock*` + resolver in `FieldBlock.vue`.
2. Web `app/types/block.ts` + `Block*` + `BlockResolver`.
3. Any seed/import scripts (`server/scripts/*`) that write blocks.
4. Do not migrate old rows unless you add a server-side migrator (see `migrateProjectBlock` in `localized-json.utils.ts`).

## Page `content` JSON

Some pages use typed `content` besides `blocks` (home intro, tools intro). Defaults belong in `admin/app/types/page.ts` (`PAGE_*_DEFAULT`). The public frontend must use the same keys.
