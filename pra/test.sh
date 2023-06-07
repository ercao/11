# 请求页特别大的时候
# 似乎在模拟中
# 基于历史的页面置换算法 缺页率似乎就是 与 max min capacity 有关
# 可能与等概率生成页号也有关

### EXT = a*r+(t+r)(1-a)+t=2t+r-t*a
### a: 命中率, r块表访问时间, t访问内存时间
ts-node src/index.ts run  --max-length 1000000 --min 0 --max 100 --capacity 50
