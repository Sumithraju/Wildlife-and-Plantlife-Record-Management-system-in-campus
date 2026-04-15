/**
 * Backend API Test Cases – Wildlife CRUD (BE-05 to BE-09)
 * Uses Jest + Supertest + mocked DB
 */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
  on: jest.fn(),
}));

const pool = require('../src/config/db');

process.env.JWT_SECRET = 'test_secret';

const makeToken = (role = 'researcher', id = 2) =>
  jwt.sign({ id, email: 'test@campus.edu', role }, 'test_secret', { expiresIn: '1h' });

beforeEach(() => jest.clearAllMocks());

describe('POST /api/wildlife', () => {
  // BE-05: Researcher creates wildlife record
  test('BE-05: researcher creates record – returns 201 with status pending', async () => {
    pool.query
      .mockResolvedValueOnce({                       // INSERT wildlife_records
        rows: [{
          id: 1, user_id: 2, species_name: 'Passer domesticus',
          category: 'bird', observation_date: '2026-04-01', status: 'pending'
        }]
      })
      .mockResolvedValueOnce({ rows: [] });           // activity_log trigger (no-op in mock)

    const res = await request(app)
      .post('/api/wildlife')
      .set('Authorization', `Bearer ${makeToken('researcher')}`)
      .send({
        species_name: 'Passer domesticus',
        common_name: 'House Sparrow',
        category: 'bird',
        observation_date: '2026-04-01',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  // BE-09: Missing required field
  test('BE-09: returns 400 when observation_date is missing', async () => {
    const res = await request(app)
      .post('/api/wildlife')
      .set('Authorization', `Bearer ${makeToken('researcher')}`)
      .send({
        species_name: 'Passer domesticus',
        category: 'bird',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: expect.stringContaining('observation_date') })
      ])
    );
  });
});

describe('DELETE /api/wildlife/:id', () => {
  // BE-06: Viewer forbidden to delete
  test('BE-06: returns 403 when viewer tries to delete', async () => {
    const viewerToken = makeToken('viewer');
    const res = await request(app)
      .delete('/api/wildlife/1')
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Insufficient permissions');
  });
});

describe('PATCH /api/wildlife/:id/status', () => {
  // BE-07: Admin approves record
  test('BE-07: admin sets status to verified – returns 200', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, status: 'verified', species_name: 'Passer domesticus' }],
    });

    const res = await request(app)
      .patch('/api/wildlife/1/status')
      .set('Authorization', `Bearer ${makeToken('admin', 1)}`)
      .send({ status: 'verified' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('verified');
  });

  test('returns 403 when researcher tries to change status', async () => {
    const res = await request(app)
      .patch('/api/wildlife/1/status')
      .set('Authorization', `Bearer ${makeToken('researcher')}`)
      .send({ status: 'verified' });

    expect(res.status).toBe(403);
  });
});

describe('GET /api/wildlife', () => {
  // BE-08: Pagination
  test('BE-08: page=2&limit=5 returns correct slice with total count', async () => {
    const records = Array.from({ length: 5 }, (_, i) => ({
      id: i + 6, species_name: `Species ${i + 6}`, user_id: 2,
      observer_name: 'Dr. Sarah Chen', category: 'bird',
      observation_date: '2026-03-01', status: 'verified',
    }));

    pool.query
      .mockResolvedValueOnce({ rows: records })
      .mockResolvedValueOnce({ rows: [{ count: '25' }] });

    const res = await request(app).get('/api/wildlife?page=2&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.records).toHaveLength(5);
    expect(res.body.total).toBe(25);
  });
});

describe('GET /api/users', () => {
  // BE-10: Admin lists users
  test('BE-10: admin gets user list without passwords', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [
          { id: 1, full_name: 'Admin', email: 'admin@campus.edu', role: 'admin', is_active: true, created_at: new Date() },
          { id: 2, full_name: 'Dr. Sarah', email: 'sarah@campus.edu', role: 'researcher', is_active: true, created_at: new Date() },
        ]
      })
      .mockResolvedValueOnce({ rows: [{ count: '2' }] });

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${makeToken('admin', 1)}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
    res.body.users.forEach(u => expect(u).not.toHaveProperty('password_hash'));
  });
});
