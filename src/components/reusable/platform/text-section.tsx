"use client";

type Props = {
  title: string | string[];
  className?: string;
};

export function TextSection({ title, className = "" }: Props) {
  const titleLines = Array.isArray(title) ? title : [title];

  return (
    <section className={`app-container text-center py-6 lg:py-12 ${className}`}>
      <div className="flex flex-col gap-4">
        {titleLines.map((line) => (
          <h2
            key={line}
            className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight"
          >
            {line}
          </h2>
        ))}
      </div>
    </section>
  );
}
