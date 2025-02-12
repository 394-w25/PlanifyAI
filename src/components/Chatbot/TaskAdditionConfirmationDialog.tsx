import { ConfirmationDialog } from '@/components/common'

interface TaskAdditionConfirmationDialogProps {
  confirmationOpen: boolean
  setConfirmationOpen: (open: boolean) => void
  pendingTask: Task | null
  confirmAddTask: () => void
}

const TaskAdditionConfirmationDialog = ({
  confirmationOpen,
  setConfirmationOpen,
  pendingTask,
  confirmAddTask,
}: TaskAdditionConfirmationDialogProps) => {
  return (
    <ConfirmationDialog
      open={confirmationOpen}
      onClose={() => setConfirmationOpen(false)}
      onConfirm={confirmAddTask}
      title="Confirm Task Addition"
      description={(
        <>
          Do you want to add the task
          {' '}
          <strong>{pendingTask?.title}</strong>
          {' '}
          ?
          <br />
          <strong>{pendingTask?.category}</strong>
          {' '}
          task with
          {' '}
          {' '}
          <strong>{pendingTask?.priority}</strong>
          {' '}
          priority
          <br />
          <br />
          On
          {' '}
          <strong>{pendingTask?.date}</strong>
          <br />
          From
          {' '}
          <strong>{pendingTask?.timeRange?.start}</strong>
          {' '}
          to
          {' '}
          <strong>{pendingTask?.timeRange?.end}</strong>
        </>
      )}
      confirmText="Add Task"
      cancelText="Cancel"
      confirmColor="primary"
      maxWidth="sm"
    />
  )
}

export default TaskAdditionConfirmationDialog
