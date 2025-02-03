import type { SxProps, Theme } from '@mui/material'
import { TextField } from '@mui/material'

interface CustomInputFieldProps {
  label: string
  type: 'date' | 'time' | 'text'
  value: string
  onChange: (value: string) => void
  required?: boolean
  sx?: SxProps<Theme>
}

const CustomInputField = ({
  label,
  type,
  value,
  onChange,
  required = false,
  sx,
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
    sx={sx}
  />
)

export default CustomInputField
