export type Lang = 'en' | 'hy'

type MarketingMessages = {
  nav: {
    features: string
    howItWorks: string
    pricing: string
    blog: string
    login: string
    getStarted: string
  }
  hero: {
    pill: string
    title: string
    highlight: string
    titleSuffix: string
    description: string
    primaryCta: string
    secondaryCta: string
    socialProof: string
  }
  sections: {
    featuresTitle: string
    featuresSubtitle: string
    pricingTitle: string
    pricingSubtitle: string
    ctaOverline: string
    ctaTitle: string
  }
  pricing: {
    starterName: string
    starterPrice: string
    starterDesc: string
    starterCta: string
    proName: string
    proPrice: string
    proBadge: string
    proDesc: string
    proCta: string
    teamName: string
    teamPrice: string
    teamDesc: string
    teamCta: string
  }
}

type Messages = {
  marketing: MarketingMessages
}

const messages: Record<Lang, Messages> = {
  en: {
    marketing: {
      nav: {
        features: 'Features',
        howItWorks: 'How it Works',
        pricing: 'Pricing',
        blog: 'Blog',
        login: 'Log in',
        getStarted: 'Get Started'
      },
      hero: {
        pill: 'Turn one YouTube into 20+ socials',
        title: 'Transform Your Content into',
        highlight: 'Viral Social Assets',
        titleSuffix: 'in Seconds',
        description:
          'Stop wasting hours on manual editing. Our AI automatically repurposes your blogs, podcasts, and videos for every major platform.',
        primaryCta: 'Get Started for Free',
        secondaryCta: 'See how it works',
        socialProof: 'Trusted by 5,000+ creators and agencies'
      },
      sections: {
        featuresTitle: 'One Source, Infinite Possibilities',
        featuresSubtitle:
          'Our AI deeply understands your content and generates on-brand assets for every major social platform automatically.',
        pricingTitle: 'Simple, Transparent Pricing',
        pricingSubtitle: 'Scale your content without breaking the bank. Upgrade or downgrade anytime.',
        ctaOverline: 'Ready to dominate social media?',
        ctaTitle: 'Join thousands of creators turning one piece of content into a month of posts.'
      },
      pricing: {
        starterName: 'Starter',
        starterPrice: '$0',
        starterDesc: 'Perfect for creators starting out.',
        starterCta: 'Choose Starter',
        proName: 'Professional',
        proPrice: '$39',
        proBadge: 'Most Popular',
        proDesc: 'For creators who want a real content engine.',
        proCta: 'Choose Professional',
        teamName: 'Team',
        teamPrice: '$99',
        teamDesc: 'Built for agencies and marketing teams.',
        teamCta: 'Contact Sales'
      }
    }
  },
  hy: {
    marketing: {
      nav: {
        features: 'Հնարավորություններ',
        howItWorks: 'Ինչպես է աշխատում',
        pricing: 'Գներ',
        blog: 'Բլոգ',
        login: 'Մուտք',
        getStarted: 'Գրանցվել'
      },
      hero: {
        pill: 'Դասընթաց 0-ից',
        title: 'Դարձիր պահանջված մասնագետ',
        highlight: 'Wildberries-ում',
        titleSuffix: 'և սկսիր վաստակել',
        description:
          'Միացիր մեր դասընթացին և ստացիր գործնական գիտելիքներ՝ Wildberries-ում հաջողության հասնելու համար։',
        primaryCta: 'Գրանցվել դասընթացին',
        secondaryCta: 'Տեսնել ծրագիրը',
        socialProof: 'Մեզ վստահում են 100-ից ավել ուսանողներ'
      },
      sections: {
        featuresTitle: 'Ինչու՞ է այս դասընթացը քեզ համար',
        featuresSubtitle:
          'Մենք կտանք բոլոր անհրաժեշտ գործիքները՝ հաջողության հասնելու համար։',
        pricingTitle: 'Դասընթացի արժեքը',
        pricingSubtitle: 'Ներդրում, որը կփոխի քո կարիերան։',
        ctaOverline: 'Պատրա՞ստ ես սկսել',
        ctaTitle: 'Գրանցվիր հիմա և ստացիր քո տեղը խմբում։'
      },
      pricing: {
        starterName: 'Ստարտեր',
        starterPrice: '0 ֏',
        starterDesc: 'Լավ տարբերակ՝ նոր սկսողների համար։',
        starterCta: 'Ընտրել Ստարտեր',
        proName: 'Պրոֆեսիոնալ',
        proPrice: '$39',
        proBadge: 'Ամենահայտնի',
        proDesc: 'Նրանց համար, ովքեր ուզում են իրական կոնտենտային մեքենա։',
        proCta: 'Ընտրել Պրոֆեսիոնալ',
        teamName: 'Թիմ',
        teamPrice: '$99',
        teamDesc: 'Գործակալությունների և մարկետինգային թիմերի համար։',
        teamCta: 'Կապվել վաճառքի բաժնի հետ'
      }
    }
  }
}

export function resolveLang(): Lang {
  return 'hy'
}

export function getMessages(lang: Lang): Messages {
  return messages[lang] ?? messages.en
}
