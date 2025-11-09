"use client";

type Props = {
  description: string;
};

export const ServiceDetailDescription = ({ description }: Props) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">강의 소개</h2>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="space-y-4 text-foreground"
        />
      </div>
    </div>
  );
};
