import { Logger, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class MyFileLogger implements Logger {
    private logStream = fs.createWriteStream('typeorm.log', { flags: 'a' });

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logStream.write(`[QUERY] ${query} -- ${JSON.stringify(parameters)}\n`);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logStream.write(`[ERROR] ${query} -- ${JSON.stringify(parameters)} -- ${error}\n`);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logStream.write(`[SLOW] ${time}ms -- ${query} -- ${JSON.stringify(parameters)}\n`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logStream.write(`[SCHEMA] ${message}\n`);
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logStream.write(`[MIGRATION] ${message}\n`);
    }

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
        this.logStream.write(`[${level.toUpperCase()}] ${message}\n`);
    }
}
