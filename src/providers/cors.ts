import {FastifyInstance} from "fastify";
import Cors from "@fastify/cors";

const corsOptions = {
    origin: "*"
};

export function registerCorsProvider(server: FastifyInstance) {
    server.register(Cors, corsOptions)
}