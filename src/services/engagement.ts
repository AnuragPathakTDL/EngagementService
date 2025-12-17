import type { EngagementEventBody } from "../schemas/engagement";

type Aggregate = {
  likes: number;
  views: number;
};

type EngagementStore = Map<string, Aggregate>;

const store: EngagementStore = new Map();

function getOrCreateAggregate(videoId: string): Aggregate {
  const existing = store.get(videoId);
  if (existing) {
    return existing;
  }
  const aggregate: Aggregate = { likes: 0, views: 0 };
  store.set(videoId, aggregate);
  return aggregate;
}

export function applyEngagementEvent(
  videoId: string,
  body: EngagementEventBody
): Aggregate {
  const aggregate = getOrCreateAggregate(videoId);
  switch (body.action) {
    case "like":
      aggregate.likes += 1;
      break;
    case "unlike":
      aggregate.likes = Math.max(0, aggregate.likes - 1);
      break;
    case "view":
      aggregate.views += 1;
      break;
    case "favorite":
      aggregate.likes += 1;
      break;
    default:
      break;
  }
  store.set(videoId, aggregate);
  return aggregate;
}

export function getAggregate(videoId: string): Aggregate {
  return { ...getOrCreateAggregate(videoId) };
}

export type { Aggregate };
