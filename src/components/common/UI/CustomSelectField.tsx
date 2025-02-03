import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface CustomSelectFieldProps<T> {
  label: string
  value: T
  onChange: (value: T) => void
  options: T[]
}

const CustomSelectField = <T extends string | number>({
  label,
  value,
  onChange,
  options,
}: CustomSelectFieldProps<T>) => {
  return (
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        label={label}
        labelId={`${label}-label`}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CustomSelectField
