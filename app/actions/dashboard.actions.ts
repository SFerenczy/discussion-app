import { json } from "@remix-run/node";

export function handleCreateArgument(discussionId: string) {
  return json({ action: "createArgument" });
}
