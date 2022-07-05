package cn.edu.ysu.music.framework.bean;

import lombok.AllArgsConstructor;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.collections4.MapUtils;

import java.util.Arrays;
import java.util.Map;

/**
 * 请求参数
 *
 * @author ercao
 */
@AllArgsConstructor
public class Param {
    private final Map<String, ?> map;

    public boolean isEmpty() {
        return MapUtils.isEmpty(map);
    }

    public boolean containKey(String key) {
        return map.containsKey(key);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> clazz) {
        return (T) ConvertUtils.convert(map.get(key), clazz);
    }

    @SuppressWarnings("unchecked")
    public <T> T[] getArray(String key, Class<T> clazz) {
        return (T[]) ConvertUtils.convert(map.get(key), clazz);
    }

    public String getString(String key) {
        return MapUtils.getString(map, key);
    }

    public String[] getStringArray(String key) {
        return (String[]) ConvertUtils.convert(map.get(key), String.class);
    }

    public int getInt(String key) {
        return MapUtils.getIntValue(map, key);
    }

    public int[] getIntArray(String key) {
        return Arrays.stream(((String[]) map.get(key))).mapToInt(Integer::parseInt).toArray();
    }

    public double getDouble(String key) {
        return MapUtils.getDoubleValue(map, key);
    }

    public double[] getDoubleArray(String key) {
        return Arrays.stream(((String[]) map.get(key))).mapToDouble(Double::parseDouble).toArray();
    }

    public long getLong(String key) {
        return MapUtils.getLongValue(map, key);
    }

    public long[] getLongArray(String key) {
        return Arrays.stream(((String[]) map.get(key))).mapToLong(Long::parseLong).toArray();
    }

    @Override
    public String toString() {
        return map.toString();
    }
}
