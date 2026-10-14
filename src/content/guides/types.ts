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
  /** Optional profile URL (for example LinkedIn). Rendered as the byline link. */
  url?: string;
  /** Optional portrait. Same shape as a cover image. */
  avatar?: GuideImage | null;
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
  subsections?: GuideSubsection[];
}

export interface GuideLink {
  href: string;
  label: string;
}

export interface GuideComparisonTable {
  caption: string;
  columns: string[];
  /** Leave empty until rows are verified. Do not invent dates, prices, or rankings. */
  rows: string[][];
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
  comparisonTable?: GuideComparisonTable | null;
  faq: GuideFaqItem[];
  internalLinks: GuideLink[];
}
