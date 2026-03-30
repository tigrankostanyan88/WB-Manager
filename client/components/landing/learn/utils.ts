// Learn section types and constants

export interface LearnStep {
  number: string
  title: string
  description: string
  color: 'violet' | 'blue' | 'orange' | 'pink' | 'slate'
}

export interface PhoneBar {
  bg: string
}

export const STEPS: LearnStep[] = [
  {
    number: '01',
    title: 'Մեկնարկ և Գրանցում',
    description:
      'Անհատ ձեռնարկատիրոջ գրանցում, Wildberries կաբինետի բացում և իրավաբանական հարցերի կարգավորում:',
    color: 'violet',
  },
  {
    number: '02',
    title: 'Ապրանքի Ընտրություն',
    description:
      'Շուկայի վերլուծություն, շահավետ նիշայի ընտրություն և մատակարարների հետ բանակցություններ:',
    color: 'blue',
  },
  {
    number: '04',
    title: 'Մարքեթինգ և Գովազդ',
    description:
      'Ներքին և արտաքին գովազդի կարգավորում, SEO օպտիմիզացիա և վաճառքների խթանում:',
    color: 'orange',
  },
  {
    number: '03',
    title: 'Լիստինգ և Կոնտենտ',
    description:
      'Պրոֆեսիոնալ լուսանկարներ, ինֆոգրաֆիկա և վաճառող տեքստերի ստեղծում:',
    color: 'pink',
  },
]

export const PHONE_CHART_BARS: PhoneBar[] = [
  { bg: 'bg-violet-100' },
  { bg: 'bg-blue-100' },
  { bg: 'bg-pink-100' },
  { bg: 'bg-orange-100' },
]
