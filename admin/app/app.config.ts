export default defineAppConfig({
  timeZone: 'America/Sao_Paulo',
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc'
    },
    button: {
      slots: {
        base: ['cursor-pointer']
      }
    },
    table: {
      slots: {
        th: ['whitespace-nowrap']
      }
    },
    checkbox: {
      slots: {
        base: ['cursor-pointer hover:ring-inherit']
      }
    }
  }
})
