package cn.edu.ysu.music.framework.util;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;
import java.util.Properties;

/**
 * 属性文件工具类
 *
 * @author author
 */
@Slf4j
public class PropsUtil {
    /**
     * 加载属性文件
     *
     * @param filename 属性文件名称
     */
    public static Properties loadProps(String filename) {
        Properties props = null;
        InputStream is = null;

        try {
            is = ClassUtil.getClassLoader().getResourceAsStream(filename);

            if (is == null) {
                throw new RuntimeException(filename + "加载失败");
            }

            props = new Properties();
            props.load(is);
            is.close();
        } catch (IOException e) {
            log.error("属性文件加载失败", e);
            throw new RuntimeException(e);
        }
        return props;
    }

    /**
     * 获取字符串属性
     *
     * @param props props
     * @param key   key
     */
    public static String getString(Properties props, String key) {
        return getString(props, key, "");
    }

    /**
     * 获取字符串属性
     *
     * @param props        props
     * @param key          key
     * @param defaultValue defaultValue
     */
    public static String getString(Properties props, String key, String defaultValue) {
        Objects.requireNonNull(props, key);
        String value = defaultValue;
        if (props.containsKey(key)) {
            value = props.getProperty(key);
        }
        return value;
    }

    /**
     * 获取整数型属性（默认为0）
     *
     * @param props props
     * @param key   key
     */
    public static int getInt(Properties props, String key) {
        return getInt(props, key, 0);
    }

    /**
     * 获取整数属性
     *
     * @param props        props
     * @param key          key
     * @param defaultValue defaultValue
     */
    public static int getInt(Properties props, String key, int defaultValue) {
        Objects.requireNonNull(props, key);
        int value = defaultValue;
        if (props.containsKey(key)) {
            value = Integer.parseInt(props.getProperty(key));
        }
        return value;
    }

    /**
     * 获取布尔类型属性（默认为false）
     *
     * @param props props
     * @param key   key
     */
    public static boolean geBoolean(Properties props, String key) {
        return getBoolean(props, key, false);
    }

    /**
     * 获取布尔类型属性
     *
     * @param props        props
     * @param key          key
     * @param defaultValue defaultValue
     */
    public static boolean getBoolean(Properties props, String key, boolean defaultValue) {
        Objects.requireNonNull(props, key);
        boolean value = defaultValue;
        if (props.containsKey(key)) {
            value = Boolean.parseBoolean(props.getProperty(key));
        }
        return value;
    }
}
