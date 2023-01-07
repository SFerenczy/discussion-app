import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { DiscussionForm } from "~/components/DiscussionForm";
import { getDiscussion, updateDiscussion } from "~/models/discussion.server";

export async function loader({ params }: LoaderArgs) {
  const { questionId, discussionId } = params;
  invariant(questionId, "questionId not found");
  invariant(discussionId, "discussionId not found");

  const discussion = await getDiscussion({ id: discussionId });

  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ discussion });
}

export async function action({ params, request }: ActionArgs) {
  invariant(params.questionId, "questionId not found");
  invariant(params.discussionId, "discussionId not found");

  const formData = await request.formData();
  const viewpoint = formData.get("text");

  if (typeof viewpoint !== "string" || viewpoint.length === 0) {
    return json(
      { errors: { viewpoint: "Description is required" }, body: null },
      { status: 400 }
    );
  }

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
      <DiscussionForm formTitle="Edit discussion" discussion={discussion} />
      <Link to="./arguments/?index">Arguments</Link>
    </div>
  );
}
