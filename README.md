# Proyecto Final Backend III - Ecommerce API

## Información del Proyecto
- **Repositorio Docker Hub:** [anton2705/entrega-final-3](https://hub.docker.com/r/anton2705/entrega-final-3)
- **Tecnologías:** Node.js, Express, MongoDB, JWT, Docker

## Objetivos Cumplidos

### Documentación Swagger del módulo "Users"
- Endpoints documentados: `/api/sessions/register`, `/api/sessions/login`, `/api/sessions/current`

### Tests Funcionales Completos
- **24 tests** implementados en `sessions.test.js`
- Cubren endpoints de: Sessions, Products, Carts
- Incluyen casos de éxito y error
- Ejecutar tests: `npm test`

### Dockerización del Proyecto
- Dockerfile configurado correctamente
- Imagen publicada en Docker Hub
- Lista para despliegue en producción

### Imagen Subida a Docker Hub
- **Imagen pública:** `docker.io/anton2705/entrega-final-3`
- Disponible para descarga y uso

## Cómo Ejecutar con Docker

### ** Descargar la imagen y Ejecutar**
```bash
docker pull anton2705/entrega-final-3

** Ejecutar**
`docker run -d -p 3000:3000 --env-file .env anton2705/entrega-final-3`