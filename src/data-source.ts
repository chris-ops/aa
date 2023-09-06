import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Token } from './entity/Token'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
    path:
        process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.development',
})

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'aa',
    synchronize: true,
    logging: false,
    entities: [Token],
    migrations: [],
    subscribers: [],
})
