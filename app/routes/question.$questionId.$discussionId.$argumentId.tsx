import type { ArgumentSource } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useMemo } from "react";
import { MdCheck } from "react-icons/md";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";

import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/Card";
import { Text } from "~/components/atoms/Text";
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

export const addArgumentSourceValidator = withZod(
  z.object({
    href: z
      .string()
      .min(1, "A source is required")
      .url("A valid URL is required"),
  })
);
export const addArgumentAttackValidator = withZod(
  z.object({
    attackedArgumentId: z.string().min(1, "An argumentId is required"),
  })
);

export async function action({ request, params }: ActionArgs) {
  invariant(params.argumentId, "argumentId not found");
  const formData = await request.formData();

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
      <Text as="h2">{argument.text}</Text>

      <Text as="h3">Attacked Arguments</Text>
      <ul className="list-disc pl-4">
        {attackedArguments.map((argument) => (
          <li key={argument.id}>
            <Text as="span">{argument.text}</Text>
          </li>
        ))}
      </ul>

      <ValidatedForm
        validator={addArgumentAttackValidator}
        fetcher={fetcher}
        method="post"
        name="Add Attacked Argument"
      >
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
      </ValidatedForm>

      <Text as="h3">Argument Sources</Text>
      <ul className="list-disc pl-4">
        {argumentSources.map((argumentSource: ArgumentSource) => (
          <li key={argumentSource.id}>
            <a href={argumentSource.href}>{argumentSource.href}</a>
          </li>
        ))}
      </ul>
      <ValidatedForm
        validator={addArgumentSourceValidator}
        fetcher={fetcher}
        method="post"
        name="Add Argument Source"
      >
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
      </ValidatedForm>
    </Card>
  );
}

async function handleAddArgumentSource(formData: FormData, argumentId: string) {
  const data = await addArgumentSourceValidator.validate(formData);
  if (data.error) return validationError(data.error);
  const { href } = data.data;

  return json({
    argumentSource: await createArgumentSource({
      argumentId,
      href,
    }),
  });
}

async function handleAddArgumentAttack(formData: FormData, argumentId: string) {
  const data = await addArgumentAttackValidator.validate(formData);
  if (data.error) return validationError(data.error);
  const { attackedArgumentId } = data.data;

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
