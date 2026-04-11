import type { BreadcrumbItem } from '@nuxt/ui'
import type { Ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { Resources } from '~/types/resources'

type BreadcrumbLabelResolver = (context: BreadcrumbResolverContext) => string | undefined

interface BreadcrumbResolverContext {
  route: RouteLocationNormalizedLoaded
  resources: Resources
  segment: string
  segmentPath: string
  index: number
  isLast: boolean
  dynamicParamKey?: string
  dynamicParamValue?: string
}

interface UseBreadcrumbsOptions {
  /**
   * Optional static label overrides by segment key.
   * Use plain path segment keys (e.g. "client", "task", "profile").
   */
  labels?: Record<string, string>
  /**
   * Optional icon overrides by segment key.
   */
  icons?: Record<string, string>
  /**
   * Optional resolver for dynamic params by route param key.
   * Example: { id: ({ dynamicParamValue }) => client.value?.name ?? dynamicParamValue }
   */
  dynamicLabels?: Record<string, string | BreadcrumbLabelResolver>
  /**
   * Optional list of segment keys to hide.
   */
  hiddenSegments?: string[]
  /**
   * Show non-terminal dynamic segments (e.g. ":id" in /client/:id/task/:task).
   * Defaults to false to keep breadcrumbs concise: /client/task/task-name.
   */
  includeIntermediateDynamicSegments?: boolean
  /**
   * Resource/entity to improve dynamic labels for detail pages.
   * If not provided, uses useResource() internal entity store.
   */
  entity?: Ref<Record<string, unknown> | null>
}

interface SegmentMeta {
  key: string
  value: string
  isDynamic: boolean
  paramKey?: string
}

function normalizeResourcePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}

function prettifyLabel(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function getEntityLabel(entity: Record<string, unknown> | null): string | undefined {
  if (!entity) return undefined

  const candidate = entity.title ?? entity.name ?? entity.slug ?? entity.id

  if (candidate == null) return undefined
  if (typeof candidate === 'string') return candidate
  if (typeof candidate === 'number' || typeof candidate === 'boolean') return String(candidate)

  return undefined
}

function parseRouteSegments(route: RouteLocationNormalizedLoaded): SegmentMeta[] {
  const pathParts = route.path.split('/').filter(Boolean)

  if (pathParts.length === 0) return []

  // Use the most specific matched record to recover dynamic segment names.
  const currentRecord = route.matched[route.matched.length - 1]
  if (!currentRecord?.path) {
    return pathParts.map((part) => ({ key: part, value: part, isDynamic: false }))
  }

  const patternParts = currentRecord.path.split('/').filter(Boolean)
  const alignedPatternParts = patternParts.slice(-pathParts.length)

  return pathParts.map((value, index) => {
    const pattern = alignedPatternParts[index]
    const dynamicMatch = pattern?.match(/^:([^()/?+*]+)(?:\(.*\))?[?+*]?$/)
    const paramKey = dynamicMatch?.[1]

    if (!paramKey) {
      return {
        key: value,
        value,
        isDynamic: false
      }
    }

    return {
      key: paramKey,
      value,
      isDynamic: true,
      paramKey
    }
  })
}

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}) {
  const route = useRoute()
  const { $resources } = useNuxtApp()
  const { t } = useI18n()
  const internalResource = useResource<Record<string, unknown>>()
  const entity = options.entity ?? internalResource.entity

  const resources = $resources as Resources
  const resourcesByPath: Record<string, Resources[keyof Resources]> = {}
  for (const resource of Object.values(resources)) {
    resourcesByPath[normalizeResourcePath(resource.path)] = resource
  }

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const segments = parseRouteSegments(route)
    if (segments.length === 0) return []

    const hidden = new Set(options.hiddenSegments ?? [])
    const itemList: BreadcrumbItem[] = []
    let runningPath = ''

    segments.forEach((segment, index) => {
      runningPath += `/${segment.value}`
      const isLast = index === segments.length - 1
      const hasDynamicResolver = Boolean(
        segment.paramKey && options.dynamicLabels?.[segment.paramKey] !== undefined
      )
      const shouldHideIntermediateDynamic =
        segment.isDynamic &&
        !isLast &&
        !hasDynamicResolver &&
        !options.includeIntermediateDynamicSegments

      if (hidden.has(segment.key) || hidden.has(segment.value) || shouldHideIntermediateDynamic) {
        return
      }

      const context: BreadcrumbResolverContext = {
        route,
        resources,
        segment: segment.value,
        segmentPath: runningPath,
        index,
        isLast,
        dynamicParamKey: segment.paramKey,
        dynamicParamValue: segment.value
      }

      let label: string | undefined
      let icon: string | undefined

      const resource = resourcesByPath[segment.value]
      if (resource) {
        label = resource.label
        icon = resource.icon
      }

      if (!segment.isDynamic) {
        label ??= options.labels?.[segment.key]
        label ??= options.labels?.[segment.value]
        label ??= prettifyLabel(segment.value)
      } else {
        const resolver = segment.paramKey ? options.dynamicLabels?.[segment.paramKey] : undefined
        if (typeof resolver === 'function') {
          label = resolver(context) ?? ''
        } else if (typeof resolver === 'string') {
          label = resolver
        } else {
          label = isLast ? (getEntityLabel(entity.value) ?? '') : ''
        }
      }

      icon ??= options.icons?.[segment.key]
      icon ??= options.icons?.[segment.value]

      itemList.push({
        label,
        icon,
        to: !isLast ? runningPath : undefined
      })
    })

    const last = itemList.at(-1)
    if (last) {
      last.to = undefined
      last.active = true
    }

    if (itemList.length === 1 && itemList[0]) {
      const [single] = itemList
      single.label = single.label ?? t('item', 1)
    }

    return itemList
  })

  return {
    breadcrumbs
  }
}
