/**
 * Backend API Test Cases – Authentication (BE-01 to BE-04, BE-10)
 * Uses Jest + Supertest
 */
const request = require('supertest');
const app = require('../src/app');

// Mock the DB pool so tests don't need a live database
jest.mock('../src/config/db', () => {
  const mockPool = {
    query: jest.fn(),
    on: jest.fn(),
  };
  return mockPool;
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$hashed'),
  compare: jest.fn(),
}));

const pool = require('../src/config/db');
const bcrypt = require('bcryptjs');

beforeEach(() => jest.clearAllMocks());

describe('POST /api/auth/register', () => {
  // BE-01: Register success
  test('BE-01: returns 201 with user and token on valid payload', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })       // findByEmail – no existing user
      .mockResolvedValueOnce({                    // create – returns new user
        rows: [{ id: 1, full_name: 'Test User', email: 'test@campus.edu', role: 'viewer', is_active: true, created_at: new Date() }]
      });

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@campus.edu',
      password: 'Password1',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'test@campus.edu', role: 'viewer' });
  });

  // BE-02: Duplicate email
  test('BE-02: returns 409 when email already exists', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'test@campus.edu', is_active: true }],
    });

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@campus.edu',
      password: 'Password1',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Email already in use');
  });

  test('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      password: 'Password1',
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  // BE-03: Wrong password
  test('BE-03: returns 401 on wrong password', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'test@campus.edu', password_hash: '$2b$12$hash', is_active: true }],
    });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@campus.edu',
      password: 'wrongpass',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  test('returns 200 with token on valid credentials', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'test@campus.edu', password_hash: '$2b$12$hash', role: 'researcher', is_active: true }],
    });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@campus.edu',
      password: 'correctpass',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('GET /api/wildlife', () => {
  // BE-04: Unauthenticated access to protected route
  test('BE-04: returns 401 when no Authorization header on protected routes', async () => {
    const res = await request(app).get('/api/wildlife/stats');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access token required');
  });
});
