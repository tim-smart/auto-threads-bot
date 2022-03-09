import { watch$ } from "droff/dist/caches/channels"
import * as RxO from "rxjs/operators"
import { flow } from "fp-ts/lib/function"
import { WatchOp } from "droff/dist/caches/resources"
import { Channel } from "droff/dist/types"

export const withAutothread = flow(
  watch$,
  RxO.map(
    (op): WatchOp<Channel> =>
      op.event === "create" || op.event === "update"
        ? op.resource.topic?.includes("autothread")
          ? op
          : { event: "delete", resourceId: op.resourceId }
        : op
  )
)
