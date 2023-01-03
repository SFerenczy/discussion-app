import type { Argument } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getArgument({ id }: Pick<Argument, "id">) {
  return prisma.argument.findUnique({ where: { id } });
}

export async function getArgumentsByDiscussionId({
  discussionId,
}: Pick<Argument, "discussionId">) {
  return prisma.argument.findMany({ where: { discussionId } });
}

export async function createArgument({
  discussionId,
  creatorId,
  text,
}: Pick<Argument, "discussionId" | "text" | "creatorId">) {
  return prisma.argument.create({
    data: {
      discussionId,
      creatorId,
      text,
    },
  });
}
