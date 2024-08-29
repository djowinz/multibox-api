import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.enableVersioning({
        defaultVersion: '1',
        type: VersioningType.URI,
    });

    const config = new DocumentBuilder()
        .setTitle('Sorta API Docs')
        .setDescription('The Sorta API description')
        .setVersion('1.0')
        .addTag('sorta')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const configService = app.get<ConfigService>(ConfigService);

    const port = configService.get<number>('app.port');
    const host = configService.get<number>('app.host');

    console.log(`LISTENING: ${host}:${port}`);

    await app.listen(
        configService.get<number>('app.port'),
        configService.get<string>('app.host'),
    );
}
bootstrap();
