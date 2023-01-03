import type { Question } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Question } from "@prisma/client";

export async function getCreatedQuestionsByUserId({
  creatorId: userId,
}: Pick<Question, "creatorId">) {
  return prisma.question.findMany({ where: { creatorId: userId } });
}

export async function getQuestion({ id }: Pick<Question, "id">) {
  return prisma.question.findUnique({ where: { id } });
}

export async function createQuestion({
  text,
  creatorId,
}: Pick<Question, "text" | "creatorId">) {
  return prisma.question.create({
    data: {
      text,
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
}
