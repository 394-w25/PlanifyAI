import type { User } from 'firebase/auth'
import type { NavigateFunction } from 'react-router-dom'

import { getOrCreateDocument } from './firebaseUtils'

const getUserProfile = async (
  user: User,
  navigate: NavigateFunction,
): Promise<UserProfile | undefined> => {
  const { uid, email, photoURL, displayName } = user

  const defaultProfile = {
    uid,
    email: email as string,
    profilePic: photoURL ?? '',
    name: displayName ?? 'Unnamed User',
    createdAt: new Date().toISOString(),
    role: 'user' as UserType,
  } as UserProfile

  const userProfile = await getOrCreateDocument(uid, 'users', defaultProfile)

  await navigate('/')

  return userProfile
}

export default getUserProfile
