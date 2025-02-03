import { CustomInputField, CustomSelectField } from '@/components/common/UI'

interface RecurringTaskOptionsProps {
  state: Task
  dispatch: React.Dispatch<TaskAction>
}

const RecurringTaskOptions = ({ state, dispatch }: RecurringTaskOptionsProps) => {
  const handleRecurrenceChange = (field: keyof RecurrencePattern, value: string | number) => {
    dispatch({
      type: 'SET_FIELD',
      field: 'recurrencePattern',
      value: {
        ...state.recurrencePattern,
        [field]: value as RecurrencePattern[keyof RecurrencePattern],
      },
    })
  }

  return (
    <>
      <CustomSelectField
        label="Repeat"
        value={state.recurrencePattern?.type || 'daily'}
        onChange={val => handleRecurrenceChange('type', val)}
        options={['daily', 'weekly', 'monthly']}
      />

      <CustomSelectField
        label="Repeat On"
        value={state.recurrencePattern?.interval ?? '1'}
        onChange={val => handleRecurrenceChange('interval', val)}
        options={[1, 2, 3, 4, 5, 6, 7]}
      />

      <CustomInputField
        label="End Date (Optional)"
        type="date"
        value={state.recurrencePattern?.endDate ?? ''}
        onChange={val => handleRecurrenceChange('endDate', val)}
      />
    </>
  )
}

export default RecurringTaskOptions
