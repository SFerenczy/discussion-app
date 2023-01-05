import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "stream/consumers";

import { getCreatedQuestionsByUserId } from "~/models/question.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const questions = await getCreatedQuestionsByUserId({
    creatorId: userId,
  });

  if (!questions) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ questions });
}

export default function Dashboard() {
  const questions = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-pink-200">
      <h1>Dashboard</h1>
      <h2>Own Questions</h2>
      <div>
        {questions.map((question) => (
          <></>
        ))}
      </div>
    </main>
  );
}
