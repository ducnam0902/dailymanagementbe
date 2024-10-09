import { DataSourceOptions } from 'typeorm';
import envConfig from './utils/config';
const config: DataSourceOptions = {
  type: 'postgres',
  host: envConfig.POSTGRES_HOST,
  port: 5432,
  username: envConfig.POSTGRES_USER,
  password: envConfig.POSTGRES_PASSWORD,
  database: envConfig.POSTGRES_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  ssl: true,
};

export default config;
