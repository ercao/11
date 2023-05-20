import { Strategy } from './Strategy.ts'

/** 快表 */
export class QuickTable<T> {
  public constructor(private _strategy: Strategy<T>) {}

  public contain(page: T): boolean {
    return this._strategy.contain(page)
  }

  public push(page: T): void {
    this._strategy.put(page)
  }
}
