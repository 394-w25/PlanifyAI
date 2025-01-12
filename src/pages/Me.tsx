import { ActionButtons, MainInfo } from '@/components/Me'

import { useUserStore } from '@/stores'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { toast } from 'sonner'

const Me = () => {
  const userData = useUserStore(state => state.user)
  const updateProfile = useUserStore(state => state.updateProfile)

  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(userData?.name ?? '')
  const [email, setEmail] = useState(userData?.email ?? '')

  const handleSave = async () => {
    if (name !== userData?.name || email !== userData?.email) {
      setLoading(true)
      try {
        await updateProfile({ name, email })
        toast.success('Profile updated')
      }
      catch (error_) {
        toast.error('Failed to update profile')
        console.error('Failed to update profile: ', error_)
      }
      finally {
        setLoading(false)
      }
    }
    else {
      toast.info('No changes to save')
    }
    setEditing(false)
  }

  return (
    <Box
      maxWidth={600}
      mx="auto"
      px={3}
      py={5}
      sx={{
        margin: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: theme => theme.shadows[3],
      }}
    >
      <MainInfo
        editing={editing}
        displayName={name}
        email={email}
        userData={userData ?? null}
        onChangeDisplayName={name => setName(name)}
        onChangeEmail={setEmail}
      />

      <ActionButtons
        editing={editing}
        onSave={handleSave}
        loading={loading}
        onCancel={() => setEditing(false)}
        onEdit={() => setEditing(true)}
      />

    </Box>
  )
}

export default Me
