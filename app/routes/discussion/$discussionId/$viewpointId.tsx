import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { ViewpointForm } from "~/components/ViewpointForm";
import { viewpointLoader } from "~/loader/discussion.loader";
import { updateViewpoint } from "~/models/viewpoint.server";

export async function loader({ params }: LoaderArgs) {
  return viewpointLoader(params.discussionId, params.viewpointId);
}

export async function action({ params, request }: ActionArgs) {
  invariant(params.discussionId, "discussionId not found");
  invariant(params.viewpointId, "viewpointId not found");

  const formData = await request.formData();
  const text = formData.get("text");

  if (typeof text !== "string" || text.length === 0) {
    return json(
      { errors: { text: "Description is required" }, body: null },
      { status: 400 }
    );
  }

  await updateViewpoint({
    id: params.viewpointId,
    text,
  });

  return redirect(`/discussions/${params.discussionId}`);
}

export default function EditViewpoint() {
  const { viewpoint } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <ViewpointForm formTitle="Edit viewpoint" viewpoint={viewpoint} />
      <Link to="./arguments/?index">Arguments</Link>
      <Outlet />
    </div>
  );
}
