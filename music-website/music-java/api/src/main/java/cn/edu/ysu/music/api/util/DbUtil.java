package cn.edu.ysu.music.api.util;

import java.util.HashMap;
import java.util.Map;

/**
 * 数据
 *
 * @author ercao
 */
public final class DbUtil {
    public static int getOffset(int page, int size) {
        return (page < 1) ? 0 : (page - 1) * size;
    }

    public static <K, V> Map<K, V> removeNullValue(Map<K, V> map) {
        Map<K, V> result = new HashMap<>(map.size());
        map.forEach((key, value) -> {
            if (value != null) {
                result.put(key, value);
            }
        });
        return result;
    }
}
