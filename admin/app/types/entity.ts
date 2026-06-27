/**
 * Entity definition: admin entities with list/create/edit.
 * Label is resolved from i18n (model.{model}.name) in the entities plugin.
 */
export interface Entity {
  model: string
  path: string
  icon: string
  label: string
  children?: Entity[]
}

/** Config for defining entities; label is derived from model in useEntitys(). */
export interface EntityConfig {
  model: string
  path: string
  icon: string
}

/** Keys of entities provided by the entities plugin. Extend when adding new entities. */
export type EntityKey = 'page' | 'post' | 'category' | 'project' | 'technology' | 'solution' | 'settings'

/** Shape of $entities from the entities plugin. Use `typeof nuxtApp.$entities` at runtime if you need the exact object type. */
export type Entities = Record<EntityKey, Entity>
