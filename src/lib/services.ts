import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { SEED_PROPERTIES } from '../constants';

const HIDDEN_PUBLIC_PROPERTY_SLUGS = new Set([
  'sovereign-manor',
  'vista-marina',
]);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function sortProperties(properties: any[]) {
  return [...properties].sort((a: any, b: any) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;

    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;
    return dateB - dateA;
  });
}

function normalizePropertySnapshot(snapshot: any) {
  return sortProperties(
    snapshot.docs.map((documentSnapshot: any) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data(),
    }))
  );
}

function filterHiddenPublicProperties(properties: any[]) {
  return properties.filter((property: any) => !HIDDEN_PUBLIC_PROPERTY_SLUGS.has(property.slug));
}

function getSeedProperties() {
  return sortProperties(
    SEED_PROPERTIES
      .filter((property: any) => property.isPublished === true)
      .map((property: any, index: number) => ({
        id: property.slug || `seed-${index}`,
        ...property,
      }))
  );
}

function getPropertyMergeKey(property: any, index: number) {
  return property.slug || property.id || `${property.title || 'property'}-${index}`;
}

function mergePublicProperties(liveProperties: any[]) {
  const merged = new Map<string, any>();
  const seedProperties = filterHiddenPublicProperties(getSeedProperties());
  const visibleLiveProperties = filterHiddenPublicProperties(liveProperties);

  seedProperties.forEach((property, index) => {
    merged.set(getPropertyMergeKey(property, index), property);
  });

  visibleLiveProperties.forEach((property, index) => {
    merged.set(getPropertyMergeKey(property, index), property);
  });

  return sortProperties(Array.from(merged.values()));
}

export const listenToLatestProperties = (callback: (properties: any[]) => void, limitCount = 3) => {
  const path = 'properties';
  const q = query(collection(db, path), where('isPublished', '==', true));
  const fallbackProperties = filterHiddenPublicProperties(getSeedProperties()).slice(0, limitCount);

  callback(fallbackProperties);

  return onSnapshot(
    q,
    (snapshot) => {
      const liveProperties = normalizePropertySnapshot(snapshot);
      callback(mergePublicProperties(liveProperties).slice(0, limitCount));
    },
    (error) => {
      console.error('Public latest properties listener failed:', error);
      callback(fallbackProperties);
    }
  );
};

export const listenToAllProperties = (callback: (properties: any[]) => void) => {
  const path = 'properties';
  const q = query(collection(db, path), where('isPublished', '==', true));
  const fallbackProperties = filterHiddenPublicProperties(getSeedProperties());

  callback(fallbackProperties);

  return onSnapshot(
    q,
    (snapshot) => {
      const liveProperties = normalizePropertySnapshot(snapshot);
      callback(mergePublicProperties(liveProperties));
    },
    (error) => {
      console.error('Public listings listener failed:', error);
      callback(fallbackProperties);
    }
  );
};

export const seedAllProperties = async (seedData: any[]) => {
  const path = 'properties';

  try {
    const snapshot = await getDocs(collection(db, path));
    const existingBySlug = new Map(
      snapshot.docs
        .map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }))
        .filter((property: any) => Boolean(property.slug))
        .map((property: any) => [property.slug, property])
    );

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const property of seedData) {
      if (!property.slug) {
        skipped++;
        continue;
      }

      const existingProperty = existingBySlug.get(property.slug);

      if (existingProperty) {
        const updatePayload: Record<string, any> = {
          ...property,
          updatedAt: serverTimestamp(),
        };

        if (!existingProperty.createdAt) {
          updatePayload.createdAt = serverTimestamp();
        }

        await updateDoc(doc(db, path, existingProperty.id), updatePayload);
        updated++;
        continue;
      }

      await addDoc(collection(db, path), {
        ...property,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || 'system',
      });
      added++;
    }

    return { added, updated, skipped, success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { added: 0, updated: 0, skipped: 0, success: false };
  }
};

export const listenToConsultationRequests = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'consultationRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() })));
    },
    (err) => console.error('Consultation listener error:', err)
  );
};

export const listenToPropertyRequests = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'propertyRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() })));
    },
    (err) => console.error('Property requests listener error:', err)
  );
};

export const listenToContactMessages = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() })));
    },
    (err) => console.error('Contact messages listener error:', err)
  );
};

export const updateSubmissionStatus = async (collectionName: string, id: string, status: string) => {
  try {
    await updateDoc(doc(db, collectionName, id), { status, updatedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, collectionName);
  }
};

export const deleteSubmission = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, collectionName);
  }
};

export const submitConsultationRequest = async (data: any) => {
  const path = 'consultationRequests';

  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    await triggerPrivyrWebhook({
      ...data,
      source: 'Consultation Request',
    });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const submitPropertyRequest = async (data: any) => {
  const path = 'propertyRequests';

  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
    });

    await triggerPrivyrWebhook({
      ...data,
      source: 'Property Request',
    });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

const triggerPrivyrWebhook = async (data: any) => {
  const webhookUrl = import.meta.env.VITE_PRIVYR_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.fullName || data.name,
        email: data.email,
        phone: data.phone,
        notes: data.message || data.additionalNotes || data.interest,
        custom_fields: {
          interest: data.interest || 'Not Specified',
          source: data.source || 'Website',
        },
      }),
    });
  } catch (error) {
    console.error('Webhook Error:', error);
  }
};
