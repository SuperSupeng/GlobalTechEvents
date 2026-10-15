export interface AuthorLink {
  href: string;
  label: string;
  note?: string;
}

export interface AuthorAffiliation {
  name: string;
  /** Public role only. Omit when the site does not state a title. */
  role?: string;
  url?: string;
}

export interface AuthorProfile {
  name: string;
  slug: string;
  headline: string;
  bio: string;
  about: string[];
  avatar: {
    src: string;
    alt: string;
  };
  sameAs: string[];
  knowsAbout: string[];
  affiliations: AuthorAffiliation[];
  url: string;
  guides: AuthorLink[];
  evidence: AuthorLink[];
}
