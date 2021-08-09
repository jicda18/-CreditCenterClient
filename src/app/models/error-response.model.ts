export interface ErrorResponse {
  error: string | { [key: string]: any };
  code: number;
}
