import type { Discussion } from "@prisma/client";
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

  return (
    <div className="flex flex-col gap-y-2">
      <Text as="h2">{formTitle}</Text>
      <div className="flex items-center">
        <TextInput
          name="viewpoint"
          placeholder="Your Viewpoint"
          defaultValue={discussion.viewpoint}
        ></TextInput>
        <Button className="self-end" type="submit">
          <MdCheck />
        </Button>
      </div>
    </div>
  );
}
