export interface Department {
  id: string;
  code: string;
  name: string;
  chairUid: string | null;
  chairName?: string; // for display
  createdAt?: any; // Firestore Timestamp
}

export interface DepartmentFilter {
  search?: string;
}
