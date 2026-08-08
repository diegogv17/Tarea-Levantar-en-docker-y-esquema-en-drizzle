import { Module } from '@nestjs/common';
import { db, pool } from './index';

export const DB = Symbol('DB');
export const POOL = Symbol('POOL');

@Module({
  providers: [
    { provide: DB, useValue: db },
    { provide: POOL, useValue: pool },
  ],
  exports: [DB, POOL],
})
export class DbModule {}
