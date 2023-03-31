import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/TextInput";
import { createQuestion } from "~/models/question.server";
import { getUserId, requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const text = formData.get("text");

  if (typeof text !== "string" || text.length === 0) {
    return json(
      { errors: { text: "Title is required", body: null } },
      { status: 400 }
    );
  }

  const question = await createQuestion({
    creatorId: userId,
    text,
  });

  return redirect(`/question/${question.id}`);
}

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  return json({ userId });
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const { userId } = useLoaderData<typeof loader>();

  return (
    <main>
      <div className="relative flex min-h-screen flex-col items-center justify-evenly bg-pink-100">
        <Form method="post">
          <div className="flex w-96 flex-grow flex-col justify-center gap-y-3">
            <TextInput
              label="What do you want to discuss?"
              name="text"
              placeholder="Your Question"
              error={actionData?.errors?.text}
            />
            <Button type="submit">Discuss!</Button>
          </div>
        </Form>
        <div className="flex gap-1 pb-4">
          {userId ? (
            <Link to="dashboard" className="underline">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="join" className="underline">
                Join
              </Link>
              |
              <Link to="login" className="underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
