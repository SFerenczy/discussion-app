import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getCreatedQuestionsByUserId } from "~/models/question.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  return json({
    questions: await getCreatedQuestionsByUserId({ creatorId: userId }),
  });
};

export default function Questions() {
  const { questions } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-pink-100">
      {questions.map((question) => (
        <Link key={question.id} to={question.id}>
          {question.text}
        </Link>
      ))}
    </main>
  );
}
