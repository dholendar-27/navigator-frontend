import type { JSX } from "react";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
        <span className="text-2xl text-blue-600 font-semibold">{title.charAt(0)}</span>
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">{title}</h1>
      <p className="text-zinc-500 max-w-md">
        This is a placeholder for the {title} page. This section of the application is currently under development.
      </p>
    </div>
  );
}
