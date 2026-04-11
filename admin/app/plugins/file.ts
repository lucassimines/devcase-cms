export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      file: (filename: string) => {
        if (!filename) return
        return `${nuxtApp.$config.public.imagesUrl}/${filename}`
      }
    }
  }
})
