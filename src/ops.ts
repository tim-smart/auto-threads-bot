import { Client } from "droff"
import { Message } from "droff/types"
import { pipe } from "fp-ts/lib/function"
import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as TE from "fp-ts/lib/TaskEither"

export interface ClientCtx {
  client: Client
}

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
