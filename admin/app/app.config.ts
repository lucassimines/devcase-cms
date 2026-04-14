export default defineAppConfig({
  timeZone: 'America/Sao_Paulo',
  ui: {
    checkboxGroup: {
      slots: {
        fieldset: ['flex-wrap'],
        item: ['cursor-pointer p-2']
      },
      variants: {
        size: {
          md: {
            fieldset: ['gap-3']
          }
        }
      }
    },
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
