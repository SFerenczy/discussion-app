import { createElement } from "react";

interface Props {
  children: React.ReactNode;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export function Text(props: Props) {
  return createElement(
    props.as,
    { className: "text-gray-900" },
    props.children
  );
}
