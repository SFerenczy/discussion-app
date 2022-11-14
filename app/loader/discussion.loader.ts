import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getViewpoint } from "~/models/viewpoint.server";

export async function viewpointLoader(
  discussionId: string | undefined,
  viewpointId: string | undefined
) {
  invariant(discussionId, "discussionId not found");
  invariant(viewpointId, "viewpointId not found");

  const viewpoint = await getViewpoint({ id: viewpointId });

  if (!viewpoint) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ viewpoint });
}
