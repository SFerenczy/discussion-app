import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";

import { Card } from "~/components/atoms/Card";
import { DiscussionForm } from "~/components/DiscussionForm";
import { createDiscussion } from "~/models/discussion.server";
import { getQuestion } from "~/models/question.server";
import { requireUserId } from "~/session.server";

export const validator = withZod(
  z.object({
    viewpoint: z.string().min(1, { message: "A Viewpoint is required." }),
  })
);

export async function loader({ params }: LoaderArgs) {
  invariant(params.questionId, "questionId not found");

  const question = await getQuestion({ id: params.questionId });
  if (!question) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ questionId: params.questionId });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.questionId, "questionId not found");
  const userId = await requireUserId(request);
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { viewpoint } = data.data;

  await createDiscussion({
    questionId: params.questionId,
    viewpoint,
    creatorId: userId,
  });

  return redirect(`/question/${params.questionId}`);
}

export default function NewDiscussion() {
  return (
    <Card className="w-full">
      <ValidatedForm validator={validator} method="post">
        <DiscussionForm formTitle="New Discussion" discussion={{}} />
      </ValidatedForm>
    </Card>
  );
}
