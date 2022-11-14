interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button(props: Props) {
  const { children, ...rest } = props;
  return (
    <button
      className="rounded-md bg-white p-2 shadow-md hover:bg-gray-50 active:bg-gray-100 active:shadow"
      {...rest}
    >
      {children}
    </button>
  );
}
