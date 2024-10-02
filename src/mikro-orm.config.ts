import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import 'dotenv/config'

import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations'

const config: Options = {
    entities: ['../dist/**/*.entity.js'],
    entitiesTs: ['./**/*.entity.ts'],
    baseDir: __dirname,
    driver: PostgreSqlDriver,
    dbName: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    metadataProvider: TsMorphMetadataProvider,
    extensions: [Migrator],
    driverOptions: {
      connection: {
        ssl: true,
      },
    },
    migrations: {
        tableName: 'migrations',
        path: './migrations',
        pathTs: undefined,
        glob: '!(*.d).{js,ts}',
        transactional: true, 
        disableForeignKeys: true,
        allOrNothing: true, 
        dropTables: true,
        safe: false,
        snapshot: true,
        emit: 'ts',
        generator: TSMigrationGenerator, 
    },
    debug: true
}

export default config;