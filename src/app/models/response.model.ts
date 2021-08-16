import { ErrorResponse } from './error-response.model';

export interface Links {
  next: string;
  preview: string;
}

export interface Meta {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Links;
}

export interface Response<T> {
  data: T;
  error?: ErrorResponse | string;
  meta?: Meta;
}
