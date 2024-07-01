# Redis là gì?

- Redis là một CSDL, nhưng nó khác với CSDL truyền thống, dữ liệu sẽ được lưu trong bộ nhớ, và tốc độ lưu trữ đọc và ghi rất nhanh.

- Sử dụng trong khóa phân tán.

- Cung cấp nhiều loại dữ liệu khác nhau, có hỗ trợ transaction, tính bền vững, tập lệnh, sự kiện, cluster...

# Tại sao lại sử dụng Redis?

- Hiệu suất cao, đồng thời cao.

# Memcache và Redis cache

- Hỗ trợ nhiều loại dữ liệu phong phú hơn
- Redis có thể tính persistent
- Redis có thể quản lý cluster
- Memcache thì đa luồng, Redis đơn luồng

# Redis có bao nhiêu kiểu dữ liệu, kịch bản sử dụng
- string: get, set, mget, mset : bộ đệm, bộ đếm
- hash: thông tin người dùng, sản phẩm...
- list: danh sách theo dõi follow, danh sách tin nhắn...
- set
- zset

- bitmap: 2.2
- Hyperloglog: 2.8
- GEO: 3.2
- Stream: 5.0

# Cơ chế hết hạn redis
- Xóa định kỳ
- Xóa bằng dòng lệnh

# Đảm bảo tính nhất quán giữa Redis và CSDL

# Vấn đề tương tranh đồng thời


# Kiểu dữ liệu trong Redis

## String

- Lưu trữ tối đa 512MB
- Kịch bản sử dụng: đối tượng bộ đệm, số lượng thông thường, khóa phân tán, thông tin phiên được chia sẻ (tập trung vào lấy ở redis)...
- SDS (Simple Dynamic Strings)
- Mã hóa
    - embstring (<= 44bytes>)
    - raw (> 44bytes)
    - int (interger)

- Câu lệnh
    - SET Key Value
    - GET Key
    - EXISTS Key
    - STRLEN Key
    - object encoding Key
    - DEL Key
    - MSET Key1 Value1 Key2 Value2...
    - MGET Key1 Key2...
    - INCR Key
    - INCRBY Key NumberIncrement
    - DECR Key
    - DECRBY Key Number
    - KEYS "pattern regex"
    - EXPIRE Key Number (giây)
    - TTL Key
    - SET Key Value Ex Number (giây)
    - SETNX Key value: nếu k tồn tại thì cho set, trả về 1, 0

## Hash 

- HSET SETNAME Key Value Key Value
- HGET SETNAME Key
- HMSET SETNAME Key Value Key Value
- HMGET SETNAME Key1 Key2
- HDEL
- HLEN
- HGETALL
- HEXISTS
- HINCR
- HINCRBY
- HKEYS
- HVALS

- Kịch bản: cache, giỏ hàng, lưu thông tin user

## LIST

- LPUSH key items
- LRANGE key start stop: ví dụ 0 -1 (lấy tất cả)
- RPUSH
- LPOP
- RPOP
- Blocking: 
    - BLPOP key 0 (=> áp dụng message queue)
- LINDEX
- LLEN
- LTRIM
- EXISTS
- LSET
- LINSERT

- Kịch bản: làm message queue => bảo toàn thứ tự queue, xử lý duplicate, bảo đảm độ tin cậy

## Sets 

- Redis Set là một kiểu dữ liệu tập hợp không có thứ tự và không chứa các phần tử trùng lặp. 

- SADD
- SMEMBERS
- SREM
- SCARD
- SISMEMBER
- SRANDMEMBER
- SPOP
- SMOVE
- SINTER
- SDIFF

- Kịch bản sử dụng: ví dụ là hệ thống like của newsfeed, xác định điểm chung (SINTER)...


## ZSet
- Tập hợp có thứ tự
- ZADD
- ZREVRANGE key 0 -1 
- ZRANGE key 0 -1 
- ZCARD
- ZINCRBY
- ZRANGEBYSCORE
- ZSCORE

- Kịch bản sử dụng: tìm kiếm range, bảng xếp hạng thành tích, sản phẩm... 

## Transaction
- Không đảm bảo tính atomic
- Watch
    - Multi
        - Exec
            - Discard
- Mở trans Multi, thực thi Exec, loại bỏ Discard        
- Khi tạo transaction, nếu gặp một lỗi thì nó sẽ tự động Discard.
- WATCH key: Lệnh WATCH trong Redis được sử dụng để thực hiện một cơ chế kiểm tra và thiết lập (Check-and-Set - CAS), cho phép bạn giám sát một hoặc nhiều khóa và đảm bảo rằng các khóa này không thay đổi trước khi thực hiện một transaction.

## Pub/Sub
- Không phải là hệ thống message queue, bởi không đầy đủ tính năng của message queue
- SUBCRIBE
- PUBLISH