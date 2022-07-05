package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.util.ReflectionUtil;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

/**
 * @author
 */
@Slf4j
public final class BeanHelper {
    private static final Map<Class<?>, Object> BEAN_MAP = new HashMap<>();

    // 将所有class实例化并存入bean map
    static {
        ClassHelper.getBeanClassSet().forEach(clazz -> {
            BEAN_MAP.put(clazz, ReflectionUtil.newInstance(clazz));
        });
    }


    /**
     * 获取Bean Map
     */
    public static Map<Class<?>, Object> getBeanMap() {
        return BEAN_MAP;
    }


    /**
     * 获取bean
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(Class<T> clazz) {
        if (!BEAN_MAP.containsKey(clazz)) {
            log.error("不存在该Bean");
            throw new RuntimeException("该Bean不存在：" + clazz.getName());
        }

        return (T) BEAN_MAP.get(clazz);
    }

    /**
     * 设置bean实例
     *
     * @param clazz 类
     * @param bean  实例
     */
    public static void setBean(Class<?> clazz, Object bean) {
        BEAN_MAP.put(clazz, bean);
    }
}
