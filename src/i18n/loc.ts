import type { Listing } from '../data/types'
import { getLang } from './index'

/** Urdu forms of demo data (areas, restaurants, listings). Real data will carry its own translations. */
const AREA: Record<string, string> = {
  DHA: 'ڈی ایچ اے', Clifton: 'کلفٹن', 'Gulistan-e-Johar': 'گلستانِ جوہر', 'Gulshan-e-Iqbal': 'گلشنِ اقبال', Nazimabad: 'ناظم آباد',
}
const MERCHANT: Record<string, string> = {
  'Demo Biryani House': 'ڈیمو بریانی ہاؤس', 'Demo Bakers': 'ڈیمو بیکرز', 'Demo Seekh Corner': 'ڈیمو سیخ کارنر',
  'Demo Sweet Studio': 'ڈیمو سویٹ اسٹوڈیو', 'Demo Chai Café': 'ڈیمو چائے کیفے',
}
const BRANCH: Record<string, string> = {
  'Tariq Road': 'طارق روڈ', 'Khayaban-e-Ittehad': 'خیابانِ اتحاد', 'Boat Basin': 'بوٹ بیسن', 'Block 13': 'بلاک 13', 'Block H': 'بلاک ایچ',
}
const LISTING: Record<string, { title: string; contents: string; portion: string; allergens: string }> = {
  l1: { title: 'چکن بریانی، فل پلیٹ', contents: 'رائتہ اور سلاد کے ساتھ چکن بریانی۔', portion: '1 پلیٹ، تقریباً 450 گرام، ایک فرد کے لیے', allergens: 'دودھ (رائتہ)۔ دیگر الرجی کے بارے میں ریسٹورنٹ سے پوچھیں۔' },
  l2: { title: 'بیکری سرپرائز بیگ', contents: 'آج کی بچی ہوئی ڈبل روٹی، بن اور پیسٹریوں کا مکس۔ روز مختلف ہو سکتا ہے۔', portion: 'کم از کم 5 آئٹمز', allergens: 'گندم، انڈے، دودھ، گریاں ہو سکتی ہیں۔' },
  l3: { title: 'سیخ کباب پلیٹر', contents: '6 بیف سیخ کباب، 2 نان، چٹنی۔', portion: 'دو افراد کے لیے', allergens: 'گندم (نان)۔' },
  l4: { title: 'میٹھے کا سرپرائز باکس', contents: 'آج کے کیک اور پیسٹریوں کے ٹکڑے۔ ذائقے مختلف ہو سکتے ہیں۔', portion: 'کم از کم 3 ٹکڑے', allergens: 'گندم، انڈے، دودھ، گریاں۔' },
  l5: { title: 'بن کباب اور چائے', contents: '2 بن کباب اور 1 دودھ پتی۔', portion: 'ایک فرد کے لیے', allergens: 'گندم، انڈے، دودھ۔' },
}
const BATCH: Record<string, string> = { 'B-104': 'جمعے کا لنچ', 'B-105': 'ہفتے کا ڈنر', 'B-106': 'اتوار کا لنچ' }
const ur = () => getLang() === 'ur'

export const loc = {
  area: (n: string) => (ur() ? AREA[n] ?? n : n),
  merchant: (n: string) => (ur() ? MERCHANT[n] ?? n : n),
  branch: (n: string) => (ur() ? BRANCH[n] ?? n : n),
  batch: (id: string, fallback: string) => (ur() ? BATCH[id] ?? fallback : fallback),
  partner: (n: string) => (ur() ? 'ڈیمو چلڈرنز ہوم' : n),
  verifiedNote: (n: string) => (ur() ? 'تصدیق صرف ڈیمو کے لیے دکھائی گئی' : n),
  listing: (l: Listing) => (ur() && LISTING[l.id] ? LISTING[l.id] : { title: l.title, contents: l.contents, portion: l.portion, allergens: l.allergens }),
}
