import Fastify from "fastify";

const app = Fastify();

app.get("/", () => {
    return "olá mundo"
})

app.listen({
    port:3333
})