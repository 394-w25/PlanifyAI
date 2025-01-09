import type { Dayjs } from 'dayjs'
import { useScheduleStore } from '@/stores'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { generateUniqueId, useToggle } from '@zl-asica/react'
import { useState } from 'react'

interface AddTaskButtonProps {
  selectedDate: Dayjs | null
}

const AddTaskButton = ({ selectedDate }: AddTaskButtonProps) => {
  const addTask = useScheduleStore(state => state.addTask)

  const [open, toggleOpen] = useToggle()
  const date = selectedDate?.format('YYYY-MM-DD') ?? ''
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('work')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="contained"
        sx={{
          p: '0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          mb: '1rem',
        }}
      >
        Add Task
      </Button>

      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            value={date}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Title"
            value={title}
            onChange={event_ => setTitle(event_.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={event_ => setDescription(event_.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={event_ => setCategory(event_.target.value as TaskCategory)}
            >
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="learning">Learning</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="school">School</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={event_ => setPriority(event_.target.value as TaskPriority)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpen}>Cancel</Button>
          <Button
            onClick={async () => {
              const randomId = await generateUniqueId([title, description, category, priority])
              const newTask = {
                taskId: randomId,
                title,
                description,
                category,
                priority,
                date,
                status: 'pending' as const,
              }

              await addTask(newTask)
              toggleOpen()
            }}
            disabled={!title.trim() || !date || !category || !priority}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTaskButton
