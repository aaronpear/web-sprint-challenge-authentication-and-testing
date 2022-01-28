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
  test('returns a status 401 on invalid password', async () => {
    // creating new user
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy', password: 'brandy123' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'brandy', password: 'jasmine123' });
    expect(res.status).toBe(401);
  })
  test('returns a status 401 on invalid username', async () => {
    // creating new user
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy', password: 'brandy123' });
  
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'jack', password: 'brandy123' });
    expect(res.status).toBe(401);
  })
  test('returns proper message on successful login', async () => {
    // creating new user
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'brandy', password: 'brandy123' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'brandy', password: 'brandy123' });
    expect(res.body.message).toBe('welcome, brandy');
  })
})