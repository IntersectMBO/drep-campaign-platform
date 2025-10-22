import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm/data-source/DataSource';

dotenv.config();

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: ['src/entities/*.entity.{ts,js}'],
  migrations: ['src/migrations/**/*.{ts,js}'],
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: true,
});
datasource.initialize().then();
export default datasource;
