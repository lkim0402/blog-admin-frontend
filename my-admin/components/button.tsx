interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export default function Button({ text, onClick, className }: ButtonProps) {
  return (
    <button
      className={`
        rounded-lg border-2 w-30 border-gray-400 
        hover:cursor-pointer
        px-4 py-2 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
