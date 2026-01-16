import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../dao/models/User.js';
import Product from '../dao/models/Product.js';
import Cart from '../dao/models/Cart.js';

describe('Tests API Ecommerce', () => {
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let userToken;
  let adminToken;
  let cartId;
  let productId;
  
  const testUser = {
    first_name: 'Juan',
    last_name: 'Perez',
    email: 'juan@test.com',
    password: '123456'
  };

  const testAdmin = {
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  };

  const testProduct = {
    title: 'Laptop',
    description: 'Laptop para trabajo',
    price: 1200,
    stock: 10,
    code: 'LAP001'
  };

  test('Registro de usuario', async () => {
    const res = await request(app)
      .post('/api/sessions/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
  });

  test('Registro email duplicado', async () => {
    const res = await request(app)
      .post('/api/sessions/register')
      .send(testUser);
    expect(res.statusCode).toBe(400);
  });

  test('Login de usuario', async () => {
    const res = await request(app)
      .post('/api/sessions/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    userToken = res.body.token;
    expect(res.statusCode).toBe(200);
  });

  test('Login contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/sessions/login')
      .send({
        email: testUser.email,
        password: 'wrong'
      });
    expect(res.statusCode).toBe(401);
  });

  test('Usuario actual', async () => {
    const res = await request(app)
      .get('/api/sessions/current')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Usuario sin token', async () => {
    const res = await request(app)
      .get('/api/sessions/current');
    expect(res.statusCode).toBe(401);
  });

  test('Registro admin', async () => {
    const res = await request(app)
      .post('/api/sessions/register')
      .send(testAdmin);
    expect(res.statusCode).toBe(201);
  });

  test('Login admin', async () => {
    const res = await request(app)
      .post('/api/sessions/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password
      });
    adminToken = res.body.token;
    expect(res.statusCode).toBe(200);
  });

  test('Forgot password', async () => {
    const res = await request(app)
      .post('/api/sessions/forgot-password')
      .send({ email: testUser.email });
    expect(res.statusCode).toBe(200);
  });

  test('Listar productos', async () => {
    const res = await request(app)
      .get('/api/products');
    expect(res.statusCode).toBe(200);
  });

  test('Crear producto admin', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testProduct);
    productId = res.body.product._id;
    expect(res.statusCode).toBe(201);
  });

  test('Crear producto sin admin', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send(testProduct);
    expect(res.statusCode).toBe(403);
  });

  test('Actualizar producto', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 1300 });
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar producto', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Crear carrito', async () => {
    const res = await request(app)
      .post('/api/carts');
    cartId = res.body.cart._id;
    expect(res.statusCode).toBe(201);
  });

  test('Ver carrito', async () => {
    const res = await request(app)
      .get(`/api/carts/${cartId}`);
    expect(res.statusCode).toBe(200);
  });

  test('Agregar producto a carrito', async () => {
    const productRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testProduct);
    productId = productRes.body.product._id;

    const res = await request(app)
      .post(`/api/carts/${cartId}/product/${productId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 });
    expect(res.statusCode).toBe(200);
  });

  test('Comprar carrito', async () => {
    const res = await request(app)
      .post(`/api/carts/${cartId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Health check', async () => {
    const res = await request(app)
      .get('/health');
    expect(res.statusCode).toBe(200);
  });

  test('Documentación Swagger', async () => {
    const res = await request(app)
      .get('/api/docs')
      .redirects(1);
    expect(res.statusCode).toBe(200);
  });

  test('Ruta 404', async () => {
    const res = await request(app)
      .get('/api/ruta-falsa');
    expect(res.statusCode).toBe(404);
  });
});
