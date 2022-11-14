interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card(props: Props) {
  const { children, className, ...rest } = props;
  return (
    <div
      className={`${className} flex flex-col items-center justify-center rounded-md bg-gray-50 p-4 shadow-md`}
      {...rest}
    >
      {children}
    </div>
  );
}
