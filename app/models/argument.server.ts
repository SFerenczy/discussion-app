import type { Argument } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getArgument({ id }: Pick<Argument, "id">) {
  return prisma.argument.findUnique({ where: { id } });
}

export async function getArgumentsByViewpointId({
  viewpointId,
}: Pick<Argument, "viewpointId">) {
  return prisma.argument.findMany({ where: { viewpointId } });
}

export async function createArgument({
  viewpointId,
  creatorId,
  text,
}: Pick<Argument, "viewpointId" | "text" | "creatorId">) {
  return prisma.argument.create({
    data: {
      viewpointId,
      creatorId,
      text,
    },
  });
}
