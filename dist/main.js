"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.enableVersioning({
        defaultVersion: '1',
        type: common_1.VersioningType.URI,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Sorta API Docs')
        .setDescription('The Sorta API description')
        .setVersion('1.0')
        .addTag('sorta')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const configService = app.get(config_1.ConfigService);
    await app.listen(configService.get('app.port'), configService.get('app.host'));
}
bootstrap();
//# sourceMappingURL=main.js.map