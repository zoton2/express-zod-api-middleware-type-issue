import { z } from "zod/v4";
import { Routing, createServer, createConfig, defaultEndpointsFactory } from "express-zod-api";
import { auth } from "express-oauth2-jwt-bearer";
import rateLimit from "express-rate-limit";

const config = createConfig({
  http: { listen: 8090 }, // port, UNIX socket or Net::ListenOptions
  cors: false, // decide whether to enable CORS
});

const helloWorldEndpoint = defaultEndpointsFactory
  .use(auth())
  .use(rateLimit())
  .build({
    // method: "get" (default) or array ["get", "post", ...]
    input: z.object({
      name: z.string().optional(),
    }),
    output: z.object({
      greetings: z.string(),
    }),
    handler: async ({ input: { name }, options, logger }) => {
      logger.debug("Options:", options); // middlewares provide options
      return { greetings: `Hello, ${name || "World"}. Happy coding!` };
    },
  });

const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
  },
};

createServer(config, routing);
