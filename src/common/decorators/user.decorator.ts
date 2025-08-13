import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserDecorator = createParamDecorator<
    keyof { userId: string; username: string; role: string; depoId: string } | undefined,
    ExecutionContext
>((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
});

