import type { EnvironmentStatus } from '@briefer/database'
import clsx from 'clsx'

interface Props {
  envStatus: EnvironmentStatus
  envLoading: boolean
  execStatus: 'enqueued' | 'running'
  runningAll: boolean
  position: 'top' | 'left'
}
export function SQLExecTooltip(props: Props) {
  return (
    <ExecTooltip
      {...props}
      envStartingMessage="Please hang tight. We need to save your query as a dataframe so you can use it in Python blocks."
    />
  )
}

export function PythonExecTooltip(props: Props) {
  return (
    <ExecTooltip
      {...props}
      envStartingMessage="Please hang tight. We need to start your environment before executing python code."
    />
  )
}

export function VisualizationExecTooltip(props: Props) {
  return (
    <ExecTooltip
      {...props}
      envStartingMessage="Please hang tight. We need to start your environment before rendering the visualization."
    />
  )
}

export function PivotTableExecTooltip(props: Props) {
  return (
    <ExecTooltip
      {...props}
      envStartingMessage="Please hang tight. We need to start your environment before rendering the pivot table."
    />
  )
}

export function WritebackExecTooltip(props: Props) {
  return (
    <ExecTooltip
      {...props}
      envStartingMessage="Please hang tight. We need to start your environment before executing writeback."
    />
  )
}

function Tooltip(props: {
  title: string
  message: string
  position: 'top' | 'left'
}) {
  console.log(props.position, 'wtf')
  return (
    <div
      className={clsx(
        'font-sans pointer-events-none absolute w-max opacity-0 transition-opacity group-hover:opacity-100 bg-hunter-950 text-white text-xs p-2 rounded-md flex flex-col items-center justify-center gap-y-1',
        props.position === 'top'
          ? '-top-2 left-1/2 -translate-y-full -translate-x-1/2'
          : 'right-full -translate-x-full -translate-y-1/2'
      )}
    >
      <span>{props.title}</span>
      <span className="inline-flex gap-x-1 items-center justify-center text-gray-400 w-64">
        {props.message}
      </span>
    </div>
  )
}

interface ExecTooltipProps extends Props {
  envStartingMessage: string
}
function ExecTooltip(props: ExecTooltipProps): JSX.Element | null {
  switch (props.execStatus) {
    case 'enqueued':
      return (
        <Tooltip
          title="This block is enqueued."
          message="It will run once the previous blocks finish executing."
          position={props.position}
        />
      )
    case 'running':
      if (props.envStatus !== 'Running' && !props.envLoading) {
        return (
          <Tooltip
            title="Your environment is starting"
            message={props.envStartingMessage}
            position={props.position}
          />
        )
      }

      if (props.runningAll) {
        return (
          <Tooltip
            title="This block is running."
            message="When running entire documents, you cannot stop individual blocks."
            position={props.position}
          />
        )
      }

      return null
  }
}
