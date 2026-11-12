export type LibraryCategory =
  | 'የፓርቲው ሰነዶች'
  | 'የተለያዩ ጥናቶች ዶክመንት'
  | 'የስልጠና ዶክመንት'
  | 'የመፅሄት ህትመቶች'
  | 'ቪዲዮዎች'
  | 'ኦዲዮዎች እና ምስሎች';

export type MediaType = 'pdf' | 'document' | 'video' | 'audio' | 'image';

export interface LibraryItem {
  id: string;
  code: string;
  title: string;
  category: LibraryCategory;
  mediaType: MediaType;
  description: string;
  authorOrPublisher: string;
  publishDate: string;
  fileSize: string;
  pageCount?: number;
  duration?: string; // e.g. "24:15"
  coverUrl?: string;
  fileUrl?: string;
  tags: string[];
  downloadsCount: number;
  viewsCount: number;
  isAvailableOffline?: boolean;
}
