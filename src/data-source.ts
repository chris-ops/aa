import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Token } from './entity/Token'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'yagakimi4ever',
    database: 'aa',
    synchronize: true,
    logging: false,
    entities: [Token],
    migrations: [],
    subscribers: [],
})
