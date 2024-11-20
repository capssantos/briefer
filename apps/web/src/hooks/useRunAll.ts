import * as Y from 'yjs'
import { useYDocState } from './useYDoc'
import {
  ExecutionQueue,
  ExecutionStatus,
  getBlocks,
  getLayout,
} from '@briefer/editor'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { head } from 'ramda'

type State = {
  status: ExecutionStatus
  total: number
  remaining: number
  failedBlockId: string | null
}

type UseRunAll = [
  State,
  {
    run: () => void
    abort: () => void
  }
]
function useRunAll(yDoc: Y.Doc, userId: string | null): UseRunAll {
  const { state: layout } = useYDocState(yDoc, getLayout)
  const { state: blocks } = useYDocState(yDoc, getBlocks)
  const executionQueue = useMemo(() => ExecutionQueue.fromYjs(yDoc), [yDoc])
  const [state, setState] = useState<State>({
    status: 'idle',
    total: 0,
    remaining: 0,
    failedBlockId: null,
  })

  useEffect(() => {
    const cleanup = executionQueue.observe(() => {
      const batches = executionQueue.getRunAllBatches()
      const batch = head(batches)
      if (!batch) {
        setState((prev) => ({
          ...prev,
          status: 'idle',
          total: 0,
          remaining: 0,
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        status: batch.status,
        total: batch.length,
        remaining: batch.remaining,
      }))
    })

    return cleanup
  }, [executionQueue])

  const run = useCallback(() => {
    const batch = executionQueue.enqueueRunAll(layout.value, blocks.value, {
      userId,
    })
    batch.waitForCompletion().then((failedBlockId) => {
      setState({
        status: batch.status,
        total: batch.length,
        remaining: batch.remaining,
        failedBlockId,
      })
    })
  }, [layout, blocks, userId, executionQueue])

  const abort = useCallback(() => {
    executionQueue.getRunAllBatches().forEach((batch) => {
      batch.abort()
    })
  }, [executionQueue])

  return useMemo(() => [state, { run, abort }], [state, run, abort])
}

export default useRunAll
