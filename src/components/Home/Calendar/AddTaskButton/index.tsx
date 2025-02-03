import type { Dayjs } from 'dayjs'
import { SmallLoadingCircle } from '@/components/common'
import { CustomInputField, CustomSelectField } from '@/components/common/UI'
import { useTaskReducer } from '@/hooks/useTaskReducer'
import { useTimeManagement } from '@/hooks/useTimeManagement'
import { useScheduleStore } from '@/stores'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material'
import { generateUniqueId, useToggle } from '@zl-asica/react'
import { useCallback } from 'react'
import RecurringTaskOptions from './RecurringTaskOptions'

interface AddTaskButtonProps {
  selectedDate: Dayjs | null
}

const AddTaskButton = ({ selectedDate }: AddTaskButtonProps) => {
  const addTask = useScheduleStore(state => state.addTask)
  const [open, toggleOpen] = useToggle()

  const { state, dispatch, initialDate } = useTaskReducer({ selectedDate })
  const { handleStartTimeChange, getEndTimeColor } = useTimeManagement(state, dispatch)

  const handleAddTask = useCallback(async () => {
    dispatch({
      type: 'SET_FIELD',
      field: 'taskId',
      value: await generateUniqueId([
        state.title,
        state.description,
        state.category,
        state.priority,
      ]),
    })

    const newTask: Task = {
      ...state,
      timeRange: state.timeRange
        && state.timeRange.start && state.timeRange.end && state.timeRange.start !== '' && state.timeRange.end !== ''
        ? state.timeRange
        : undefined,
      recurrencePattern: state.isRecurring
        ? {
            type: state.recurrencePattern?.type || 'daily',
            interval: state.recurrencePattern?.interval ?? 1,
            endDate: state.recurrencePattern?.endDate,
          }
        : null,
    }

    try {
      await addTask(newTask)
      toggleOpen()
      dispatch({ type: 'RESET', selectedDate: initialDate })
    }
    catch (error) {
      console.error('Error adding task:', error)
    }
  }, [state, addTask, toggleOpen, initialDate, dispatch])

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
      <Dialog open={open} onClose={toggleOpen} fullWidth maxWidth="sm">
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <CustomInputField
            label="Date"
            type="date"
            value={state.date}
            onChange={val => dispatch({
              type: 'SET_FIELD',
              field: 'date',
              value: val,
            })}
            required
          />

          <CustomInputField
            label="Start Time"
            type="time"
            value={state.timeRange?.start ?? ''}
            onChange={handleStartTimeChange}
          />

          <CustomInputField
            label="End Time"
            type="time"
            value={state.timeRange?.end ?? ''}
            onChange={val => dispatch({
              type: 'SET_FIELD',
              field: 'timeRange',
              value: { ...state.timeRange, end: val },
            })}
            sx={{ color: getEndTimeColor }}
          />

          <CustomInputField
            label="Title"
            type="text"
            value={state.title}
            onChange={val => dispatch({
              type: 'SET_FIELD',
              field: 'title',
              value: val,
            })}
            required
          />
          <CustomInputField
            label="Description"
            type="text"
            value={state.description}
            onChange={val => dispatch({
              type: 'SET_FIELD',
              field: 'description',
              value: val,
            })}
          />

          <CustomSelectField
            label="Category"
            value={state.category}
            onChange={val => dispatch({
              type: 'SET_FIELD',
              field: 'category',
              value: val,
            })}
            options={['work', 'personal', 'health', 'learning', 'other', 'school']}
          />

          <CustomSelectField
            label="Priority"
            value={state.priority}
            onChange={val => dispatch({
              type: 'SET_FIELD',
              field: 'priority',
              value: val,
            })}
            options={['low', 'medium', 'high']}
          />

          <FormControlLabel
            control={(
              <Switch
                checked={state.isRecurring}
                onChange={e => dispatch({
                  type: 'SET_FIELD',
                  field: 'isRecurring',
                  value: e.target.checked,
                })}
              />
            )}
            label="Recurring Task"
            sx={{ mt: 2, mb: 1 }}
          />

          {state.isRecurring
          && <RecurringTaskOptions state={state} dispatch={dispatch} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpen}>Cancel</Button>
          <Button onClick={handleAddTask}>
            {state.taskId
              ? <SmallLoadingCircle text="Adding..." />
              : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTaskButton
