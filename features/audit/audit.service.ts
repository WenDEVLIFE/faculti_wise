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
import { db } from "@/lib/firebase";
import { mockData } from "@/lib/constants/mockData";
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

    if (!db) {
      // Offline/Sandbox Demo Mode logging
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
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
      };
      
      // Seed both schemas for backward/forward compatibility
      mockData.auditLogs.unshift({
        ...newLog,
        actorUid: performedBy.id,
        resourceType: targetType,
        resourceId: targetId,
        createdAt: new Date(),
      } as any);
      return;
    }

    try {
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
    }
  },

  /**
   * Fetches recent audit logs
   */
  async fetchLogs(maxCount: number = 100): Promise<AuditLog[]> {
    if (!db) {
      return mockData.auditLogs.slice(0, maxCount).map(log => ({
        id: log.id,
        timestamp: log.timestamp || log.createdAt || new Date(),
        userId: log.userId || log.actorUid || 'system',
        userName: log.userName || 'System Actor',
        userEmail: log.userEmail || '',
        action: log.action,
        targetId: log.targetId || log.resourceId || '',
        targetType: log.targetType || log.resourceType || '',
        details: log.details || log.metadata || {}
      } as AuditLog));
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
    if (!db) {
      const triggerUpdate = () => {
        const logs = mockData.auditLogs.slice(0, maxCount).map(log => ({
          id: log.id,
          timestamp: log.timestamp || log.createdAt || new Date(),
          userId: log.userId || log.actorUid || 'system',
          userName: log.userName || 'System Actor',
          userEmail: log.userEmail || '',
          action: log.action,
          targetId: log.targetId || log.resourceId || '',
          targetType: log.targetType || log.resourceType || '',
          details: log.details || log.metadata || {}
        } as AuditLog));
        onUpdate(logs);
      };
      
      // Initial trigger
      triggerUpdate();
      
      // Simple interval polling to pick up in-memory updates
      const interval = setInterval(triggerUpdate, 1000);
      return () => clearInterval(interval);
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

