import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import {
  engagementEventBodySchema,
  engagementEventResponseSchema,
  type EngagementEventBody,
  type EngagementEventResponse,
} from "../schemas/engagement";

type Aggregate = {
  likes: number;
  views: number;
};

const aggregates = new Map<string, Aggregate>();

function applyEvent(videoId: string, body: EngagementEventBody): Aggregate {
  const current = aggregates.get(videoId) ?? { likes: 0, views: 0 };
  switch (body.action) {
    case "like":
      current.likes += 1;
      break;
    case "unlike":
      current.likes = Math.max(0, current.likes - 1);
      break;
    case "view":
      current.views += 1;
      break;
    case "favorite":
      current.likes += 1;
      break;
    default:
      break;
  }
  aggregates.set(videoId, current);
  return current;
}

function serializeResponse(stats: Aggregate): EngagementEventResponse {
  return {
    success: true,
    likes: stats.likes,
    views: stats.views,
  };
}

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
      const stats = applyEvent(body.videoId, body);
      request.log.info(
        { videoId: body.videoId, action: body.action },
        "Processed engagement event"
      );
      return serializeResponse(stats);
    },
  });
});
