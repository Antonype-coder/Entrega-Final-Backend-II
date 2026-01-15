/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     tags: [Users]
 *     summary: Registrar usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *     responses:
 *       201:
 *         description: Usuario creado
 */

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     tags: [Users]
 *     summary: Login de usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 */

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     tags: [Users]
 *     summary: Usuario actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 */
