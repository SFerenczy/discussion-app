import { useFetcher, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { MdCheck } from "react-icons/md";
import invariant from "tiny-invariant";

import { Button } from "~/components/Button";
import { Text } from "~/components/Text";
import { TextInput } from "~/components/TextInput";
import {
  createArgument,
  getArgumentsByViewpointId,
} from "~/models/argument.server";
import { requireUserId } from "~/session.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.viewpointId, "viewpointId not found");

  const argumentsOfViewpoint = await getArgumentsByViewpointId({
    viewpointId: params.viewpointId,
  });

  return json({ argumentsOfViewpoint });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.viewpointId, "viewpointId not found");
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
    viewpointId: params.viewpointId,
  });

  return json({ newArgument });
}

export default function ViewpointArguments() {
  const { argumentsOfViewpoint } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <div className="flex flex-col items-center gap-y-2 border  border-solid border-gray-500 p-4">
        {argumentsOfViewpoint.map((argumentsOfViewpoint) => (
          <Text as="p" key={argumentsOfViewpoint.id}>
            {argumentsOfViewpoint.text}
          </Text>
        ))}
        <TextInput name="text" placeholder="New argument"></TextInput>
        <Button className="self-end" type="submit">
          <MdCheck />
        </Button>
      </div>
    </fetcher.Form>
  );
}
