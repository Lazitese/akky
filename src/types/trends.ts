export type TrendCategory =
  | 'ከመዋቅራችን ሁኔታ አኳያ'
  | 'ከትምህርት ተቋማት አኳያ'
  | 'ከተፎካካሪ ፓርቲዎች አኳያ'
  | 'ከአካባቢ ፖለቲካዊ ሁኔታና አዝማሚያዎች አኳያ'
  | 'ከተለያዩ ህብረተሰብ ክፍሎች ሁኔታ አኳያ'
  | 'ከኑሮ ውድነት አኳያ'
  | 'ከጸጥታና ደህንነት አኳያ'
  | 'ከመልካም አስተዳደርና አገልግሎት አሰጣጥ አኳያ';

export type TrendAnalysisType =
  | 'በአዎንታዊ የሚታይ ዝንባሌ'
  | 'ትኩረት የሚሻ ዝንባሌ'
  | 'በአሉታዊ የሚታይ ዝንባሌ';

export interface TrendItem {
  id: string;
  code: string;
  title: TrendCategory;
  analysisType: TrendAnalysisType;
  summary: string;
  details?: string;
  proposedSolution?: string;
  date: string;
  time: string;
  level: 'ክፍለ ከተማ' | 'ወረዳ';
  woredaId?: string;
  woredaName?: string;
  sector: string;
  reporterName: string;
  status: 'ተገምግሟል' | 'አዲስ የተላከ' | 'እርምጃ የተወሰደበት';
  feedback?: string;
  photoUrl?: string;
}

export const TREND_CATEGORIES: TrendCategory[] = [
  'ከመዋቅራችን ሁኔታ አኳያ',
  'ከትምህርት ተቋማት አኳያ',
  'ከተፎካካሪ ፓርቲዎች አኳያ',
  'ከአካባቢ ፖለቲካዊ ሁኔታና አዝማሚያዎች አኳያ',
  'ከተለያዩ ህብረተሰብ ክፍሎች ሁኔታ አኳያ',
  'ከኑሮ ውድነት አኳያ',
  'ከጸጥታና ደህንነት አኳያ',
  'ከመልካም አስተዳደርና አገልግሎት አሰጣጥ አኳያ',
];

export const TREND_ANALYSIS_TYPES: TrendAnalysisType[] = [
  'በአዎንታዊ የሚታይ ዝንባሌ',
  'ትኩረት የሚሻ ዝንባሌ',
  'በአሉታዊ የሚታይ ዝንባሌ',
];
