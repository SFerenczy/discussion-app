import type { ArgumentDownvote, ArgumentUpvote } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createUpvote({
  argumentId,
  voterId,
}: Pick<ArgumentUpvote, "argumentId" | "voterId">) {
  const previousUpvote = await getUpvoteByArgumentAndUserId({
    argumentId,
    voterId,
  });

  if (previousUpvote) {
    return previousUpvote;
  }

  const previousDownvote = await getDownvoteByArgumentAndUserId({
    argumentId,
    voterId,
  });

  if (previousDownvote) {
    await deleteDownvote({ id: previousDownvote.id });
  }

  return prisma.argumentUpvote.create({
    data: {
      argument: {
        connect: {
          id: argumentId,
        },
      },
      voter: {
        connect: {
          id: voterId,
        },
      },
    },
  });
}

export async function createDownvote({
  argumentId,
  voterId,
}: Pick<ArgumentDownvote, "argumentId" | "voterId">) {
  const previousDownvote = await getDownvoteByArgumentAndUserId({
    argumentId,
    voterId,
  });

  if (previousDownvote) {
    return previousDownvote;
  }

  const previousUpvote = await getUpvoteByArgumentAndUserId({
    argumentId,
    voterId,
  });

  if (previousUpvote) {
    await deleteUpvote({ id: previousUpvote.id });
  }

  return prisma.argumentDownvote.create({
    data: {
      argument: {
        connect: {
          id: argumentId,
        },
      },
      voter: {
        connect: {
          id: voterId,
        },
      },
    },
  });
}

export async function getDownvoteByArgumentAndUserId({
  argumentId,
  voterId,
}: Pick<ArgumentDownvote, "argumentId" | "voterId">) {
  return prisma.argumentDownvote.findFirst({
    where: {
      argumentId,
      voterId,
    },
  });
}

export async function getUpvoteByArgumentAndUserId({
  argumentId,
  voterId,
}: Pick<ArgumentUpvote, "argumentId" | "voterId">) {
  return prisma.argumentUpvote.findFirst({
    where: {
      argumentId,
      voterId,
    },
  });
}

export async function deleteDownvote({ id }: Pick<ArgumentDownvote, "id">) {
  return prisma.argumentDownvote.delete({
    where: {
      id,
    },
  });
}

export async function deleteUpvote({ id }: Pick<ArgumentUpvote, "id">) {
  return prisma.argumentUpvote.delete({
    where: {
      id,
    },
  });
}
