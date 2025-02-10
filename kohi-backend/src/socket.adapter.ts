
import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RequestHandler } from 'express';
import passport from 'passport';
import { ServerOptions } from 'socket.io';

/**
 * Custom socket adapter to enable passport session support
 * See https://stackoverflow.com/questions/68684439
 */
export class CustomSocketAdapter extends IoAdapter {
    private session : RequestHandler;

    constructor(session: RequestHandler, app: INestApplicationContext) {
        super(app);
        this.session = session
    }

  createIOServer(port: number, options?: ServerOptions): any {
    console.log(port, options)
    const server = super.createIOServer(port, options);
    const wrap = (middleware) => (socket, next) =>
        middleware(socket.request, {}, next);
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    return server;
  }
}
