import type { Dayjs } from 'dayjs'
import { SmallLoadingCircle } from '@/components/common'
import { CustomInputField, CustomSelectField } from '@/components/common/UI'
import { useTaskReducer } from '@/hooks/useTaskReducer'
import { useTimeManagement } from '@/hooks/useTimeManagement'
import { useScheduleStore } from '@/stores'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material'
import { generateUniqueId } from '@zl-asica/react'
import { useCallback, useState } from 'react'
import RecurringTaskOptions from './RecurringTaskOptions'

interface TaskInputDialogProps {
  selectedDate: Dayjs
  open: boolean
  toggleOpen: () => void
  action: 'Add' | 'Edit'
  currentTask?: Task | null
}

const TaskInputDialog = ({
  selectedDate,
  open,
  toggleOpen,
  action,
  currentTask,
}: TaskInputDialogProps) => {
  const { state, dispatch, initialDate } = useTaskReducer({ selectedDate, currentTask, open })
  const { handleStartTimeChange, getEndTimeColor } = useTimeManagement(state, dispatch)
  const [actionHappening, setActionHappening] = useState(false)

  const handleTaskSubmitted = useCallback(async () => {
    const taskId = await generateUniqueId([
      state.title,
      state.description,
      state.category,
      state.priority,
    ])
    dispatch({
      type: 'SET_FIELD',
      field: 'taskId',
      value: taskId,
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
      setActionHappening(true)
      if (action === 'Add') {
        const addTask = useScheduleStore.getState().addTask
        await addTask({ ...newTask, taskId })
      }
      else if (action === 'Edit') {
        const updateTask = useScheduleStore.getState().updateTask
        await updateTask(newTask)
      }
      else {
        throw new Error('Invalid action')
      }
      dispatch({ type: 'RESET', selectedDate: initialDate })
      toggleOpen()
    }
    catch (error) {
      console.error(`Error ${action}ing task:`, error)
    }
    finally {
      setActionHappening(false)
    }
  }, [state, action, toggleOpen, initialDate, dispatch])

  return (
    <Dialog open={open} onClose={toggleOpen} fullWidth maxWidth="sm">
      <DialogTitle>
        {action}
        {' '}
        Task
      </DialogTitle>
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
            value: { ...state.timeRange, end: val, start: state.timeRange?.start ?? '' },
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
        <Button onClick={handleTaskSubmitted}>
          {actionHappening
            ? <SmallLoadingCircle text={`${action}ing`} />
            : action === 'Add' ? 'Add Task' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskInputDialog
