package cn.edu.ysu.music.framework.util;

import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * 反射操作工具类
 *
 * @author ercao
 */
@Slf4j
public class ReflectionUtil {

    /**
     * 实例化类
     *
     * @param clazz
     * @return
     */
    public static <T> T newInstance(Class<T> clazz) {
        T instance = null;
        try {
            instance = clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            log.error("类实例化失败", e);
            throw new RuntimeException(e);
        }
        return instance;
    }

    /**
     * 实例化类
     *
     * @param className 全类名
     */
    public static Object newInstance(String className) {
        return newInstance(ClassUtil.loadClass(className));
    }

    /**
     * 调用成员方法
     *
     * @param object
     * @param method
     * @param args
     */
    public static Object invokeMethod(Object object, Method method, Object... args) throws InvocationTargetException, IllegalAccessException {
        try {
            method.setAccessible(true);
            return method.invoke(object, args);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 设置成员属性
     *
     * @param object
     * @param field
     * @param value
     */
    public static void setField(Object object, Field field, Object value) {
        try {
            field.setAccessible(true);
            field.set(object, value);
        } catch (IllegalAccessException e) {
            log.error("设置成员属性失败", e);
            throw new RuntimeException(e);
        }
    }

}
