export type IdeaCategory =
  | 'የፖለቲካ እና ርዕዮተ-ዓለም እሳቤዎች'
  | 'የኢኮኖሚና ልማት ፖሊሲ ሀሳቦች'
  | 'የማህበራዊና ህዝብ ግንኙነት ጥናቶች'
  | 'የመልካም አስተዳደርና አመራር ጥበብ'
  | 'የቴክኖሎጂና አሰራር ፈጠራ';

export interface IdeaComment {
  id: string;
  author: string;
  role: string;
  comment: string;
  date: string;
}

export interface IdeaItem {
  id: string;
  code: string;
  title: string;
  category: IdeaCategory;
  authorName: string;
  authorRole: string;
  authorLevel: 'ክፍለ ከተማ' | 'ወረዳ';
  woredaId?: string;
  sector?: string;
  summary: string;
  content: string; // Full text formatted in markdown / paragraphs
  date: string;
  readTimeMinutes: number;
  likesCount: number;
  viewsCount: number;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  tags: string[];
  comments: IdeaComment[];
}
