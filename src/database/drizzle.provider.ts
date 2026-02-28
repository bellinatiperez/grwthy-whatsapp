import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema/schema';

export const DRIZZLE = Symbol('DRIZZLE');

export const drizzleProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      connectionString: configService.get<string>('database.url'),
    });
    return drizzle(pool, { schema });
  },
};
