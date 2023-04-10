import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";

import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/TextInput";
import { createQuestion } from "~/models/question.server";
import { getUserId, requireUserId } from "~/session.server";

export const validator = withZod(
  z.object({
    text: z.string().min(1, { message: "A Question is required." }),
  })
);

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { text } = data.data;

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
  const { userId } = useLoaderData<typeof loader>();

  return (
    <main>
      <div className="relative flex min-h-screen flex-col items-center justify-evenly bg-pink-100">
        <ValidatedForm validator={validator} method="post">
          <div className="flex w-96 flex-grow flex-col justify-center gap-y-3">
            <TextInput
              label="What do you want to discuss?"
              name="text"
              placeholder="Your Question"
            />
            <Button type="submit">Discuss!</Button>
          </div>
        </ValidatedForm>
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
