import type { ImageBlock, TextBlock, TextImageBlock, WebBlock } from '~/types/block'

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

  function createTextImageBlockInput(): TextImageBlock {
    return {
      image: '',
      title: '',
      text: '',
      textPosition: 'left'
    }
  }

  return {
    createTextBlockInput,
    createWebBlockInput,
    createImageBlockInput,
    createTextImageBlockInput
  }
}
