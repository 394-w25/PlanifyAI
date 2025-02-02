import type { DocumentData, WithFieldValue } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from './firebaseConfig'

/**
 * Get a document from Firestore or create it if it doesn't exist.
 *
 * @param uid The unique identifier for the document.
 * @param collection The collection to get or create the document in.
 * @param defaultData The default data to create the document with if it doesn't exist.
 * @returns The existing or newly created document data.
 */
const getOrCreateDocument = async <T extends WithFieldValue<DocumentData>>(
  uid: string,
  collection: string,
  defaultData: T,
): Promise<T | undefined> => {
  try {
    const docRef = doc(db, collection, uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as T // Return existing document data
    }

    await setDoc(docRef, defaultData)
    return defaultData // Return the newly created document data
  }
  catch (error) {
    console.error(`Error in getOrCreateDocument for ${uid}:`, error)
    return undefined // Return undefined on failure
  }
}

/**
 * Update a document in Firestore.
 *
 * @param uid The unique identifier for the document.
 * @param collection The collection to update the document in.
 * @param updates The data to update in the document.
 * @returns A promise that resolves when the update is complete.
 */
const updateDocument = async <T>(
  uid: string,
  collection: string,
  updates: Partial<T>,
): Promise<void> => {
  try {
    const docRef = doc(db, collection, uid)
    await setDoc(docRef, updates, { merge: true }) // Merge updates with existing data
  }
  catch (error) {
    console.error(`Error updating document in ${uid}:`, error)
    throw error // Rethrow error to be handled by caller
  }
}

export { getOrCreateDocument, updateDocument }
