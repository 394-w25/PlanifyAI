import type { Dayjs } from 'dayjs'
import { SmallLoadingCircle } from '@/components/common'
import { useScheduleStore } from '@/stores'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { generateUniqueId, useToggle } from '@zl-asica/react'
import { useCallback, useEffect, useState } from 'react'
import CustomInputField from './CustomInputField'

interface AddTaskButtonProps {
  selectedDate: Dayjs | null
}

const AddTaskButton = ({ selectedDate }: AddTaskButtonProps) => {
  const addTask = useScheduleStore(state => state.addTask)

  const [open, toggleOpen] = useToggle()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('work')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [date, setDate] = useState(
    selectedDate?.format('YYYY-MM-DD') ?? new Date().toISOString().split('T')[0],
  )
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDate(selectedDate?.format('YYYY-MM-DD') ?? new Date().toISOString().split('T')[0])
  }, [selectedDate])

  const isTimeRangeValid = !startTime || !endTime || startTime < endTime

  const resetStates = useCallback(() => {
    setTitle('')
    setDescription('')
    setCategory('work')
    setPriority('medium')
    setDate(selectedDate?.format('YYYY-MM-DD') ?? new Date().toISOString().split('T')[0])
    setStartTime('')
    setEndTime('')
  }, [selectedDate])

  const handleAddTask = useCallback(async () => {
    setLoading(true)
    const randomId = await generateUniqueId([title, description, category, priority])
    const newTask = {
      taskId: randomId,
      title,
      description,
      category,
      priority,
      date,
      timeRange: startTime && endTime ? { start: startTime, end: endTime } : undefined,
      status: 'pending' as const,
    }

    try {
      await addTask(newTask)
      toggleOpen()
      resetStates()
    }
    catch (error_) {
      console.error('Error while adding task:', error_)
    }
    finally {
      setLoading(false)
    }
  }, [title, description, category, priority, date, startTime, endTime, addTask, resetStates, toggleOpen])

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

      <Dialog
        open={open}
        onClose={() => {
          toggleOpen()
          resetStates()
        }}
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <CustomInputField label="Date" type="date" value={date} onChange={setDate} required />
          <CustomInputField label="Start Time" type="time" value={startTime} onChange={setStartTime} />
          <CustomInputField label="End Time" type="time" value={endTime} onChange={setEndTime} />
          <CustomInputField label="Title" type="text" value={title} onChange={setTitle} required />
          <CustomInputField label="Description" type="text" value={description} onChange={setDescription} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category *</InputLabel>
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
              <MenuItem value="holiday">Holiday</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority *</InputLabel>
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
          <Button
            onClick={() => {
              toggleOpen()
              resetStates()
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTask}
            disabled={!title.trim() || !date || !category || !priority || !isTimeRangeValid || loading}
          >
            {loading ? <SmallLoadingCircle text="Adding..." /> : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTaskButton
