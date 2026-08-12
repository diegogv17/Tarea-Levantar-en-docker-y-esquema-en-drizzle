import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';
import type { CampoError } from '@tarea/contracts';

@Injectable()
export class ZodPipe<T = unknown> implements PipeTransform<unknown, T> {
  constructor(private readonly schema?: z.ZodType<T>) {}

  transform(value: unknown): T {
    if (!this.schema) {
      return value as T;
    }

    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data;
    }

    const message: CampoError[] = result.error.issues.map((issue) => ({
      path: issue.path.length > 0 ? issue.path.join('.') : 'root',
      message: issue.message,
      code: issue.code,
    }));

    throw new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message,
    });
  }
}
