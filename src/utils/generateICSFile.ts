const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date
    .toISOString()
    .replace(/[:-]/g, '')
    .replace(/\.\d{3}/, '')
}

const downloadICSFile = (fileName: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = globalThis.URL.createObjectURL(blob)
  link.setAttribute('download', fileName)
  document.body.append(link)
  link.click()
  link.remove()
  globalThis.URL.revokeObjectURL(link.href) // Clean up
}

const createICSContent = (task: Task): string => {
  const endTime = new Date(new Date(task.date).getTime() + 60 * 60 * 1000)
  return [
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(task.date)}`,
    `DTEND:${formatDate(endTime.toISOString())}`,
    `SUMMARY:${task.title}`,
    `UID:${task.taskId}-${formatDate(task.date)}`,
    'END:VEVENT',
  ].join('\r\n')
}

const createCombinedICSContent = (tasks: Task[]): string => {
  const taskContents = tasks
    .map(task => createICSContent(task))
    .join('\r\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Planify//Combined Tasks//EN',
    taskContents,
    'END:VCALENDAR',
  ].join('\r\n')
}

const generateICSFile = (task: Task): void => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Planify AI//Clendar//EN',
    createICSContent(task),
    'END:VCALENDAR',
  ].join('\r\n')
  downloadICSFile(`planify-${task.taskId}.ics`, icsContent)
}

const generateCombinedICSFile = (tasks: Task[]): void => {
  const icsContent = createCombinedICSContent(tasks)
  downloadICSFile('planify-tasks.ics', icsContent)
}

export { generateCombinedICSFile, generateICSFile }
