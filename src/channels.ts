import { Cache } from "droff-helpers"
import { watch$ } from "droff/dist/caches/channels"
import { flow } from "fp-ts/lib/function"
import * as RxO from "rxjs/operators"

export const withAutothread = flow(
  watch$,
  RxO.map(Cache.filterWatch((c) => c.topic?.includes("autothread") === true)),
  RxO.map(Cache.mapWatch(() => ({})))
)
