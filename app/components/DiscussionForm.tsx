import type { Discussion } from "@prisma/client";
import { Form, useActionData } from "@remix-run/react";
import { MdCheck } from "react-icons/md";

import { Button } from "./atoms/Button";
import { Text } from "./atoms/Text";
import { TextInput } from "./TextInput";

interface Props {
  formTitle: string;
  discussion: Partial<Pick<Discussion, "viewpoint">>;
}

export function DiscussionForm(props: Props) {
  const { formTitle, discussion } = props;
  const actionData = useActionData();

  return (
    <Form method="post">
      <div className="flex flex-col items-center gap-y-2 border  border-solid border-gray-500 p-4">
        <Text as="h2">{formTitle}</Text>
        <TextInput
          name="viewpoint"
          placeholder="Your Viewpoint"
          defaultValue={discussion.viewpoint}
          error={actionData?.errors?.text}
        ></TextInput>
        <Button className="self-end" type="submit">
          <MdCheck />
        </Button>
      </div>
    </Form>
  );
}
