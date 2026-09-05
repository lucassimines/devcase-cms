import 'dotenv/config'

import { prisma } from '../src/db.js'

type Localized = { 'pt-BR': string; 'en-US': string }

function t(pt: string, en: string): Localized {
  return { 'pt-BR': pt, 'en-US': en }
}

const IOS_URL = 'https://apps.apple.com/br/app/priceflip/id6797083313'

const homePriceFlip = {
  badge: t('App para viagem', 'Travel app'),
  title: t('PriceFlip', 'PriceFlip'),
  description: t(
    'Converta preços na viagem com o câmbio que você realmente pagou. Escaneie a etiqueta, some impostos e veja o custo real na sua moeda — sem cotação genérica de mercado.',
    'Convert prices while you travel with the exchange rate you actually paid. Scan a tag, add taxes, and see the real cost in your currency — not a generic mid-market quote.'
  ),
  cta_text: t('Conhecer o PriceFlip', 'Get PriceFlip'),
  image: t('priceflip-scan-pt-br.webp', 'priceflip-scan-en-us.webp'),
  ios_url: IOS_URL
}

const priceflipContent = {
  seo: {
    title: t(
      'PriceFlip — converter preço na viagem com o seu câmbio',
      'PriceFlip — convert travel prices with your own exchange rate'
    ),
    description: t(
      'PriceFlip é o jeito fácil de converter preços na viagem. Escaneie etiquetas, use o câmbio que você pagou e veja o custo real com IOF, taxas e impostos. Grátis no iPhone. Android em breve.',
      'PriceFlip is the easy way to convert prices while traveling. Scan tags, use the rate you actually paid, and see the real cost with taxes and fees. Free on iPhone. Android coming soon.'
    ),
    keywords: t(
      'converter preço viagem, câmbio da viagem, conversor de moeda para viajante, escanear etiqueta, preço real no exterior, IOF, converter euro real, converter dólar real, PriceFlip',
      'travel price converter, convert prices abroad, currency converter for travelers, scan price tag, real exchange rate, travel taxes, convert euro to usd, PriceFlip'
    )
  },
  hero: {
    badge: t('Grátis no iPhone', 'Free on iPhone'),
    title: t(
      'Converta preços na viagem do jeito mais fácil',
      'The easy way to convert prices when you travel'
    ),
    subtitle: t(
      'Preço real no câmbio da viagem — não na cotação da internet.',
      'The real cost at your trip rate — not the internet quote.'
    ),
    description: t(
      'A maioria dos conversores mostra a cotação mid-market, que você quase nunca consegue no caixa, no cartão ou no Wise. O PriceFlip parte do câmbio que você de fato pagou, soma impostos e taxas se quiser, e responde na hora: quanto isso me custa? Aponte a câmera para a etiqueta ou digite o valor. Sem conta para escanear. Sem dados coletados.',
      'Most converters show a mid-market rate you almost never get at the booth, card, or Wise. PriceFlip starts from the rate you actually paid, adds taxes and fees if you want, and answers immediately: what does this cost me? Point the camera at a tag or type the amount. No account to scan. No data collected.'
    ),
    image: t('priceflip-scan-pt-br.webp', 'priceflip-scan-en-us.webp')
  },
  highlights: [
    {
      title: t('Seu câmbio, não o do mercado', 'Your rate, not the market rate'),
      description: t(
        'Informe quanto você pagou por 1 unidade da moeda local. Cada etiqueta passa a refletir o dinheiro que saiu da sua conta nesta viagem.',
        'Enter what you paid for 1 unit of the local currency. Every price tag then reflects the money that actually left your account on this trip.'
      )
    },
    {
      title: t('Escaneie e decida na loja', 'Scan and decide in the store'),
      description: t(
        'OCR no aparelho lê a etiqueta. Você vê o preço na sua moeda antes de chegar no caixa — ideal para shopping, farmácia e souvenir.',
        'On-device OCR reads the tag. You see the price in your currency before you reach the till — perfect for shops, pharmacies, and souvenirs.'
      )
    },
    {
      title: t('Impostos e taxas no total', 'Taxes and fees in the total'),
      description: t(
        'Some IOF, imposto estadual, taxa do cartão ou qualquer percentual extra. O número na tela bate com o que você vai gastar.',
        'Add IOF, local tax, card fees, or any extra percentage. The number on screen matches what you will actually spend.'
      )
    }
  ],
  how_it_works: {
    title: t('Como converter um preço em 3 passos', 'How to convert a price in 3 steps'),
    items: [
      {
        title: t('Defina o câmbio da viagem', 'Set your trip exchange rate'),
        description: t(
          'Digite quanto você pagou por 1 euro, dólar, iene ou a moeda do destino. Use o valor do cartão, do câmbio físico ou do Wise — o seu, não o da home broker.',
          'Enter what you paid for 1 euro, dollar, yen, or local unit. Use the card, booth, or Wise rate — yours, not a homepage ticker.'
        )
      },
      {
        title: t('Aponte a câmera ou digite', 'Point the camera or type'),
        description: t(
          'Escaneie a etiqueta com OCR no iPhone ou use o modo calculadora quando preferir digitar. Conversão ao vivo na Home e no Scan.',
          'Scan the tag with on-device OCR or use calculator mode when you would rather type. Live conversion on Home and Scan.'
        )
      },
      {
        title: t('Compre com o custo real', 'Buy with the real cost'),
        description: t(
          'Veja o preço na sua moeda, com impostos se você ligou. Conversões recentes ficam no aparelho para comparar o que você viu na rua.',
          'See the price in your currency, with taxes if you turned them on. Recent conversions stay on device so you can compare what you saw outside.'
        )
      }
    ]
  },
  features: {
    title: t('Feito para quem viaja e precisa de um número honesto', 'Built for travelers who need an honest number'),
    items: [
      {
        title: t('Escaneamento com OCR no aparelho', 'On-device OCR scanning'),
        description: t(
          'Lê etiquetas sem enviar foto para a nuvem. Sem conta para escanear e sem fila de upload em roaming caro.',
          'Reads tags without uploading photos. No account to scan, and no upload queue on expensive roaming.'
        )
      },
      {
        title: t('Modo calculadora', 'Calculator mode'),
        description: t(
          'Quando a etiqueta está ruim para a câmera, digite o valor e continue usando o mesmo câmbio da viagem.',
          'When a tag is hard to scan, type the amount and keep using the same trip rate.'
        )
      },
      {
        title: t('Câmbio manual ou referência de mercado', 'Manual rate or market reference'),
        description: t(
          'Trave o câmbio que você negociou. Se quiser, consulte uma referência de mercado — a decisão continua sendo o seu número.',
          'Lock the rate you negotiated. Optionally check a market reference — the decision still uses your number.'
        )
      },
      {
        title: t('IOF, impostos e taxas em %', 'IOF, taxes, and fees as %'),
        description: t(
          'Brasileiros no exterior sentem IOF e spread do cartão. Some percentuais extras para o total não mentir na hora de pagar.',
          'Travelers often miss card spread and local tax. Add extra percentages so the total is honest at checkout.'
        )
      },
      {
        title: t('Conversões recentes no iPhone', 'Recent conversions on your iPhone'),
        description: t(
          'O histórico fica no aparelho. Útil para comparar o café da esquina com a loja da avenida sem abrir a planilha.',
          'History stays on device. Compare the corner café with the high-street shop without opening a spreadsheet.'
        )
      },
      {
        title: t('Português, inglês e espanhol', 'Portuguese, English, and Spanish'),
        description: t(
          'Interface no idioma da viagem. Privacidade simples: o desenvolvedor não coleta dados deste app.',
          'UI in the language of your trip. Simple privacy: the developer does not collect data from this app.'
        )
      }
    ]
  },
  download: {
    title: t('Baixe o PriceFlip e converta o próximo preço', 'Download PriceFlip and convert the next price'),
    description: t(
      'Disponível grátis na App Store para iPhone e iPad (iOS 16.4 ou posterior). A versão para Android está a caminho — enquanto isso, abra esta página nos favoritos ou envie o link para quem viaja com você.',
      'Free on the App Store for iPhone and iPad (iOS 16.4 or later). Android is on the way — meanwhile, bookmark this page or send the link to whoever is traveling with you.'
    ),
    ios_label: t('Baixar na App Store', 'Download on the App Store'),
    android_label: t('Disponível no Google Play', 'Get it on Google Play'),
    android_soon: t('Android em breve', 'Android coming soon'),
    ios_url: IOS_URL,
    android_url: ''
  },
  faq: {
    title: t('Perguntas frequentes sobre converter preços na viagem', 'Frequently asked questions about converting travel prices'),
    items: [
      {
        question: t(
          'Por que não usar só o conversor do Google ou do banco?',
          'Why not just use Google or my bank converter?'
        ),
        answer: t(
          'Esses apps mostram uma cotação média ou o câmbio do banco naquele segundo. Na rua, o que importa é o câmbio que você já pagou nesta viagem — mais IOF, spread e imposto local. O PriceFlip guarda esse número e aplica em cada etiqueta.',
          'Those tools show a mid-market or bank ticker. In a store, what matters is the rate you already paid on this trip — plus tax, spread, and local fees. PriceFlip keeps that number and applies it to every tag.'
        )
      },
      {
        question: t('O PriceFlip funciona offline?', 'Does PriceFlip work offline?'),
        answer: t(
          'Escanear e converter usam o câmbio que você definiu no aparelho. Não precisa de conta e o OCR roda no iPhone, o que ajuda em roaming ou metrô sem sinal.',
          'Scanning and converting use the rate you set on the device. No account is required, and OCR runs on the iPhone, which helps on roaming or underground.'
        )
      },
      {
        question: t('Vocês coletam meus dados ou minhas fotos?', 'Do you collect my data or photos?'),
        answer: t(
          'Não. A ficha da App Store indica que os desenvolvedores não coletam dados deste app. O escaneamento acontece no aparelho. Leia a política de privacidade para o detalhe legal.',
          'No. The App Store privacy label states that the developer does not collect data from this app. Scanning happens on device. Read the privacy policy for the legal detail.'
        )
      },
      {
        question: t('Quando sai a versão Android?', 'When is the Android version coming?'),
        answer: t(
          'A versão para Android está em breve. Enquanto isso, baixe no iPhone pela App Store e compartilhe esta página — lucassimines.dev/priceflip — para quem for te encontrar no destino.',
          'Android is coming soon. Meanwhile, download on iPhone from the App Store and share this page — lucassimines.dev/priceflip — with whoever you will meet at the destination.'
        )
      },
      {
        question: t('O app é pago?', 'Is the app paid?'),
        answer: t(
          'O PriceFlip é grátis na App Store. Você converte preços, escaneia etiquetas e usa o câmbio da viagem sem assinatura para o fluxo principal.',
          'PriceFlip is free on the App Store. Convert prices, scan tags, and use your trip rate without a subscription for the core flow.'
        )
      }
    ]
  },
  privacy_label: t('Política de privacidade do PriceFlip', 'PriceFlip privacy policy')
}

async function main() {
  const home = await prisma.page.findFirst({
    where: { code: 'home' }
  })

  if (home) {
    const current =
      home.content && typeof home.content === 'object' && !Array.isArray(home.content)
        ? (home.content as Record<string, unknown>)
        : {}

    await prisma.page.update({
      where: { id: home.id },
      data: {
        content: {
          ...current,
          priceflip: homePriceFlip
        }
      }
    })

    console.log(`Updated home page ${home.id} with PriceFlip section copy`)
  } else {
    console.log('Home page not found — skipped homepage PriceFlip fields')
  }

  const existing = await prisma.page.findFirst({
    where: { OR: [{ slug: 'priceflip' }, { code: 'priceflip' }] }
  })

  const pageData = {
    name: t('PriceFlip', 'PriceFlip'),
    code: 'priceflip',
    slug: 'priceflip',
    published: true,
    content: priceflipContent,
    blocks: existing?.blocks ?? []
  }

  if (existing) {
    await prisma.page.update({
      where: { id: existing.id },
      data: pageData
    })
    console.log(`Updated PriceFlip page ${existing.id}`)
  } else {
    const maxOrder = await prisma.page.aggregate({ _max: { order: true } })
    await prisma.page.create({
      data: {
        ...pageData,
        order: (maxOrder._max.order ?? 0) + 1
      }
    })
    console.log('Created PriceFlip page')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
