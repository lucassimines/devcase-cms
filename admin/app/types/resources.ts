/**
 * Resource definition: admin entities with list/create/edit.
 * Label is resolved from i18n (model.{model}.name) in the resources plugin.
 */
export interface Resource {
  model: string
  path: string
  icon: string
  label: string
}

/** Config for defining resources; label is derived from model in useResources(). */
export interface ResourceConfig {
  model: string
  path: string
  icon: string
}

/** Keys of resources provided by the resources plugin. Extend when adding new resources. */
export type ResourceKey = 'client' | 'task'

/** Shape of $resources from the resources plugin. Use `typeof nuxtApp.$resources` at runtime if you need the exact object type. */
export type Resources = Record<ResourceKey, Resource>
