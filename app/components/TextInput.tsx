interface Props extends React.ButtonHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput(props: Props) {
  const { label, error, ...rest } = props;
  return (
    <div className="w-full">
      {label && <label className="flex flex-col gap-y-1">{label}</label>}
      <input
        type="text"
        className="w-full rounded-md border border-none border-gray-300 p-3 outline-none"
        {...rest}
      />

      {error && (
        <div className="pt-1 text-red-700" id="title-error">
          {error}
        </div>
      )}
    </div>
  );
}
