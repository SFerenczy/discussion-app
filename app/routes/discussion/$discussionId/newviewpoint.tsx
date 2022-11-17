import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

import { ViewpointForm } from "~/components/ViewpointForm";
import { getDiscussion } from "~/models/discussion.server";
import { createViewpoint } from "~/models/viewpoint.server";
import { requireUserId } from "~/session.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.discussionId, "discussionId not found");

  const discussion = await getDiscussion({ id: params.discussionId });
  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ discussionId: params.discussionId });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.discussionId, "discussionId not found");
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const text = formData.get("text");

  if (typeof text !== "string" || text.length === 0) {
    return json(
      { errors: { text: "Description is required" }, body: null },
      { status: 400 }
    );
  }

  await createViewpoint({
    discussionId: params.discussionId,
    text,
    creatorId: userId,
  });

  return redirect(`/discussion/${params.discussionId}`);
}

export default function NewViewpoint() {
  return (
    <div>
      <ViewpointForm formTitle="New Viewpoint" viewpoint={{}} />
    </div>
  );
}
