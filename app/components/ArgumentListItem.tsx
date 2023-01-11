import type {
  Argument,
  ArgumentDownvote,
  ArgumentUpvote,
} from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from "react-icons/md";

import { DiscussionAction } from "~/routes/question/$questionId/$discussionId";

import { Card } from "./Card";

interface Props {
  /** The argument that is listed, including its votes */
  argument: Pick<Argument, "id" | "text"> & {
    upvotes: ArgumentUpvote[];
    downvotes: ArgumentDownvote[];
  };
  /** The id of the current user, if logged in. */
  userId?: string;
}

export const ArgumentListItem = ({ argument, userId }: Props): JSX.Element => (
  <Card className="flex w-full justify-between p-2">
    <div>{argument.text}</div>
    <div className="flex">
      <VotingButton
        count={argument.upvotes.length}
        up={true}
        argumentId={argument.id}
        userId={userId}
      />
      <VotingButton
        count={argument.downvotes.length}
        up={false}
        argumentId={argument.id}
        userId={userId}
      />

      <Link to={argument.id}>
        <MdKeyboardArrowRight />
      </Link>
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
      <input
        type="hidden"
        name="_action"
        value={
          up ? DiscussionAction.UPVOTE_FORM : DiscussionAction.DOWNVOTE_FORM
        }
      />
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
