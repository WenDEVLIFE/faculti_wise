import UserManagementView from "@/features/user-management/UserManagementView";

export const metadata = {
  title: "User Management | Faculty Wise",
  description: "Manage administrators, faculty, and students access.",
};

export default function UsersPage() {
  return <UserManagementView />;
}
