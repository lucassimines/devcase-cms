export type CoverImageInput = {
  title: string
  excerpt?: string
  style?: string
}

export type GeneratedCoverImage = {
  filename: string
  image: {
    'en-US': string
    'pt-BR': string
  }
}
