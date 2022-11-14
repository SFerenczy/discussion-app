import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { viewpointLoader } from "~/loader/discussion.loader";

export function loader({ params }: LoaderArgs) {
  return viewpointLoader(params.discussionId, params.viewpointId);
}

export default function ViewpointDetails() {
  const { viewpoint } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <h1>{viewpoint.text}</h1>
      <Outlet />
    </div>
  );
}
