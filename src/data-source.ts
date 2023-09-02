import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Token } from './entity/user/Token'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Yagakimi4ever',
    database: 'aa',
    synchronize: true,
    logging: false,
    entities: [Token],
    migrations: [],
    subscribers: [],
})
