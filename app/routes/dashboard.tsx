import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
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
  const { questions } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen w-full bg-pink-100">
      <div className="flex flex-col items-center gap-y-4 px-48">
        <h1>Dashboard</h1>
        <Card className="w-full">
          <h2>Own Questions</h2>
          <Divider />
          <div>
            {questions.map((question) => (
              <Link key={question.id} to={`/question/${question.id}`}>
                {question.text}
              </Link>
            ))}
          </div>
        </Card>
        <Card className="w-full">
          <h2>Popular Questions</h2>
          <Divider />
        </Card>
      </div>
    </main>
  );
}
