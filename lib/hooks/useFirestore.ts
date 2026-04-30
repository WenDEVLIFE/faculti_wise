'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, Schedule, Course, Room } from '@/lib/types/firestore.types';

export function useFirestoreCollection<T>(
  collectionName: string,
  queryConstraints?: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const collectionRef = collection(db, collectionName);
      const q = queryConstraints && queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;
      
      const snapshot = await getDocs(q);
      const documents: T[] = [];
      
      snapshot.forEach(doc => {
        documents.push({
          ...(doc.data() as T),
          id: doc.id,
        });
      });
      
      setData(documents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName, queryConstraints]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useUsers() {
  return useFirestoreCollection<User>('users');
}

export function useSchedules() {
  return useFirestoreCollection<Schedule>('schedules');
}

export function useCourses() {
  return useFirestoreCollection<Course>('courses');
}

export function useRooms() {
  return useFirestoreCollection<Room>('rooms');
}
