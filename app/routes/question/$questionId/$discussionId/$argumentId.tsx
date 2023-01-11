import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Card } from "~/components/Card";
import { getArgument } from "~/models/argument.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.argumentId, "argumentId not found");
  const argument = await getArgument({
    id: params.argumentId,
    include: { upvotes: true, downvotes: true, attackedArguments: true },
  });

  if (!argument) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({ argument });
}

export default function ArgumentDetails() {
  const { argument } = useLoaderData<typeof loader>();

  return (
    <Card className="w-96">
      <h2>{argument.text}</h2>
      <ul>{}</ul>
      <ul></ul>
    </Card>
  );
}
