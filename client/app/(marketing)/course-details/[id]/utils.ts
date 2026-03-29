// Format duration from seconds or string to readable format
export function formatDuration(duration: string | number | undefined): string {
  if (!duration) return '15:00'

  // If it's already a formatted string like "15:00" or "1:30:00", return as is
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration
  }

  // Convert to number (seconds)
  const totalSeconds = typeof duration === 'string' ? parseInt(duration, 10) : duration

  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    return '15:00'
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Calculate price display values
export function calculatePriceDisplay(price: number | string, discount?: number | string) {
  const priceStr = typeof price === 'number' ? `${price} դրամ` : `${price} դրամ`
  const originalPrice = discount ? `${Number(price) * 2} դրամ` : ''
  const discountStr = discount ? `${discount}% ԶԵՂՉ` : ''

  return { price: priceStr, originalPrice, discount: discountStr }
}

// Default course content
export function getDefaultLearnItems(): string[] {
  return [
    'Ապրանքի ընտրություն և մատակարարների հետ աշխատանքի հիմունքներ',
    'Քարտերի ստեղծում և օպտիմալացում Wildberries-ում',
    'Լոգիստիկա, գների մոդելավորում և շահութաբերություն',
    'Մարքեթինգ, ակցիաներ և մասշտաբավորում',
    'Վաճառքի վերլուծություն և հաշվետվությունների կազմում',
    'Մրցակիցների վերլուծություն և ռազմավարության մշակում'
  ]
}

export function getDefaultRequirements(): string[] {
  return [
    'Համակարգիչ կամ նոութբուկ ինտերնետ հասանելիությամբ',
    'Wildberries-ում գրանցված գործընկերոջ հաշիվ (ցանկալի է, բայց պարտադիր չէ)',
    'Սովորելու և կիրառելու պատրաստակամություն'
  ]
}

export function getDefaultIncludes(duration?: string): string[] {
  return [
    `${duration || '6 ժամ'} ընդհանուր տևողություն`,
    '12 ներբեռնվող ռեսուրսներ',
    'Անսահմանափակ մուտք',
    'Հասանելի բջջայինով և TV-ով',
    'Ավարտական վկայական'
  ]
}
