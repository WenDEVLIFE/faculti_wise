import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { Room } from "@/lib/types/room.types";
import { User } from "@/lib/types/firestore.types";
import { auditService } from "../audit/audit.service";
import { mockData } from "@/lib/constants/mockData";

export const roomsService = {
  subscribeRooms(onUpdate: (rooms: Room[]) => void): () => void {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Immediately callback with mockData
      onUpdate(mockData.rooms as unknown as Room[]);
      // Return a dummy unsubscribe
      return () => {};
    }

    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, orderBy("name", "asc"));
    
    return onSnapshot(q, (querySnapshot) => {
      const rooms = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          building: data.building || "",
          floor: Number(data.floor) || 1,
          capacity: Number(data.capacity) || 0,
          type: data.type || "lecture",
          status: data.status || "available",
          features: data.features || [],
          currentClass: data.currentClass || "",
        } as Room;
      });
      onUpdate(rooms);
    });
  },

  async createRoom(data: Omit<Room, 'id'>, performingUser?: User): Promise<Room> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Add to mockData
      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      (mockData.rooms as any).push(newRoom);
      return newRoom;
    }

    const roomsRef = collection(db, "rooms");
    const docRef = await addDoc(roomsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newRoom: Room = {
      id: docRef.id,
      ...data,
    };

    if (performingUser) {
      await auditService.logAction({
        action: 'SETTINGS_UPDATE', // We can use SETTINGS_UPDATE for room modifications
        targetId: docRef.id,
        targetType: 'room',
        details: { name: data.name, building: data.building },
        performedBy: performingUser
      });
    }

    return newRoom;
  },

  async updateRoom(roomId: string, data: Partial<Room>, performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Update in mockData
      const index = mockData.rooms.findIndex(r => r.id === roomId);
      if (index !== -1) {
        mockData.rooms[index] = {
          ...mockData.rooms[index],
          ...data,
        } as any;
      }
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    // Filter out undefined values
    const updateData = { 
      ...data,
      updatedAt: serverTimestamp(),
    };
    Object.keys(updateData).forEach(
      (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );
    await updateDoc(roomRef, updateData);

    if (performingUser) {
      await auditService.logAction({
        action: 'SETTINGS_UPDATE',
        targetId: roomId,
        targetType: 'room',
        details: { name: data.name, building: data.building },
        performedBy: performingUser
      });
    }
  },

  async deleteRoom(roomId: string, performingUser?: User): Promise<void> {
    const db = getDb();
    if (!db) {
      // Sandbox/Demo Mode: Delete from mockData
      const index = mockData.rooms.findIndex(r => r.id === roomId);
      if (index !== -1) {
        mockData.rooms.splice(index, 1);
      }
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    await deleteDoc(roomRef);

    if (performingUser) {
      await auditService.logAction({
        action: 'SETTINGS_UPDATE',
        targetId: roomId,
        targetType: 'room',
        details: { action: 'delete' },
        performedBy: performingUser
      });
    }
  }
};
