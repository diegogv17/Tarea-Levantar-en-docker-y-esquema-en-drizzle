import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TrpcService } from './trpc/trpc.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const trpcService = app.get(TrpcService);
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: trpcService.appRouter,
      createContext: () => ({}),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Tarea')
    .setDescription('API REST + tRPC con contratos Zod y Drizzle ORM')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync(
    resolve(process.cwd(), 'openapi.json'),
    JSON.stringify(document, null, 2),
  );
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
