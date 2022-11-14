import type { Viewpoint } from "@prisma/client";
import { Form, useActionData } from "@remix-run/react";
import { MdCheck } from "react-icons/md";

import { Button } from "./Button";
import { Text } from "./Text";
import { TextInput } from "./TextInput";

interface Props {
  formTitle: string;
  viewpoint: Partial<Pick<Viewpoint, "text">>;
}

export function ViewpointForm(props: Props) {
  const { formTitle, viewpoint } = props;
  const actionData = useActionData();

  return (
    <Form method="post">
      <Text as="h2">{formTitle}</Text>
      <TextInput
        name="text"
        placeholder="Your Viewpoint"
        defaultValue={viewpoint.text}
        error={actionData?.errors?.text}
      ></TextInput>
      <div>
        <Button type="submit">
          <MdCheck />
        </Button>
      </div>
    </Form>
  );
}
