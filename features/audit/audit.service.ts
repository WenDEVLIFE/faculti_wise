import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { AuditLog, AuditAction, User } from "@/lib/types/firestore.types";

export const auditService = {
  /**
   * Logs a sensitive operation to the audit_logs collection
   */
  async logAction(params: {
    action: AuditAction;
    targetId: string;
    targetType: string;
    details: Record<string, any>;
    performedBy: User;
  }): Promise<void> {
    const { action, targetId, targetType, details, performedBy } = params;

    try {
      const db = getDb();
      if (!db) {
        throw new Error("Firestore not initialized");
      }

      const auditLogRef = collection(db, "audit_logs");
      
      await addDoc(auditLogRef, {
        timestamp: serverTimestamp(),
        userId: performedBy.id,
        userName: performedBy.displayName,
        userEmail: performedBy.email,
        action,
        targetId,
        targetType,
        details,
        metadata: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        }
      });
    } catch (error) {
      console.error("Failed to log audit action:", error);
      // We don't necessarily want to crash the app if logging fails, 
      // but in some systems, this would be a hard requirement.
    }
  },

  /**
   * Fetches recent audit logs
   */
  async fetchLogs(maxCount: number = 100): Promise<AuditLog[]> {
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const logsRef = collection(db, "audit_logs");
    const q = query(logsRef, orderBy("timestamp", "desc"), limit(maxCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AuditLog));
  },

  /**
   * Subscribes to real-time audit log updates
   */
  subscribeToLogs(onUpdate: (logs: AuditLog[]) => void, maxCount: number = 50): () => void {
    const db = getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    const logsRef = collection(db, "audit_logs");
    const q = query(logsRef, orderBy("timestamp", "desc"), limit(maxCount));
    
    return onSnapshot(q, (querySnapshot) => {
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AuditLog));
      onUpdate(logs);
    });
  }
};
