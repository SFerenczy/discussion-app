import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Button } from "~/components/Button";
import { TextInput } from "~/components/TextInput";
import { createDiscussion } from "~/models/discussion.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  }

  const discussion = await createDiscussion({
    creatorId: userId,
    title: title,
  });

  return redirect(`/discussion/${discussion.id}`);
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <main>
      <div className="relative flex min-h-screen flex-col items-center justify-evenly bg-pink-200">
        <Form method="post">
          <div className="flex w-96 flex-grow flex-col justify-center gap-y-3">
            <TextInput
              label="What do you want to discuss?"
              name="title"
              placeholder="Question of your discussion"
              error={actionData?.errors?.title}
            />
            <Button type="submit">Discuss!</Button>
          </div>
        </Form>
        <div className="pb-4">
          <Link className="underline" to="login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
