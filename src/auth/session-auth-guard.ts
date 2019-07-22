import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class SessionAuthGuard extends PassportAuthGuard('local') implements CanActivate {
    public async canActivate(
        context: ExecutionContext,
    ): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const result = await super.canActivate(context);
        await super.logIn(request);

        return result;
    }
}
