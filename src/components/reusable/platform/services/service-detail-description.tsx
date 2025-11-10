"use client";

type Props = {
  description: string;
};

export const ServiceDetailDescription = ({ description }: Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">강의 소개</h2>
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="space-y-6 text-foreground"
        />
      </div>
    </div>
  );
};
