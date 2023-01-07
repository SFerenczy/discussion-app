import type { Argument } from "@prisma/client";

import { Card } from "./Card";

interface Props {
  argument: Pick<Argument, "id" | "text">;
}

export const ArgumentListItem = ({ argument }: Props) => (
  <Card className="w-full justify-start p-2">
    <div>{argument.text}</div>
  </Card>
);
