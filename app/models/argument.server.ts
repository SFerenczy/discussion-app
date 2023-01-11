import type { Argument, ArgumentSource } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getArgument({ id }: Pick<Argument, "id">) {
  return prisma.argument.findUnique({
    where: { id },
  });
}

export async function getAttackedArguments({
  id: attackedId,
}: Pick<Argument, "id">) {
  return prisma.argument.findMany({
    where: { attackingArguments: { some: { id: attackedId } } },
  });
}

export async function getArgumentSources({
  id: argumentId,
}: Pick<Argument, "id">) {
  return prisma.argumentSource.findMany({ where: { argumentId } });
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
      discussion: { connect: { id: discussionId } },
      creator: { connect: { id: creatorId } },
      text,
    },
  });
}

export async function createArgumentSource({
  argumentId,
  href,
}: Pick<ArgumentSource, "argumentId" | "href">) {
  return prisma.argumentSource.create({
    data: { href, argumentId },
  });
}

export async function createArgumentAttack(
  { id: attackerId }: Pick<Argument, "id">,
  { id: attackedId }: Pick<Argument, "id">
) {
  return prisma.argument.update({
    where: { id: attackerId },
    data: { attackedArguments: { connect: { id: attackedId } } },
  });
}
