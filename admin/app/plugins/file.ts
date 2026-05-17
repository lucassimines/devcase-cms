export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      file: (filename: string) => {
        if (!filename) return
        // Alias path for NuxtImg — resolved via `image.alias.cms` in nuxt.config
        return `/cms/${filename}`
      }
    }
  }
})
