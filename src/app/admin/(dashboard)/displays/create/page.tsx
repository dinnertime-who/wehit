import { DisplayCreateForm } from "@/components/reusable/admin/displays/detail/display-create-form";

export default function DisplayCreatePage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">디스플레이 생성</h1>
        <p className="text-sm text-muted-foreground mt-2">
          새로운 디스플레이를 등록합니다
        </p>
      </div>
      <DisplayCreateForm />
    </section>
  );
}
