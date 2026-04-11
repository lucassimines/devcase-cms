export default defineNuxtPlugin({
  async setup() {
    const navigation = {
      main: [
        {
          label: 'Home',
          icon: 'i-lucide-house',
          to: '/'
        }
      ]
    }

    return {
      provide: {
        navigation
      }
    }
  }
})
