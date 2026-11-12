export type UserRole = 
  | 'SUBCITY_SUPER_ADMIN'   // የክ/ከተማ ዋና አስተዳዳሪ (Super Admin)
  | 'SUBCITY_SECTOR_ADMIN'  // የክ/ከተማ ዘርፍ ኃላፊ (Sector Admin)
  | 'WOREDA_SUPER_ADMIN'    // የወረዳ ዋና አስተዳዳሪ (Woreda Super Admin)
  | 'WOREDA_SECTOR_ADMIN';  // የወረዳ ዘርፍ ኃላፊ (Woreda Sector Admin)

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  roleTitleAmharic: string;
  sectorId?: string;
  sectorName?: string;
  woredaId?: string;
  woredaName?: string;
}

export const PRESET_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'ዶ/ር አለሙ በቀለ',
    username: 'superadmin',
    role: 'SUBCITY_SUPER_ADMIN',
    roleTitleAmharic: 'የክ/ከተማ ዋና አስተዳዳሪ (Super Admin)',
  },
  {
    id: 'usr-2',
    name: 'አቶ አበበ በላይነህ',
    username: 'subcity_pol',
    role: 'SUBCITY_SECTOR_ADMIN',
    roleTitleAmharic: 'የክ/ከተማ ፖለቲካ ዘርፍ ኃላፊ',
    sectorId: 'sec-pol',
    sectorName: 'የፖለቲካ ዘርፍ',
  },
  {
    id: 'usr-3',
    name: 'ወ/ሮ ዘውድነሽ ከበደ',
    username: 'woreda04_admin',
    role: 'WOREDA_SUPER_ADMIN',
    roleTitleAmharic: 'የወረዳ 04 ዋና አስተዳዳሪ',
    woredaId: 'wor-04',
    woredaName: 'ወረዳ 04',
  },
  {
    id: 'usr-4',
    name: 'አቶ ካሳሁን ታደሰ',
    username: 'woreda04_pol',
    role: 'WOREDA_SECTOR_ADMIN',
    roleTitleAmharic: 'የወረዳ 04 ፖለቲካ ዘርፍ ኃላፊ',
    sectorId: 'sec-pol',
    sectorName: 'የፖለቲካ ዘርፍ',
    woredaId: 'wor-04',
    woredaName: 'ወረዳ 04',
  },
];
