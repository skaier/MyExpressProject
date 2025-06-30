import { createClient } from 'redis';
import logger from '../utils/logger';

class CacheService {
  private client: ReturnType<typeof createClient>;
  private getAsync: (key: string) => Promise<string | null>;
  private setAsync: (key: string, value: string, options?: { EX?: number }) => Promise<string | null>;
  private delAsync: (key: string) => Promise<number>;
  private quitAsync: () => Promise<string>;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = createClient({ url: redisUrl });

    // 连接Redis
    this.client.connect().catch(err => {
      logger.error(`Redis连接错误: ${err.message}`);
    });

    // 监听错误事件
    this.client.on('error', (err) => {
      logger.error(`Redis错误: ${err.message}`);
    });

    // 将回调方法转换为Promise
    this.getAsync = this.client.get.bind(this.client);
    this.setAsync = this.client.set.bind(this.client);
    this.delAsync = this.client.del.bind(this.client);
    this.quitAsync = this.client.quit.bind(this.client);
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存值或null
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.getAsync(key);
    } catch (err) {
      logger.error(`获取缓存失败: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 过期时间(秒)
   * @returns 操作结果
   */
  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      const result = ttl 
        ? await this.setAsync(key, value, { EX: ttl })
        : await this.setAsync(key, value);
      return result === 'OK';
    } catch (err) {
      logger.error(`设置缓存失败: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }

  /**
   * 删除缓存
   * @param key 缓存键
   * @returns 删除的键数量
   */
  async delete(key: string): Promise<number> {
    try {
      return await this.delAsync(key);
    } catch (err) {
      logger.error(`删除缓存失败: ${err instanceof Error ? err.message : String(err)}`);
      return 0;
    }
  }

  /**
   * 关闭Redis连接
   */
  async disconnect(): Promise<void> {
    try {
      await this.quitAsync();
    } catch (err) {
      logger.error(`关闭Redis连接失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

// 导出单例实例
const cacheService = new CacheService();
export default cacheService;