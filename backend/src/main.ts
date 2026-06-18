import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for Next.js frontend
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
