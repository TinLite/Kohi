import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class WsGuard {
    private reflector: Reflector;
    constructor(reflector: Reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        context.switchToWs()
    }
}