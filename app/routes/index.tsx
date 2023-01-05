import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Button } from "~/components/Button";
import { TextInput } from "~/components/TextInput";
import { createQuestion } from "~/models/question.server";
import { requireUserId } from "~/session.server";

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

export default function Index() {
  const actionData = useActionData<typeof action>();

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
          <Link className="underline" to="join">
            Join
          </Link>
          |
          <Link className="underline" to="login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
