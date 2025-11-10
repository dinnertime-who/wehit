import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/hooks/apis/admin/use-admin-users";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "이메일",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "emailVerified",
    header: "이메일 인증",
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified") as boolean;
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "인증됨" : "미인증"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: "역할",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null;
      return (
        <div className="text-sm">
          {role ? <Badge variant="outline">{role}</Badge> : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "banned",
    header: "상태",
    cell: ({ row }) => {
      const banned = row.getValue("banned") as boolean;
      return (
        <Badge variant={banned ? "destructive" : "default"}>
          {banned ? "차단됨" : "정상"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "가입일",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {format(new Date(date), "yyyy-MM-dd", { locale: ko })}
        </div>
      );
    },
  },
];

