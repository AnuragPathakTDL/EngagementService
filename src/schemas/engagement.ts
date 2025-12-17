import { z } from "zod";

export const engagementEventBodySchema = z.object({
  videoId: z.string().uuid(),
  action: z.enum(["like", "unlike", "view", "favorite"]).default("like"),
  metadata: z
    .object({
      source: z.enum(["mobile", "web", "tv"]).optional(),
    })
    .optional(),
});

export const engagementEventResponseSchema = z.object({
  success: z.boolean().default(true),
  likes: z.number().int().nonnegative().optional(),
  views: z.number().int().nonnegative().optional(),
});

export type EngagementEventBody = z.infer<typeof engagementEventBodySchema>;
export type EngagementEventResponse = z.infer<typeof engagementEventResponseSchema>;
