import { TextField } from '@mui/material'

interface CustomInputFieldProps {
  label: string
  type: 'date' | 'time' | 'text'
  value: string
  onChange: (value: string) => void
  required?: boolean
}

const CustomInputField = ({
  label,
  type,
  value,
  onChange,
  required = false,
}: CustomInputFieldProps) => (
  <TextField
    label={label}
    type={type}
    value={value}
    onChange={event_ => onChange(event_.target.value)}
    required={required}
    fullWidth
    margin="normal"
    slotProps={{
      inputLabel: { shrink: true },
    }}
  />
)

export default CustomInputField
