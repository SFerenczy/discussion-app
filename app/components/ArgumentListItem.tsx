import type {
  Argument,
  ContraArgumentVote,
  ProArgumentVote,
} from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { Card } from "./Card";

interface Props {
  /** The argument that is listed, including its votes */
  argument: Pick<Argument, "id" | "text"> & {
    proVotes: ProArgumentVote[];
    contraVotes: ContraArgumentVote[];
  };
  /** The id of the current user, if logged in. */
  userId?: string;
}

export const ArgumentListItem = ({ argument, userId }: Props): JSX.Element => (
  <Card className="flex w-full justify-between p-2">
    <div>{argument.text}</div>
    <div className="flex">
      <VotingButton
        count={argument.proVotes.length}
        up={true}
        argumentId={argument.id}
        userId={userId}
      />
      <VotingButton
        count={argument.contraVotes.length}
        up={false}
        argumentId={argument.id}
        userId={userId}
      />
    </div>
  </Card>
);

interface VotingButtonProps {
  /** The number of up or down votes */
  count: number;
  /** Whether this is an upvote or downvote button */
  up: boolean;
  /** The id of the argument to vote on */
  argumentId: string;
  /** The id of the current user, if logged in. */
  userId?: string;
}

/**
 * A button that allows a user to upvote or downvote an argument.
 * Shows the number of votes next to the button.
 */
const VotingButton = ({
  count,
  up,
  argumentId,
  userId,
}: VotingButtonProps): JSX.Element => {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" name={up ? "upvote" : "downvote"}>
      <input type="hidden" name="argumentId" value={argumentId} />
      <div className="flex items-center">
        {userId && (
          <button type="submit">
            {up ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>
        )}
        <div>{count}</div>
      </div>
    </fetcher.Form>
  );
};
