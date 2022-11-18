interface Props extends React.ButtonHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput(props: Props) {
  const { label, error, ...rest } = props;
  return (
    <label className="flex flex-col gap-y-1">
      <span>{label}</span>
      <input
        type="text"
        className="rounded-md border border-none border-gray-300 p-3 outline-none"
        {...rest}
      />

      {error && (
        <div className="pt-1 text-red-700" id="title-error">
          {error}
        </div>
      )}
    </label>
  );
}
