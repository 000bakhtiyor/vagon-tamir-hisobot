import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReleasedVagonsModule } from './released-vagons/released-vagons.module';
import { WagonDepotsModule } from './wagon-depots/wagon-depots.module';
import { StationsModule } from './stations/stations.module';
import { RepairClassificationsModule } from './repair-classifications/repair-classifications.module';
import { OwnershipsModule } from './ownerships/ownerships.module';

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
    ReleasedVagonsModule,
    WagonDepotsModule,
    StationsModule,
    RepairClassificationsModule,
    OwnershipsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
