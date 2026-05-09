import { en } from './en'
import { tr } from './tr'
import { zhHans } from './zh-Hans'

export type GachaLocale = 'en' | 'tr' | 'cn'

export type GachaStrings = typeof en

const STRINGS: Record<GachaLocale, GachaStrings> = {
  en,
  tr,
  cn: zhHans,
}

export function getGachaStrings(locale: GachaLocale): GachaStrings {
  return STRINGS[locale]
}
