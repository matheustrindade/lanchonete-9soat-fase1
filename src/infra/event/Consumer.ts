import { Event } from "@/application/event/EventPublisher"

type Callback = (event: Event) => Promise<void>

export interface EventConsumer {
	consume (queue: string, callback: Callback): Promise<void>
}