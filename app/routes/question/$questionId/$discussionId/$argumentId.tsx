import type { ArgumentSource } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { MdCheck } from "react-icons/md";
import invariant from "tiny-invariant";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Text } from "~/components/Text";
import { TextInput } from "~/components/TextInput";
import {
  createArgumentAttack,
  createArgumentSource,
  getArgument,
  getArgumentsByDiscussionId,
  getArgumentSources,
  getAttackedArguments,
} from "~/models/argument.server";

enum ArgumentAction {
  ADD_ARGUMENT_SOURCE_FORM = "addArgumentSourceForm",
  ADD_ARGUMENT_ATTACK = "addArgumentAttack",
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.argumentId, "argumentId not found");
  const formData = await request.formData();

  console.log(formData.get("_action"));
  switch (formData.get("_action")) {
    case ArgumentAction.ADD_ARGUMENT_SOURCE_FORM:
      return await handleAddArgumentSource(formData, params.argumentId);
    case ArgumentAction.ADD_ARGUMENT_ATTACK:
      return await handleAddArgumentAttack(formData, params.argumentId);
  }
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.argumentId, "argumentId not found");
  invariant(params.discussionId, "discussionId not found");

  const argument = await getArgument({ id: params.argumentId });
  const argumentSources = await getArgumentSources({
    id: params.argumentId,
  });
  const attackedArguments = await getAttackedArguments({
    id: params.argumentId,
  });
  const discussionArguments = await getArgumentsByDiscussionId({
    discussionId: params.discussionId,
  });

  if (!argument || !argumentSources || !attackedArguments) {
    throw new Response("Not Found", { status: 400 });
  }

  return json({
    argument,
    attackedArguments,
    argumentSources,
    discussionArguments,
  });
}

export default function ArgumentDetails() {
  const { argument, attackedArguments, argumentSources, discussionArguments } =
    useLoaderData<typeof loader>();

  const notAttackedArguments = useMemo(
    () =>
      discussionArguments.filter(
        (discussionArgument) =>
          !(
            attackedArguments.some(
              (attackedArgument) =>
                attackedArgument.id === discussionArgument.id
            ) || discussionArgument.id === argument.id
          )
      ),
    [discussionArguments, attackedArguments, argument]
  );

  const fetcher = useFetcher();

  return (
    <Card className="w-96">
      <h2>{argument.text}</h2>

      <h3>Attacked Arguments</h3>
      <ul className="list-disc pl-4">
        {attackedArguments.map((argument) => (
          <li key={argument.id}>
            <Text as="span">{argument.text}</Text>
          </li>
        ))}
      </ul>

      <fetcher.Form method="post" name="Add Attacked Argument">
        <select name="attackedArgumentId">
          {notAttackedArguments.map((notAttackedArgument) => (
            <option key={notAttackedArgument.id} value={notAttackedArgument.id}>
              {notAttackedArgument.text}
            </option>
          ))}
        </select>

        <Button
          type="submit"
          name="_action"
          value={ArgumentAction.ADD_ARGUMENT_ATTACK}
          aria-label="Add an argument attack"
        >
          <MdCheck />
        </Button>
      </fetcher.Form>

      <h3>Argument Sources</h3>
      <ul className="list-disc pl-4">
        {argumentSources.map((argumentSource: ArgumentSource) => (
          <li key={argumentSource.id}>
            <a href={argumentSource.href}>{argumentSource.href}</a>
          </li>
        ))}
      </ul>
      <fetcher.Form method="post" name="Add Argument Source">
        <div className="flex">
          <TextInput name="href" placeholder="New Source" />
          <Button
            type="submit"
            name="_action"
            value={ArgumentAction.ADD_ARGUMENT_SOURCE_FORM}
            aria-label="Add a source for the argument"
          >
            <MdCheck />
          </Button>
        </div>
      </fetcher.Form>
    </Card>
  );
}

async function handleAddArgumentSource(formData: FormData, argumentId: string) {
  const href = formData.get("href");

  if (typeof href !== "string" || href.length === 0) {
    return json(
      { errors: "You need to enter a source.", body: null },
      { status: 400 }
    );
  }

  try {
    new URL(href);
  } catch {
    return json(
      { errors: "You need to enter a valid URL.", body: null },
      { status: 400 }
    );
  }

  return json({
    argumentSource: await createArgumentSource({
      argumentId,
      href,
    }),
  });
}

async function handleAddArgumentAttack(formData: FormData, argumentId: string) {
  const attackedArgumentId = formData.get("attackedArgumentId");

  if (
    typeof attackedArgumentId !== "string" ||
    attackedArgumentId.length === 0
  ) {
    return json(
      {
        errors: "You need to give an ID for the attacked Argument.",
        body: null,
      },
      { status: 400 }
    );
  }

  return json({
    argumentAttack: await createArgumentAttack(
      {
        id: argumentId,
      },
      {
        id: attackedArgumentId,
      }
    ),
  });
}
