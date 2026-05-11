import AuditLogsView from "@/features/audit/AuditLogsView";

export const metadata = {
  title: "Audit Logs | Faculty Wise",
  description: "View system audit logs and sensitive operations.",
};

export default function AuditPage() {
  return <AuditLogsView />;
}
