import { BlobOptions } from "buffer";
import { Document } from "mongoose";

export interface IResponse {
  successful: boolean;
  message?: string;
}

export interface firstTimeRegisterRequest {
  mobile: string;
}

export interface LocaleType {
  [name: string]: string;
}

export interface CORS {
  origin: string;
  optionsSuccessStatus: number;
}

export interface getStatusRequest {
  url?: string;
  urls?: string[];
}

interface BasicAuthProps {
  hasBasicAuth: boolean;
  basicAuthUsername: string;
  basicAuthPassword: string;
}
export interface getSitemapRequest {
  url: string;
  isDuplicate: boolean;
  basicAuth?: BasicAuthProps;
}
