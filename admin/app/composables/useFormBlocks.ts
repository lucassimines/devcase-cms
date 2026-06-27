import type { ImageBlock, TextBlock, TextImageBlock, WebBlock } from '~/types/block'

export function useFormBlocks() {
  function createTextBlockInput(): TextBlock {
    return {
      text: emptyLocalizedString()
    }
  }

  function createWebBlockInput(): WebBlock {
    return {
      image: {
        desktop: emptyLocalizedString(),
        mobile: emptyLocalizedString()
      }
    }
  }

  function createImageBlockInput(): ImageBlock {
    return {
      image: emptyLocalizedString()
    }
  }

  function createTextImageBlockInput(): TextImageBlock {
    return {
      image: emptyLocalizedString(),
      title: emptyLocalizedString(),
      text: emptyLocalizedString(),
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
