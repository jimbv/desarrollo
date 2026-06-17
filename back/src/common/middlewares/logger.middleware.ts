import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // El Logger de NestJS hace que los mensajes salgan con color, fecha y hora en la consola
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // 1. Extraemos el método (GET, POST, etc.) y la URL que se está consultando
    const { method, originalUrl } = req;
    
    // 2. Guardamos el momento exacto en el que entró el request
    const start = Date.now();

    // 3. Nos suscribimos al evento 'finish'. Esto se ejecuta CUANDO LA API YA RESPONDIÓ
    res.on('finish', () => {
      const { statusCode } = res;
      // Calculamos cuántos milisegundos pasaron
      const duration = Date.now() - start;

      // 4. Imprimimos en la consola: "GET /users 200 - 15ms"
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    // 5. ¡Súper importante! next() le dice a NestJS: "Ya hice mi trabajo, pasá al siguiente paso"
    next();
  }
}