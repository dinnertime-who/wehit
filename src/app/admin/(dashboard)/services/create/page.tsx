import { ServiceForm } from "@/components/reusable/admin/services/detail/service-form";

export default function ServiceCreatePage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">서비스 생성</h1>
        <p className="text-sm text-muted-foreground mt-2">
          새로운 서비스를 등록합니다
        </p>
      </div>
      <ServiceForm mode="create" />
    </section>
  );
}
