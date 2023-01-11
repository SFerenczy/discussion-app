import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { MdCheck } from "react-icons/md";
import invariant from "tiny-invariant";

import { ArgumentListItem } from "~/components/ArgumentListItem";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { TextInput } from "~/components/TextInput";
import { createArgument } from "~/models/argument.server";
import { createDownvote, createUpvote } from "~/models/argumentVote.server";
import { getDiscussionAndVotesByUser } from "~/models/discussion.server";
import { getUserId, requireUserId } from "~/session.server";

export enum DiscussionAction {
  UPVOTE_FORM = "upvoteForm",
  DOWNVOTE_FORM = "downvoteForm",
  ADD_ARGUMENT_FORM = "addArgumentForm",
}

export async function loader({ params, request }: LoaderArgs) {
  const { questionId, discussionId } = params;
  invariant(questionId, "questionId not found");
  invariant(discussionId, "discussionId not found");
  const userId = await getUserId(request);

  if (typeof userId !== "string" || userId.length === 0) {
    throw new Response("Not Found", { status: 400 });
  }

  const discussion = await getDiscussionAndVotesByUser(
    { id: discussionId },
    { id: userId }
  );

  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ discussion, userId });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.discussionId, "discussionId not found");
  const userId = await requireUserId(request);
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case DiscussionAction.UPVOTE_FORM:
      return await handleUpvoteForm(formData, userId);
    case DiscussionAction.DOWNVOTE_FORM:
      return await handleDownvoteForm(formData, userId);
    case DiscussionAction.ADD_ARGUMENT_FORM:
      return await handleAddArgumentForm(formData, userId, params.discussionId);
  }
}

export default function DiscussionDetails() {
  const { discussion, userId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        {discussion.arguments.map((argument) => (
          <ArgumentListItem
            key={argument.id}
            argument={argument}
            userId={userId}
          />
        ))}
        <fetcher.Form method="post">
          <Card className="flex flex-row gap-2 p-1">
            <TextInput name="text" placeholder="New argument"></TextInput>
            <Button
              type="submit"
              name="_action"
              value={DiscussionAction.ADD_ARGUMENT_FORM}
              aria-label="Add argument"
            >
              <MdCheck />
            </Button>
          </Card>
        </fetcher.Form>
      </div>
      <Outlet />
    </>
  );
}

async function handleAddArgumentForm(
  formData: FormData,
  userId: string,
  discussionId: string
) {
  const text = formData.get("text");

  if (typeof text !== "string" || text.length === 0) {
    return json(
      { errors: { text: "argument is required" }, body: null },
      { status: 400 }
    );
  }

  const newArgument = await createArgument({
    creatorId: userId,
    text,
    discussionId: discussionId,
  });

  return json({ newArgument });
}

async function handleUpvoteForm(formData: FormData, userId: string) {
  const argumentId = formData.get("argumentId");

  if (typeof argumentId !== "string" || argumentId.length === 0) {
    return json(
      { errors: { upvote: "argumentId is required" }, body: null },
      { status: 400 }
    );
  }

  const newUpvote = await createUpvote({
    voterId: userId,
    argumentId,
  });

  return json({ newUpvote });
}

async function handleDownvoteForm(formData: FormData, userId: string) {
  const argumentId = formData.get("argumentId");

  if (typeof argumentId !== "string" || argumentId.length === 0) {
    return json(
      { errors: { upvote: "argumentId is required" }, body: null },
      { status: 400 }
    );
  }

  const newDownvote = await createDownvote({
    voterId: userId,
    argumentId,
  });

  return json({ newDownvote });
}
