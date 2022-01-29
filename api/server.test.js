const request = require('supertest');
const server = require('./server.js');
const db = require('../data/dbConfig.js');

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
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
  test('returns a status 400 on empty username', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ password: 'brandy123' });
    expect(res.status).toBe(400);
  })
  test('returns the new user on successful account creation', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy', password: 'brandy123' });
    expect(res.body.username).toBe('brandy');
    expect(res.body.id).toBe(1);
  })
})

describe('POST /api/auth/login', () => {
  // creating proper user for each test
  beforeEach(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy', password: 'brandy123' });
  })
  test('returns a status 401 on invalid password', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'brandy', password: 'jasmine123' });
    expect(res.status).toBe(401);
  })
  test('returns a status 401 on invalid username', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'jack', password: 'brandy123' });
    expect(res.status).toBe(401);
  })
  test('returns proper message on successful login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'brandy', password: 'brandy123' });
    expect(res.body.message).toBe('welcome, brandy');
  })
})

describe('GET /api/jokes', () => {
  test('returns a status 401 if token is not sent', async () => {
    const res = await request(server)
      .get('/api/jokes');
    expect(res.status).toBe(401);
  })
  test('returns jokes when valid token is sent', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy', password: 'brandy123' });
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username: 'brandy', password: 'brandy123' });
    const res = await request(server)
      .get('/api/jokes')
      // not sure how to structure this request
      .send({ headers: { authorization: loginRes.body.token }});
    expect(res.length).toBe(3);
  })
})