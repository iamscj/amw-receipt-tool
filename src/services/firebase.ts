// Firebase Firestore service for receipt management
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ReceiptDataForFirebase {
  date: string;
  ownerName: string;
  wing: string;
  flat: string;
  amount: string;
  amountInWords: string;
  mode: string;
  purpose: string;
}

export interface ReceiptDocument extends ReceiptDataForFirebase {
  id?: string; // Firestore document ID
  receiptNo: number;
  createdAt: Timestamp;
}

/**
 * Get the next receipt number (atomically incremented)
 */
export async function getNextReceiptNumber(): Promise<number> {
  const counterRef = doc(db, 'counters', 'receiptCounter');

  try {
    const counterDoc = await getDoc(counterRef);

    if (!counterDoc.exists()) {
      // Initialize counter if it doesn't exist
      await setDoc(counterRef, { value: 1 });
      return 1;
    }

    return counterDoc.data().value as number;
  } catch (error) {
    console.error('Error fetching receipt number:', error);
    throw new Error('Failed to fetch receipt number');
  }
}

/**
 * Save receipt to Firestore and increment counter atomically
 */
export async function saveReceiptToFirebase(
  data: ReceiptDataForFirebase
): Promise<number> {
  try {
    // Use transaction to ensure atomic increment and save
    const receiptNo = await runTransaction(db, async (transaction) => {
      const counterRef = doc(db, 'counters', 'receiptCounter');
      const counterDoc = await transaction.get(counterRef);

      let nextReceiptNo: number;

      if (!counterDoc.exists()) {
        // Initialize counter if it doesn't exist
        nextReceiptNo = 1;
        transaction.set(counterRef, { value: 2 });
      } else {
        nextReceiptNo = counterDoc.data().value as number;
        transaction.update(counterRef, { value: nextReceiptNo + 1 });
      }

      // Save receipt document
      const receiptRef = doc(db, 'receipts', `receipt_${nextReceiptNo}`);
      const receiptData: ReceiptDocument = {
        receiptNo: nextReceiptNo,
        ...data,
        createdAt: serverTimestamp() as Timestamp,
      };

      transaction.set(receiptRef, receiptData);

      return nextReceiptNo;
    });

    return receiptNo;
  } catch (error) {
    console.error('Error saving receipt to Firebase:', error);
    throw new Error('Failed to save receipt to Firebase');
  }
}

/**
 * Get all receipts from Firestore
 */
export async function getAllReceipts(): Promise<ReceiptDocument[]> {
  try {
    const receiptsRef = collection(db, 'receipts');
    const q = query(receiptsRef, orderBy('receiptNo', 'asc')); // ascending: small to large
    const querySnapshot = await getDocs(q);

    const receipts: ReceiptDocument[] = [];
    querySnapshot.forEach((doc) => {
      receipts.push({ ...doc.data(), id: doc.id } as ReceiptDocument);
    });

    return receipts;
  } catch (error) {
    console.error('Error fetching all receipts:', error);
    throw new Error('Failed to fetch receipts from Firebase');
  }
}

/**
 * Update a receipt in Firestore
 */
export async function updateReceipt(receiptId: string, data: Partial<ReceiptDataForFirebase>): Promise<void> {
  try {
    const receiptRef = doc(db, 'receipts', receiptId);
    await updateDoc(receiptRef, data as any);
  } catch (error) {
    console.error('Error updating receipt:', error);
    throw new Error('Failed to update receipt');
  }
}

/**
 * Delete a receipt from Firestore
 */
export async function deleteReceipt(receiptId: string): Promise<void> {
  try {
    const receiptRef = doc(db, 'receipts', receiptId);
    await deleteDoc(receiptRef);
  } catch (error) {
    console.error('Error deleting receipt:', error);
    throw new Error('Failed to delete receipt');
  }
}
