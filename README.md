# Planify AI - Yellow Team

> COMP_SCI 394 - Winter 2025 - Northwestern University

## Table of Contents

- [Planify AI - Yellow Team](#planify-ai---yellow-team)
  - [Table of Contents](#table-of-contents)
  - [1. File Structure and Logic](#1-file-structure-and-logic)
  - [2. Keeping Your Work Up-to-Date with `origin/main`](#2-keeping-your-work-up-to-date-with-originmain)
    - [Step 1: Create a New Feature Branch](#step-1-create-a-new-feature-branch)
    - [Step 2: Update Your Local `main` with `origin/main`](#step-2-update-your-local-main-with-originmain)
    - [Step 3: Rebase Your Feature Branch onto the Updated `main`](#step-3-rebase-your-feature-branch-onto-the-updated-main)
  - [3. TypeScript](#3-typescript)
    - [1. Global Types in `types.d.ts`](#1-global-types-in-typesdts)
    - [2. Local Types Definition](#2-local-types-definition)
    - [3. Interfaces and props](#3-interfaces-and-props)
    - [4. `import type` Instead of `import`](#4-import-type-instead-of-import)
  - [4. Zustand](#4-zustand)
    - [1. What is Zustand?](#1-what-is-zustand)
    - [2. How to Use Zustand](#2-how-to-use-zustand)
      - [Accessing Global State](#accessing-global-state)
      - [Updating State](#updating-state)

## 1. File Structure and Logic

This project uses a component-based structure with a focus on clear separation of concerns. Key files and folders:

```plaintext
.
├── LICENSE
├── README.md                  # Project documentation and usage guide
├── vite.config.ts             # Vite configuration file
├── tsconfig.json              # Typescript config file
├── firebase.json              # Firebase configuration for hosting
├── package.json               # Dependencies
└── src                        # Source code
    ├── components             # Shared components and features
    │   ├── common             # Common components used across the app
    │   ├── Home               # Home page components
    │   ├── Me                 # Me page components
    │   └── ...                # Other pages' components
    ├── stores                 # Zustand related global state management
    ├── hooks                  # Custom hooks for specialized logic
    ├── pages                  # Application pages
    ├── utils                  # Utility functions and Firebase configurations
    └── types                  # Global types define here (such as schemas).
```

The main components and utilities are organized under `src/components` and `src/utils`.

## 2. Keeping Your Work Up-to-Date with `origin/main`

### Step 1: Create a New Feature Branch

- **Why**: Avoid developing directly on `main`. Keeping `main` in sync with `origin/main` makes it easier to update and manage changes.
- **How**: Create and switch to a new branch for your feature, and remember to push it to `origin`:

  ```bash
  git switch -c feat/new-feature-name
  git push -u origin feat/new-feature-name
  ```

### Step 2: Update Your Local `main` with `origin/main`

1. **Switch Back to `main`**: Ensure you're on `main` before updating:

   ```bash
   git switch main
   ```

2. **Stash Your Work**(if needed): If you have uncommitted changes, stash them to avoid conflicts while pulling:

   ```bash
   git stash
   ```

3. **Pull Latest Changes**: Bring in the latest updates from `origin/main`:

   ```bash
   git pull origin main
   ```

### Step 3: Rebase Your Feature Branch onto the Updated `main`

1. **Switch Back to Your Feature Branch**:

   ```bash
   git switch feat/new-feature-name
   ```

2. **Rebase**: Apply your feature branch changes on top of the latest `main`:

   ```bash
   git rebase main
   ```

3. **Apply Stash**(if you stashed changes): Reapply your saved changes once main is updated:

   ```bash
   git stash pop
   ```

4. **Resolve Conflicts** (if any): If conflicts occur, Git will prompt you to resolve them. After resolving, use:

   ```bash
   git add <conflicted-files>
   git rebase --continue
   ```

5. **Push Changes**:

   - **If you have NOT previously pushed code to the remote**:

     ```bash
     git push
     ```

   - **If you HAVE previously pushed code** (with conflicting changes), you may need to force-push to align with the rebased history. **(Do NOT use this on `main`)**

     ```bash
     git push --force-with-lease
     ```

By following these steps, you ensure that `main` remains in sync with `origin/main`, while your feature branch incorporates the latest updates without directly modifying `main`. This keeps your work organized and minimizes conflict risks.

## 3. TypeScript

In this project, TypeScript types and interfaces are used to ensure clarity and catch errors early in the development process. Defining types helps TypeScript provide hints and checks, reducing potential bugs by catching type mismatches before runtime.

### 1. Global Types in `types.d.ts`

For types shared across multiple components or features, define them globally in `types.d.ts`. This allows all components to access these types without needing to import them explicitly, keeping the code DRY.

**Example**:

```typescript
// types.d.ts

interface UserContext = {
  user: User | null;
  loading: boolean;
};

type User {
  uid: string;
  username: string;
  email: string;
  avatar: string;
}
```

With these types defined in `types.d.ts`, all components can directly use `UserContext` and `User` without importing them, ensuring consistency across the project.

### 2. Local Types Definition

For types only relevant to a specific component or file, define them locally within that file to avoid cluttering global types.

**Example**:

```typescript
// src/components/Profile.tsx

type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
};

// Since the `User` type is defined in the global scope, no need to import here.
const Profile = ({ user }: { user: User }) => {
  const stats: ProfileStats = { posts: 50, followers: 100, following: 20 };
  return (
    <div>
      <h1>{user.username}</h1>
      <p>Posts: {stats.posts}</p>
      <p>Followers: {stats.followers}</p>
      <p>Following: {stats.following}</p>
    </div>
  );
};
```

Here, `ProfileStats` is defined locally within `Profile.tsx` because it’s specific to this component.

### 3. Interfaces and props

Interfaces are primarily used for objects that might be extended or combined with other types in the future. They are especially useful for defining the structure of `props` passed into components. This helps TypeScript enforce the correct structure and prevent errors when using the component.

**Example**:

```typescript
// types.d.ts

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface ProfileProps {
  profile: UserProfile;
  onFollow: (userId: string) => void;
}
```

In this example, `UserProfile` defines the structure for a user's profile, and `ProfileProps` specifies the `props` expected by the `Profile` component, including the profile data and a follow function.

**Usage in a Component**:

```typescript
// src/components/Profile.tsx

const Profile = ({ profile, onFollow }: ProfileProps) => {
  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.bio}</p>
      {profile.avatarUrl && <img src={profile.avatarUrl} alt={`${profile.username}'s avatar`} />}
      <button onClick={() => onFollow(profile.id)}>Follow</button>
    </div>
  );
};
```

Here, `Profile` receives `profile` and `onFollow` as `props`. TypeScript ensures that `profile` matches the `UserProfile` structure and `onFollow` is a function that takes a `userId` string as an argument. This makes the component’s expectations clear and prevents type-related bugs during development.

### 4. `import type` Instead of `import`

Using `import type` for importing types makes it clear that the import is used only for TypeScript type checking and won’t be included in the compiled JavaScript code. This can improve bundling and reduce unnecessary imports.

**Example**:

```typescript
// src/hooks/useUser.ts

import type { UserContextType } from "@/types";

const useUser = () => {
  // usage of UserContextType in the hook
};
```

Here, `import type { UserContextType }` indicates that `UserContextType` is used only for type checking, not at runtime. This avoids additional runtime imports and helps with bundling efficiency.

## 4. Zustand

### 1. What is Zustand?

`Zustand` is a lightweight state management library for React that uses a centralized store to manage global state. Unlike `Context`, which triggers a re-render of all components that consume it whenever the state changes, `zustand` only updates the components that subscribe to the specific state slice. This makes it more efficient and scalable for managing complex or frequently changing global states, such as user authentication data.

### 2. How to Use Zustand

#### Accessing Global State

1. **Enable Zustand Store**: Zustand stores are imported and initialized once for the entire application. For example, the `user` store:

   ```tsx
   import { useUserStore } from "@/stores";

   const App = () => {
     const initializeAuthListener = useUserStore(
       (state) => state.initializeAuthListener,
     );

     useEffect(() => {
       const unsubscribe = initializeAuthListener();
       return () => unsubscribe(); // Cleanup listener on unmount
     }, [initializeAuthListener]);

     return <>{/* App Components */}</>;
   };
   ```

2. **Access State in Components**: Use zustand hooks to fetch only the state you need. This ensures efficient re-rendering.

   ```tsx
   import { useUserStore } from "@/stores";

   const MyComponent = () => {
     const user = useUserStore((state) => state.user);
     const loading = useUserStore((state) => state.loading);

     return user ? (
       <div>
         <h1>
           Welcome,
           {user.displayName}
         </h1>
         <button onClick={() => useUserStore.getState().logout()}>
           Sign Out
         </button>
       </div>
     ) : loading ? (
       <p>Loading...</p>
     ) : (
       <button
         onClick={() =>
           useUserStore
             .getState()
             .login("donor", () => console.log("Logged in"))
         }
       >
         Sign In
       </button>
     );
   };
   ```

---

#### Updating State

To update the user's profile or other states, zustand provides centralized actions that automatically update Firebase and sync the changes with the store:

```tsx
import useUserStore from "@/stores/useUserStore";

const MyComponent = () => {
  const updateProfile = useUserStore((state) => state.updateProfile);

  const handleUpdate = () => {
    updateProfile({ displayName: "New Name" }); // Updates profile in Firebase and zustand
  };

  return <button onClick={handleUpdate}>Update Profile</button>;
};
```
