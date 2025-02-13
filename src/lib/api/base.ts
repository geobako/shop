export const API_BASE_URL = "http://localhost:8080";

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "APIError";
  }
}
