"use client";

type Props = {
  title: string | string[];
  className?: string;
};

export function TextSection({ title, className = "" }: Props) {
  const titleLines = Array.isArray(title) ? title : [title];

  return (
    <section className={`app-container text-center mt-20 mb-6 ${className}`}>
      <div className="flex flex-col">
        {titleLines.map((line) => (
          <h2
            key={line}
            className="text-2xl font-semibold leading-normal text-[rgb(161,161,161)]"
          >
            {line}
          </h2>
        ))}
      </div>
    </section>
  );
}
