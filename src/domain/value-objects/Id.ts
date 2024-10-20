import crypto from 'node:crypto'

export class Id {
  static createString() {
    return crypto.randomUUID()
  }
}