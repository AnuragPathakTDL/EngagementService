import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import {
  engagementEventBodySchema,
  engagementEventResponseSchema,
} from "../schemas/engagement";
import { applyEngagementEvent } from "../services/engagement";

export default fp(async function internalRoutes(fastify: FastifyInstance) {
  fastify.post("/events", {
    schema: {
      body: engagementEventBodySchema,
      response: {
        200: engagementEventResponseSchema,
      },
    },
    handler: async (request) => {
      const body = engagementEventBodySchema.parse(request.body);
      const stats = applyEngagementEvent(body.videoId, body);
      request.log.info(
        { videoId: body.videoId, action: body.action },
        "Processed engagement event"
      );
      return {
        success: true,
        likes: stats.likes,
        views: stats.views,
      };
    },
  });
});
