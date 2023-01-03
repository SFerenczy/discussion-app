import { json } from "@remix-run/node";

export function handleCreateArgument(questionId: string) {
  return json({ action: "createArgument" });
}
