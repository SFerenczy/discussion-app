import type { Viewpoint } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getViewpoint({ id }: Pick<Viewpoint, "id">) {
  return prisma.viewpoint.findUnique({
    where: { id },
    select: {
      id: true,
      text: true,
    },
  });
}

export async function getViewpointsByDiscussionId({
  discussionId,
}: Pick<Viewpoint, "discussionId">) {
  return prisma.viewpoint.findMany({
    where: { discussionId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createViewpoint({
  creatorId,
  text,
  discussionId,
}: Pick<Viewpoint, "creatorId" | "text" | "discussionId">) {
  return prisma.viewpoint.create({
    data: {
      text,
      discussion: {
        connect: {
          id: discussionId,
        },
      },

      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
}

export async function updateViewpoint(
  data: Pick<Viewpoint, "id"> & Partial<Pick<Viewpoint, "text">>
) {
  return prisma.viewpoint.update({
    where: { id: data.id },
    data,
  });
}
