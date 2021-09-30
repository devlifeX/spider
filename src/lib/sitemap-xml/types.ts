interface BasicAuthProps {
  hasBasicAuth: boolean;
  basicAuthUsername: string;
  basicAuthPassword: string;
}

export interface SitemapMain {
  baseURL?: string;
  filename?: string;
  sitemapContent?: string;
  basicAuth?: BasicAuthProps;
  isDuplicate?: boolean;
  callbackOnEachItemFetched?: (item: any) => void;
}

export interface SitemapResponse {
  url: string;
  lastmod: string;
  changefreq?: string;
  priority?: string;
  relativeTime?: string;
}

export interface isValidSitemapResponse {
  fetchError: boolean;
  isValidXML: boolean;
}

export interface MyURL {
  url: string;
}
export interface getSitemapResponse {
  url: string;
  error?: boolean;
}
export interface fetchXMLOption {
  basicAuth?: BasicAuthProps;
}
