# Reglas del proyecto (Práctica 1 - Despliegue de Aplicaciones Web)

- Proyecto Node con Express y Mongoose. API REST de eventos, entradas y recintos.
- Usa SIEMPRE CommonJS (require / module.exports). Nunca import/export.
- Usa SIEMPRE async/await con try/catch en todos los endpoints. Nunca .then().
- Estructura OBLIGATORIA y única:
  - models/evento.js (esquema de entradas + esquema de eventos, modelo 'eventos')
  - models/recinto.js (esquema de recintos, modelo 'recintos')
  - routes/eventos.js y routes/recintos.js con express.Router()
  - index.js en la raíz (conexión a BD, express.json(), enrutadores, listen)
- PROHIBIDO crear carpetas controllers, services, middlewares, utils, config o similares.
- Los modelos se cargan en las rutas con require(__dirname + '/../models/xxx').
- Todas las respuestas JSON llevan un booleano ok: true si la petición va bien (200, 201)  y false en cualquier error (404, 500...). Además, un campo resultado si va bien o error si falla.
  y además un campo resultado (si va bien) o error (si falla).
- Respeta EXACTAMENTE los nombres de campos, códigos de estado y mensajes de error que te indique.
- No instales librerías extra salvo express y mongoose sin preguntarme.
- Explica brevemente el código que generes, en español.