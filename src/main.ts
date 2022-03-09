import * as Dotenv from "dotenv"
import { createClient, Intents } from "droff"
import { pipe } from "fp-ts/lib/function"
import * as TE from "fp-ts/lib/TaskEither"
import * as Rx from "rxjs"
import * as RxO from "rxjs/operators"
import * as Channels from "./channels"
import { createThread, validMessage } from "./ops"

Dotenv.config()

const client = createClient({
  token: process.env.DISCORD_BOT_TOKEN!,
  gateway: {
    intents: Intents.GUILD_MESSAGES,
  },
})

const [channels, channels$] = client.nonParentCacheFromWatch(
  Channels.withAutothread(client.fromDispatch)
)()

const create$ = client.fromDispatch("MESSAGE_CREATE").pipe(
  RxO.mergeMap((msg) => Rx.zip(Rx.of(msg), validMessage(channels)(msg))),
  RxO.filter(([, valid]) => valid),
  RxO.flatMap(([msg]) =>
    pipe(createThread(msg)({ client }), TE.mapLeft(console.error))()
  )
)

Rx.merge(client.effects$, channels$, create$).subscribe()
