import type { Discussion } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Discussion } from "@prisma/client";

export async function getCreatedDiscussionsByUserId({
  creatorId: userId,
}: Pick<Discussion, "creatorId">) {
  return prisma.discussion.findMany({ where: { creatorId: userId } });
}

export async function getDiscussion({ id }: Pick<Discussion, "id">) {
  return prisma.discussion.findUnique({ where: { id } });
}

export async function createDiscussion({
  title,
  creatorId,
}: Pick<Discussion, "title" | "creatorId">) {
  return prisma.discussion.create({
    data: {
      title,
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
}
