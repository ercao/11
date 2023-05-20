/**
 * 换页策略接口
 */
export abstract class Strategy<T> {
  /** 是否包含该页面 */
  public abstract contain(page: T): boolean

  /**
   * 请求页面
   * @returns {swap: 换出的页面, flag: 是否缺页}
   */
  public abstract put(page: T): { swap?: T; flag: boolean }

  /** 转换成数组 */
  public abstract toArray(): T[]
}
