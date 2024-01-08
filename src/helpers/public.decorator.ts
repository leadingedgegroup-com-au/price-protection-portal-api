import { SetMetadata } from '@nestjs/common';

/**
 * Decorator for defining a route as public. If annotated with @Public() then jwt auth guard will bypass the jwt auth check.
 *
 * @author rAJENDRA
 */
export const Public = () => SetMetadata('isPublic', true);
