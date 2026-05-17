export default defineAppConfig({
  timeZone: 'America/Sao_Paulo',
  ui: {
    input: {
      variants: {
        size: {
          xl: {
            root: 'w-full'
          }
        }
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    select: {
      variants: {
        size: {
          xl: {
            base: 'w-full'
          }
        }
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    textarea: {
      variants: {
        size: {
          xl: {
            root: 'w-full'
          }
        }
      },
      defaultVariants: {
        size: 'xl'
      }
    },
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
      primary: 'primary',
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
