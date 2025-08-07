import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VchdsModule } from './vchds/vchds.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VagonsModule } from './vagons/vagons.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        synchronize: true, // ❌ disable in production
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    VchdsModule,
    VagonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
