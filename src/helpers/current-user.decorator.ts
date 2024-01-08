import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get current user from request or if attribute it passed then get that attribute from the user object.
 *
 * @author Rajendra Kumar Majhi
 * @date 04-09-2022
 * 
 */
export interface ICurrentUser {
  i_nameid: number;
  i_role: string;
  i_email: string;
  i_unique_name: string;
  timestamp: string;
  i_session: string;
}

export const CurrentUser = createParamDecorator((userAttribute: string | undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (!request?.user) return null;
  if (userAttribute) return { ...request.user[userAttribute] };
  console.log(request.user)
  return { ...request.user };
});

