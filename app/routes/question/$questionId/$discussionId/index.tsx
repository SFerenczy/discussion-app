import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { MdCheck } from "react-icons/md";
import invariant from "tiny-invariant";

import { ArgumentListItem } from "~/components/ArgumentListItem";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { TextInput } from "~/components/TextInput";
import { createArgument } from "~/models/argument.server";
import { getDiscussion } from "~/models/discussion.server";
import { getUserId, requireUserId } from "~/session.server";

export async function loader({ params, request }: LoaderArgs) {
  const { questionId, discussionId } = params;
  invariant(questionId, "questionId not found");
  invariant(discussionId, "discussionId not found");
  const userId = await getUserId(request);

  const discussion = await getDiscussion({ id: discussionId });

  if (!discussion) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ discussion, userId });
}
export async function action({ request, params }: ActionArgs) {
  invariant(params.discussionId, "discussionId not found");
  const formData = await request.formData();
  const text = formData.get("text");
  const userId = await requireUserId(request);

  if (typeof text !== "string" || text.length === 0) {
    return json(
      { errors: { text: "argument is required" }, body: null },
      { status: 400 }
    );
  }

  const newArgument = await createArgument({
    creatorId: userId,
    text,
    discussionId: params.discussionId,
  });

  return json({ newArgument });
}

export default function EditDiscussion() {
  const { discussion, userId } = useLoaderData<typeof loader>();

  return (
    <div className="flex w-full flex-col gap-2">
      {discussion.arguments.map((argument) => (
        <ArgumentListItem
          key={argument.id}
          argument={argument}
          userId={userId}
        />
      ))}
      <Form method="post">
        <Card className="flex flex-row gap-2 p-1">
          <TextInput name="text" placeholder="New argument"></TextInput>
          <Button className="" type="submit">
            <MdCheck />
          </Button>
        </Card>
      </Form>
    </div>
  );
}
