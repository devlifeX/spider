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
