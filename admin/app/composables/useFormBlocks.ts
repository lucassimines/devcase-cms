import type { TextBlock, WebBlock } from '~/types/block'

export function useFormBlocks() {
  function createTextBlockInput(): TextBlock {
    return {
      text: ''
    }
  }

  function createWebBlockInput(): WebBlock {
    return {
      image: {
        desktop: '',
        mobile: ''
      }
    }
  }

  return {
    createTextBlockInput,
    createWebBlockInput
  }
}
