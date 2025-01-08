import type { NavigateFunction } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

import { auth } from './firebaseConfig'
import getUserProfile from './userProfile'

const loginUser = async (
  navigate: NavigateFunction,
): Promise<UserProfile | undefined> => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    const userProfile = await getUserProfile(result.user, navigate)
    return userProfile
  }
  catch (error) {
    console.error('Error during login:', error)
    return undefined
  }
}

const logoutUser = async (navigate: NavigateFunction): Promise<void> => {
  try {
    await signOut(auth)
    await navigate('/')
  }
  catch (error) {
    console.error('Error during sign-out:', error)
  }
}

export { loginUser, logoutUser }
