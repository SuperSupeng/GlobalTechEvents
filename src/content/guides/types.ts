export type GuideStatus = 'draft' | 'published';

export type GuideTemplate = 'compare' | 'roundup';

export interface GuideImage {
  src: string;
  alt: string;
}

export interface GuideAuthor {
  name: string;
  bio: string;
  /** True when the byline is a labeled placeholder, not a real editor. */
  placeholder: boolean;
}

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export interface GuideSubsection {
  heading: string;
  paragraphs?: string[];
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  table?: ReaderTable;
  subsections?: GuideSubsection[];
}

export interface GuideLink {
  href: string;
  label: string;
}

export interface ReaderRow {
  event: string;
  dates: string;
  city: string;
  bestFor: string;
  aiFocus: string;
  costBand: string;
  verdict: string;
}

export interface ReaderTable {
  caption: string;
  /** Leave empty until rows are verified. Do not invent dates, prices, or rankings. */
  rows: ReaderRow[];
}

export interface Guide {
  slug: string;
  language: 'en';
  status: GuideStatus;
  template: GuideTemplate;
  title: string;
  seoTitle: string;
  description: string;
  /** Editor confirms the opening lead actually answers search intent. */
  intentAnswered: boolean;
  primaryKeyword?: string;
  asOf: string;
  shellNotice?: string;
  author: GuideAuthor;
  coverImage?: GuideImage | null;
  bodyImages?: GuideImage[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  internalLinks: GuideLink[];
}
