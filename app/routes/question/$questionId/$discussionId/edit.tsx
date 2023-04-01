import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";

import { DiscussionForm } from "~/components/DiscussionForm";
import {
  getDiscussionAndVotesByUser,
  updateDiscussion,
} from "~/models/discussion.server";
import { requireUserId } from "~/session.server";

export const validator = withZod(
  z.object({
    viewpoint: z.string().min(1, { message: "A Viewpoint is required." }),
  })
);

export async function loader({ params, request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const { questionId, discussionId } = params;
  invariant(questionId, "questionId not found");
  invariant(discussionId, "discussionId not found");

  const discussion = await getDiscussionAndVotesByUser(
    { id: discussionId },
    { id: userId }
  );

  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ discussion });
}

export async function action({ params, request }: ActionArgs) {
  invariant(params.questionId, "questionId not found");
  invariant(params.discussionId, "discussionId not found");

  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { viewpoint } = data.data;

  await updateDiscussion({
    id: params.discussionId,
    viewpoint,
  });

  return redirect(`/questions/${params.questionId}`);
}

export default function EditDiscussion() {
  const { discussion } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <ValidatedForm validator={validator} method="post">
        <DiscussionForm formTitle="Edit discussion" discussion={discussion} />
      </ValidatedForm>
      <Link to="./arguments/?index">Arguments</Link>
    </div>
  );
}
