import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { MdAdd } from "react-icons/md";
import invariant from "tiny-invariant";

import { Card } from "~/components/Card";
import { Text } from "~/components/Text";
import { getDiscussion } from "~/models/discussion.server";
import { getViewpointsByDiscussionId } from "~/models/viewpoint.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.discussionId, "discussionId not found");

  const discussion = await getDiscussion({ id: params.discussionId });
  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  const viewpointsInDiscussion = await getViewpointsByDiscussionId({
    discussionId: discussion.id,
  });

  return json({ discussion, viewpointsInDiscussion });
}

export default function Discussion() {
  const { discussion, viewpointsInDiscussion } = useLoaderData<typeof loader>();
  const title = discussion.title ?? "Untitled Discussion";

  return (
    <main className="flex min-h-screen bg-pink-200 p-4">
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center gap-y-4">
          <Text as="h1" className="text-3xl">
            {title}
          </Text>
          <div className="flex w-full flex-grow flex-wrap gap-x-4">
            {viewpointsInDiscussion.map((viewpoint) => (
              <Link to={`${viewpoint.id}`} key={viewpoint.id}>
                <Card className="h-auto w-24">
                  <p>{viewpoint.text}</p>
                </Card>
              </Link>
            ))}
            <Card className="h-24 w-24">
              <div>
                <Link to="newviewpoint/">
                  <MdAdd />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Outlet />
    </main>
  );
}
