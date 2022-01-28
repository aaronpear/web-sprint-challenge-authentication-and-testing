const request = require('supertest');
const server = require('./server.js');
const db = require('../data/dbConfig.js');

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
})

afterAll(async () => {
  await db.destroy();
})

describe('POST /api/auth/register', () => {
  test('returns a status 400 on empty password', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy' });
    expect(res.status).toBe(400);
})
})