import { SmallLoadingCircle } from '@/components/common'
import { useScheduleStore } from '@/stores'
import { Button, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import { useCallback, useEffect, useState } from 'react'
import CustomInputField from './CustomInputField'

interface UpdataTaskButtonProps {
  task: Task | null
  open: boolean
  handleClose: () => void
}

const UpdateTaskButton = ({ task, open, handleClose }: UpdataTaskButtonProps) => {
  const updateTask = useScheduleStore(state => state.updateTask)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('work')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  const setCurrentStates = useCallback(() => {
    if (!open) {
      return
    }
    const { timeRange } = task || {}
    setTitle(task!.title)
    setDescription(task!.description)
    setCategory(task!.category)
    setPriority(task!.priority)
    setDate(task!.date)
    setStartTime(timeRange!.start)
    setEndTime(timeRange!.end)
  }, [task, open])

  useEffect(() => {
    setCurrentStates()
  }, [setCurrentStates, task])

  const isTimeRangeValid = !startTime || !endTime || startTime < endTime

  const handleUpdateTask = useCallback(async () => {
    setLoading(true)
    const newTask = {
      taskId: task!.taskId,
      title,
      description,
      category,
      priority,
      date,
      timeRange: startTime && endTime ? { start: startTime, end: endTime } : undefined,
      status: 'pending' as const,
    }

    try {
      await updateTask(newTask)
    }
    catch (error_) {
      console.error('Error while update task:', error_)
    }
    finally {
      handleClose()
      setLoading(false)
    }
  }, [task, title, description, category, priority, date, startTime, endTime, updateTask, handleClose])

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose()
        }}
      >
        <DialogTitle>Update Task</DialogTitle>
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
              handleClose()
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTask}
            disabled={!title.trim() || !date || !category || !priority || !isTimeRangeValid || loading}
          >
            {loading ? <SmallLoadingCircle text="Adding..." /> : 'Update Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UpdateTaskButton
