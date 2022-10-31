import {MiddlewareFn, MiddlewareInterface, NextFn, ResolverData} from "type-graphql";
import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import config from "../config";
import {ApolloError} from "apollo-server-express";
const { secrets } = config;

export interface MyContext {
    req: Request;
    res: Response;
    payload?: { id: number };
}

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new ApolloError('Unauthorized', '401');
    }

    try {
        const secretOrKey = secrets.JWT;
        const token = authorization.split(" ")[1];
        const payload = verify(token, secretOrKey);
        console.log(`payload: ${payload.id}`)
        context.payload = payload as any;
    } catch (err) {
        console.log(err);
        throw new ApolloError('Unauthorized', '401');
    }
    return next();
};