import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS — accept local dev + any Vercel preview URL + configured production URL
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5174',
        /^https:\/\/.*\.vercel\.app$/,
    ];
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });

    // Global validation pipe for DTO validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🚀 STORMGLIDE.IO COMMAND CENTER - ONLINE               ║
  ║                                                           ║
  ║   Backend API: http://localhost:${port}                     ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
  ║                                                           ║
  ║   Modules Active:                                         ║
  ║   ✓ Authentication (JWT Magic Links)                     ║
  ║   ✓ CRM & Job Tracking                                   ║
  ║   ✓ Multi-Currency Billing Engine                        ║
  ║   ✓ AI Blueprint Generator (Lab)                         ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
