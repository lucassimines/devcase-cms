import type { ImageBlock, TextBlock, WebBlock } from '~/types/block'

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

  function createImageBlockInput(): ImageBlock {
    return {
      image: ''
    }
  }

  return {
    createTextBlockInput,
    createWebBlockInput,
    createImageBlockInput
  }
}
