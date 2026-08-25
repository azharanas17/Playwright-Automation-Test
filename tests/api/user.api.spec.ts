import { test, expect } from '@playwright/test';
import { ApiClient } from './apiClient';

let api: ApiClient;

test.beforeEach(async ({ request }) => {
  api = new ApiClient(request);
});

test.describe('User API - GET Operations', () => {
  test('should get list of users', async () => {
    const response = await api.get('/user?limit=5');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('should get a single user by ID', async () => {
    const listResponse = await api.get('/user?limit=1');
    const listBody = await listResponse.json();
    const userId = listBody.data[0].id;

    const response = await api.get(`/user/${userId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(userId);
    expect(body.firstName).toBeDefined();
    expect(body.lastName).toBeDefined();
    expect(body.email).toBeDefined();
  });

  test('should return 404 for invalid user ID', async () => {
    const response = await api.get('/user/invalidid123');
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toBe('RESOURCE_NOT_FOUND');
  });

  test('should get users with different limit values', async () => {
    const response = await api.get('/user?limit=10');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data.length).toBeLessThanOrEqual(10);
  });
});

test.describe('User API - POST Operations', () => {
  test('should create a new user', async () => {
    const uniqueEmail = `user_${Date.now()}@test.com`;
    const response = await api.post('/user/create', {
      firstName: 'John',
      lastName: 'Doe',
      email: uniqueEmail,
      phone: '+1234567890',
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstName).toBe('John');
    expect(body.lastName).toBe('Doe');
    expect(body.id).toBeDefined();
  });

  test('should create user and retrieve by ID', async () => {
    const uniqueEmail = `crossop_${Date.now()}@test.com`;
    const createResponse = await api.post('/user/create', {
      firstName: 'CrossOp',
      lastName: 'Test',
      email: uniqueEmail,
      phone: '+4444444444',
    });
    const createBody = await createResponse.json();
    const userId = createBody.id;

    const getResponse = await api.get(`/user/${userId}`);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    expect(getBody.firstName).toBe('CrossOp');
    expect(getBody.lastName).toBe('Test');
  });
});

test.describe('User API - PUT Operations', () => {
  test('should update an existing user', async () => {
    const listResponse = await api.get('/user?limit=1');
    const listBody = await listResponse.json();
    const userId = listBody.data[0].id;

    const response = await api.put(`/user/${userId}`, {
      firstName: 'Updated',
      lastName: 'User',
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstName).toBe('Updated');
    expect(body.lastName).toBe('User');
  });

  test('should update only firstName of a user', async () => {
    const listResponse = await api.get('/user?limit=1');
    const listBody = await listResponse.json();
    const userId = listBody.data[0].id;

    const response = await api.put(`/user/${userId}`, {
      firstName: 'OnlyFirstNameUpdated',
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstName).toBe('OnlyFirstNameUpdated');
  });
});

test.describe('User API - DELETE Operations', () => {
  test('should delete a user by creating and deleting', async () => {
    const uniqueEmail = `todelete_${Date.now()}@test.com`;
    const createResponse = await api.post('/user/create', {
      firstName: 'ToDelete',
      lastName: 'User',
      email: uniqueEmail,
      phone: '+9876543210',
    });
    const createBody = await createResponse.json();
    const userId = createBody.id;

    const deleteResponse = await api.delete(`/user/${userId}`);
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await api.get(`/user/${userId}`);
    expect(getResponse.status()).toBe(404);
  });
});

test.describe('Tag API - GET Operations', () => {
  test('should get list of tags', async () => {
    const response = await api.get('/tag');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('should get tags with page parameter', async () => {
    const response = await api.get('/tag?page=0');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('should verify each tag has valid data', async () => {
    const response = await api.get('/tag');
    const body = await response.json();

    for (const tag of body.data) {
      expect(tag).toBeDefined();
    }
  });
});
