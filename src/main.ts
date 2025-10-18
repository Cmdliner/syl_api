import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { corsOpts } from './lib/constants';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors(corsOpts);
    app.use(compression())
    app.use(helmet());

    app.enableVersioning({
        prefix: 'api/v',
        type: VersioningType.URI,
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
