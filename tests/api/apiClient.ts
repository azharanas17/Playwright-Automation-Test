import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  readonly request: APIRequestContext;
  readonly baseUrl = 'https://dummyapi.io/data/v1';
  readonly appId = '63a804408eb0cb069b57e43a';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private headers() {
    return {
      'app-id': this.appId,
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint: string) {
    return this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: this.headers(),
    });
  }

  async post(endpoint: string, body: object) {
    return this.request.post(`${this.baseUrl}${endpoint}`, {
      headers: this.headers(),
      data: body,
    });
  }

  async put(endpoint: string, body: object) {
    return this.request.put(`${this.baseUrl}${endpoint}`, {
      headers: this.headers(),
      data: body,
    });
  }

  async delete(endpoint: string) {
    return this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.headers(),
    });
  }
}
