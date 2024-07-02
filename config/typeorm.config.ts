import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const migrationsFolder =
    process.env.MIGRATIONS_TYPE === 'seed'
        ? `${__dirname}/../seeds/*{.ts,.js}`
        : `${__dirname}/../migrations/*{.ts,.js}`;
const migrationsTableName = process.env.MIGRATIONS_TYPE === 'seed' ? 'seeds' : 'migrations';


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.MIGRATIONS_HOST,
    port: +process.env.MIGRATIONS_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [`${__dirname}/../apps/**/*.entity{.ts,.js}`],
    migrations: [migrationsFolder],
    migrationsTableName: migrationsTableName
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
