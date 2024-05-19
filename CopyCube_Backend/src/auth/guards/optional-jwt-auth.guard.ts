import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (authHeader) {
            return super.canActivate(context);
        }
        return true;
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            return null;
        }
        return user;
    }
}
