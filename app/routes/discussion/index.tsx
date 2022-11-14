import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getCreatedDiscussionsByUserId } from "~/models/discussion.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  return json({
    discussions: await getCreatedDiscussionsByUserId({ creatorId: userId }),
  });
};

export default function Discussions() {
  const { discussions } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-pink-200">
      {discussions.map((discussion) => (
        <Link key={discussion.id} to={discussion.id}>
          {discussion.title}
        </Link>
      ))}
    </main>
  );
}
