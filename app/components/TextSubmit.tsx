import { useFetcher } from "@remix-run/react";
import { MdCheck } from "react-icons/md";

import { Button } from "./atoms/Button";
import { TextInput } from "./TextInput";

interface Props extends React.ButtonHTMLAttributes<HTMLInputElement> {
  actionName: string;
}

/**
 * A text input with a submit button. On submit the inputs value is send to the actionhandler of the route it is rendered in.
 * @param actionName The name of the actionhandler to send the value to.
 */
export function TextSubmit(props: Props) {
  const { actionName, defaultValue } = props;
  const fetcher = useFetcher();

  return (
    <div>
      <fetcher.Form method="post">
        <input type="hidden" name="_action" value={actionName} />
        <TextInput name="first-input" defaultValue={defaultValue} />
        <Button type="submit">
          <MdCheck />
        </Button>
      </fetcher.Form>
    </div>
  );
}
