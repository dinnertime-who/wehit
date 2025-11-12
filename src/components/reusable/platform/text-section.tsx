"use client";

type Props = {
  title: string | string[];
  className?: string;
};

export function TextSection({ title, className = "" }: Props) {
  const titleLines = Array.isArray(title) ? title : [title];

  return (
    <section className={`app-container text-center mt-20 mb-6 ${className}`}>
      <div className="flex flex-col gap-5">
        {titleLines.map((line) => (
          <h2
            key={line}
            className="text-lg md:text-2xl lg:text-3xl font-extrabold leading-tight"
          >
            {line}
          </h2>
        ))}
      </div>
    </section>
  );
}
