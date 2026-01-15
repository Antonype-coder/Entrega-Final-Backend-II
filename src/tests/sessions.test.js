import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

describe('Sessions API', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let token;

  test('Registro de usuario', async () => {
    const res = await request(app)
      .post('/api/sessions/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
  });

  test('Login de usuario', async () => {
    const res = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'testuser@mail.com',
        password: '123456'
      });

    token = res.body.token;
    expect(res.statusCode).toBe(200);
  });

  test('Usuario actual', async () => {
    const res = await request(app)
      .get('/api/sessions/current')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
