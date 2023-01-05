import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { MdAdd } from "react-icons/md";
import invariant from "tiny-invariant";

import { Card } from "~/components/Card";
import { Text } from "~/components/Text";
import { getDiscussionsByQuestionId } from "~/models/discussion.server";
import { getQuestion } from "~/models/question.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.questionId, "questionId not found");

  const question = await getQuestion({ id: params.questionId });
  if (!question) {
    throw new Response("Not Found", { status: 400 });
  }

  const discussionsInQuestion = await getDiscussionsByQuestionId({
    questionId: question.id,
  });

  return json({ question, discussionsInQuestion });
}

export default function Question() {
  const { question, discussionsInQuestion } = useLoaderData<typeof loader>();
  const title = question.text ?? "Untitled Question";

  return (
    <main className="flex min-h-screen bg-pink-100 p-4">
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center gap-y-4">
          <Text as="h1" className="text-3xl">
            {title}
          </Text>
          <div className="flex w-full flex-grow flex-wrap gap-x-4">
            {discussionsInQuestion.map((discussion) => (
              <Link to={`${discussion.id}`} key={discussion.id}>
                <Card className="h-auto w-24">
                  <p>{discussion.viewpoint}</p>
                </Card>
              </Link>
            ))}
            <Card className="h-24 w-24">
              <div>
                <Link to="newdiscussion/">
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
