import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

import { DiscussionForm } from "~/components/DiscussionForm";
import { createDiscussion } from "~/models/discussion.server";
import { getQuestion } from "~/models/question.server";
import { requireUserId } from "~/session.server";

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
  const formData = await request.formData();
  const viewpoint = formData.get("viewpoint");

  if (typeof viewpoint !== "string" || viewpoint.length === 0) {
    return json(
      { errors: { viewpoint: "A viewpoint is required" }, body: null },
      { status: 400 }
    );
  }

  await createDiscussion({
    questionId: params.questionId,
    viewpoint,
    creatorId: userId,
  });

  return redirect(`/question/${params.questionId}`);
}

export default function NewDiscussion() {
  return (
    <div>
      <DiscussionForm formTitle="New Discussion" discussion={{}} />
    </div>
  );
}
