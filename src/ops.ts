import { Client } from "droff"
import {
  CacheStoreWithHelpers,
  NonParentCacheStoreWithHelpers,
} from "droff/dist/caches/stores"
import { Channel, Message } from "droff/dist/types"
import { pipe } from "fp-ts/lib/function"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as TE from "fp-ts/lib/TaskEither"

export interface ClientCtx {
  client: Client
}

export const validMessage =
  (channels: NonParentCacheStoreWithHelpers<Channel>) => (m: Message) =>
    channels.get(m.channel_id).then((c) => !!c)

const threadName = (content: string) =>
  content.replace(/\s+/g, " ").slice(0, 50) + (content.length > 50 ? "..." : "")

export const createThread = (msg: Message) =>
  pipe(
    RTE.ask<ClientCtx>(),
    RTE.chainTaskEitherK(
      TE.tryCatchK(
        ({ client }) =>
          client.startThreadWithMessage(msg.channel_id, msg.id, {
            name: threadName(msg.content),
          }),
        (err) => `createThread: ${err}`
      )
    )
  )
