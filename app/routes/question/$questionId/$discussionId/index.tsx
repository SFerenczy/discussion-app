import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { MdCheck } from "react-icons/md";
import invariant from "tiny-invariant";

import { ArgumentListItem } from "~/components/ArgumentListItem";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { TextInput } from "~/components/TextInput";
import { createArgument } from "~/models/argument.server";
import { createDownvote, createUpvote } from "~/models/argumentVote.server";
import { getDiscussion } from "~/models/discussion.server";
import { getUserId, requireUserId } from "~/session.server";

export enum DiscussionFormName {
  UPVOTE_FORM = "upvoteForm",
  DOWNVOTE_FORM = "downvoteForm",
  ADD_ARGUMENT_FORM = "addArgumentForm",
}

export async function loader({ params, request }: LoaderArgs) {
  const { questionId, discussionId } = params;
  invariant(questionId, "questionId not found");
  invariant(discussionId, "discussionId not found");
  const userId = await getUserId(request);

  const discussion = await getDiscussion({ id: discussionId });

  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ discussion, userId });
}
export async function action({ request, params }: ActionArgs) {
  invariant(params.discussionId, "discussionId not found");
  const userId = await requireUserId(request);
  const formData = await request.formData();

  console.log(formData.get("formName"));

  switch (formData.get("formName")) {
    case DiscussionFormName.UPVOTE_FORM:
      return await handleUpvoteForm(formData, userId);
    case DiscussionFormName.DOWNVOTE_FORM:
      return await handleDownvoteForm(formData, userId);
    case DiscussionFormName.ADD_ARGUMENT_FORM:
      return await handleAddArgumentForm(formData, userId, params.discussionId);
  }
}

export default function EditDiscussion() {
  const { discussion, userId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="flex w-full flex-col gap-2">
      {discussion.arguments.map((argument) => (
        <ArgumentListItem
          key={argument.id}
          argument={argument}
          userId={userId}
        />
      ))}
      <fetcher.Form method="post" name={DiscussionFormName.ADD_ARGUMENT_FORM}>
        <input
          type="hidden"
          name="formName"
          value={DiscussionFormName.ADD_ARGUMENT_FORM}
        />
        <Card className="flex flex-row gap-2 p-1">
          <TextInput name="text" placeholder="New argument"></TextInput>
          <Button
            className=""
            type="submit"
            aria-label="Add argument"
            value={DiscussionFormName.ADD_ARGUMENT_FORM}
          >
            <MdCheck />
          </Button>
        </Card>
      </fetcher.Form>
    </div>
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
