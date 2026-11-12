export type DocumentCategory = 'ዕቅድ' | 'ሪፖርት' | 'ደብዳቤ' | 'ሰርኩላር' | 'ሌሎች';

export type DocumentStatus = 'የጸደቀ' | 'በግምገማ ላይ' | 'ማሻሻያ የተጠየቀበት';

export type LevelType = 'ክፍለ ከተማ' | 'ወረዳ';

export interface Sector {
  id: string;
  name: string;
  code: string;
  boxCode: string;
}

export interface Woreda {
  id: string;
  number: number;
  name: string;
  boxCode: string;
}

export interface FeedbackEntry {
  id: string;
  comment: string;
  author: string;
  authorRole: string;
  date: string;
  attachedFile?: string;
  actionRequested: 'ማሻሻያ' | 'ማጽደቅ' | 'አስተያየት';
}

export interface DocumentItem {
  id: string;
  code: string;
  title: string;
  level: LevelType;
  sector: string;
  woredaId?: string;
  woredaName?: string;
  category: DocumentCategory;
  year: string;
  quarter: string;
  fileType: 'PDF' | 'DOCX' | 'IMAGE';
  fileSize: string;
  uploadDate: string;
  uploaderName: string;
  status: DocumentStatus;
  qrHash: string;
  feedbacks: FeedbackEntry[];
}

export interface FileBox {
  id: string;
  title: string;
  code: string;
  level: LevelType;
  ownerName: string;
  qrHash: string;
  docCount: number;
  lastUpdated: string;
}
