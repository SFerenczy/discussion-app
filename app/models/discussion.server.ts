import type { Discussion } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getDiscussion({ id }: Pick<Discussion, "id">) {
  return prisma.discussion.findUnique({
    where: { id },
    select: {
      id: true,
      viewpoint: true,
      arguments: {
        select: {
          id: true,
          text: true,
          proVotes: true,
          contraVotes: true,
        },
      },
    },
  });
}

export async function getDiscussionsByQuestionId({
  questionId,
}: Pick<Discussion, "questionId">) {
  return prisma.discussion.findMany({
    where: { questionId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDiscussion({
  creatorId,
  viewpoint,
  questionId,
}: Pick<Discussion, "creatorId" | "viewpoint" | "questionId">) {
  return prisma.discussion.create({
    data: {
      viewpoint,
      question: {
        connect: {
          id: questionId,
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

export async function updateDiscussion(
  data: Pick<Discussion, "id"> & Partial<Pick<Discussion, "viewpoint">>
) {
  return prisma.discussion.update({
    where: { id: data.id },
    data,
  });
}
