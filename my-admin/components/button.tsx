interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      className="rounded-lg border-2 w-30 border-gray-400 px-4 py-2 mb-4"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
