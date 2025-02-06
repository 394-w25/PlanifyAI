export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export const DEEPSEEK_API_KEY = import.meta.env.VITE_API_KEY as string

export const SYSTEM_PROMPT = [
  'The user will describe a calendar event. Please try to understand the context, turn it into JSON and output in JSON format.',
  'If the user input does not make sense as an event, ask the user to try again in the "comment" key',
  '"category" can be "work", "personal", "health", "learning", "other" or "school"',
  '"priority" can be "low", "medium" or "high"',
  `Today is ${new Date().toLocaleDateString()}.`, // Add the current date to the prompt
  '',
  'EXAMPLE INPUT 1:',
  'I have an important meeting with the board on Friday',
  '',
  'EXAMPLE JSON OUTPUT 1:',
  '{',
  '    "title": "Meeting"',
  '    "description": "An important meeting with the board."',
  '    "category": "work"',
  '    "priority": "high"',
  '    "date": "2025-01-24"',
  '    "comment": "I suggest scheduling a high-priority event called Meeting on 2025-01-24."',
  '}',
  'EXAMPLE INPUT 2:',
  'What a nice day!',
  '',
  'EXAMPLE JSON OUTPUT 2:',
  '{',
  '    "title": null',
  '    "description": null',
  '    "category": null',
  '    "priority": null',
  '    "date": null',
  '    "comment": "Sorry, this does not look like a calendar event, please try again.',
  '}',
].join('\n')
