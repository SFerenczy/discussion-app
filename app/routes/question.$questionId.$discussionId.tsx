import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { MdCheck, MdClear } from "react-icons/md";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";

import { ArgumentListItem } from "~/components/ArgumentListItem";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/Card";
import { Text } from "~/components/atoms/Text";
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

export const voteValidator = withZod(
  z.object({
    argumentId: z.string().min(1, "An argumentId is required"),
  })
);

export const addArgumentValidator = withZod(
  z.object({
    text: z.string().min(1, "An argument is required"),
    attackingOrDefending: z
      .string()
      .min(1, "An attackingOrDefending-value is required"),
  })
);

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

export default function DiscussionDetails() {
  const { discussion, userId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const viewpointDefendingArguments = discussion.arguments.filter(
    (argument) => argument.argumentDefendsViewpoint
  );
  const viewpointAttackingArguments = discussion.arguments.filter(
    (argument) => argument.argumentAttacksViewpoint
  );

  return (
    <>
      <Card className="relative flex w-full flex-col items-center gap-y-4">
        <Link to="../" className="absolute right-2 top-2">
          <MdClear />
        </Link>
        <Text as="h2" className="text-2xl">
          {discussion.viewpoint}
        </Text>
        <div className="flex w-full gap-x-4">
          <div className="flex flex-grow flex-col gap-2">
            <Text as="h3" className="text-xl">
              Attacking Arguments
            </Text>
            {viewpointAttackingArguments.map((argument) => (
              <ArgumentListItem
                key={argument.id}
                argument={argument}
                userId={userId}
              />
            ))}
            <ValidatedForm
              validator={addArgumentValidator}
              fetcher={fetcher}
              method="post"
            >
              <Card className="flex flex-row gap-2 p-1">
                <input
                  type="hidden"
                  name="_action"
                  value={DiscussionAction.ADD_ARGUMENT_FORM}
                />
                <input
                  type="hidden"
                  name="attackingOrDefending"
                  value="attacking"
                />
                <TextInput name="text" placeholder="New argument"></TextInput>
                <Button type="submit" aria-label="Add argument">
                  <MdCheck className="w-8 text-2xl" />
                </Button>
              </Card>
            </ValidatedForm>
          </div>
          <div className="flex flex-grow flex-col gap-2">
            <Text as="h3" className="text-xl">
              Defending Arguments
            </Text>
            {viewpointDefendingArguments.map((argument) => (
              <ArgumentListItem
                key={argument.id}
                argument={argument}
                userId={userId}
              />
            ))}
            <ValidatedForm
              validator={addArgumentValidator}
              fetcher={fetcher}
              method="post"
            >
              <Card className="flex flex-row gap-2 p-1">
                <input
                  type="hidden"
                  name="_action"
                  value={DiscussionAction.ADD_ARGUMENT_FORM}
                />
                <input
                  type="hidden"
                  name="attackingOrDefending"
                  value="defending"
                />
                <TextInput name="text" placeholder="New argument"></TextInput>
                <Button type="submit" aria-label="Add argument">
                  <MdCheck className="w-8 text-2xl" />
                </Button>
              </Card>
            </ValidatedForm>
          </div>
        </div>
      </Card>
      <Outlet />
    </>
  );
}

async function handleAddArgumentForm(
  formData: FormData,
  userId: string,
  discussionId: string
) {
  const data = await addArgumentValidator.validate(formData);
  if (data.error) return validationError(data.error);
  const { text, attackingOrDefending } = data.data;

  const argumentAttacksViewpoint = attackingOrDefending === "attacking";
  const argumentDefendsViewpoint = attackingOrDefending === "defending";

  const newArgument = await createArgument({
    creatorId: userId,
    text,
    discussionId: discussionId,
    argumentAttacksViewpoint,
    argumentDefendsViewpoint,
  });

  return json({ newArgument });
}

async function handleUpvoteForm(formData: FormData, userId: string) {
  const data = await voteValidator.validate(formData);
  if (data.error) return validationError(data.error);
  const { argumentId } = data.data;

  const newUpvote = await createUpvote({
    voterId: userId,
    argumentId,
  });

  return json({ newUpvote });
}

async function handleDownvoteForm(formData: FormData, userId: string) {
  const data = await voteValidator.validate(formData);
  if (data.error) return validationError(data.error);
  const { argumentId } = data.data;

  const newDownvote = await createDownvote({
    voterId: userId,
    argumentId,
  });

  return json({ newDownvote });
}
