interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card(props: Props) {
  const { children, className, ...rest } = props;
  return (
    <div
      className={`rounded-md bg-gray-50 p-4 shadow-md ${className} `}
      {...rest}
    >
      {children}
    </div>
  );
}
