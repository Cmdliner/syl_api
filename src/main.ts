import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe, VersioningType } from '@nestjs/common';
import { corsOpts } from './lib/constants';
import * as compression from 'compression';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors(corsOpts);
    app.use(compression())
    app.use(helmet());

    app.enableVersioning({
        prefix: 'api/v',
        type: VersioningType.URI,
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        errorHttpStatusCode: 422,
        exceptionFactory(errors) {
            const filtered = errors.map(e => ({ [`${e.property}`]: Object.values(e.constraints || {}).join(', ') }));
            return new UnprocessableEntityException({
                message: 'Validation failed',
                details: filtered
            });
        }
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
}
bootstrap();
                 