const categoryStyles: Record<string, string> = {
  Journal: "bg-blue-900 text-blue-200",
  Workshop: "bg-amber-500 text-amber-50",
  Book: "bg-rose-400 text-rose-100",
};

const statusStyles: Record<string, string> = {
  Published: "bg-green-600 text-green-50",
  Draft: "bg-gray-400 text-gray-100",
};

export function getCategoryStyle(category: string): string {
  return categoryStyles[category] ?? "bg-gray-300 text-gray-700";
}

export function getStatusStyle(status: string): string {
  return statusStyles[status] ?? "bg-gray-300 text-gray-700";
}
