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
