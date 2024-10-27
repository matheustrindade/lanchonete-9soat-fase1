export type Event = Record<string, string> & {
  name: string,
};

export interface EventPublisher {
  publish(event: Event): Promise<void>;
}
