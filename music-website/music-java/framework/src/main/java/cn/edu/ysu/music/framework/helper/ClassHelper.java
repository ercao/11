package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.util.ClassUtil;

import java.lang.annotation.Annotation;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author author
 */
public final class ClassHelper {
    /**
     * 所有类集合
     */
    public static final Set<Class<?>> CLASS_SET;

    static {

        String packageName = ConfigHelper.getAppBasePackage();
        CLASS_SET = ClassUtil.getClassSet(packageName);
    }

    /**
     * 获取基础包下所有类集合
     */
    public static Set<Class<?>> getClassSet() {
        return CLASS_SET;
    }

    /**
     * 获取基础包下所有Service类
     */
    public static Set<Class<?>> getServiceClassSet() {
        return getClassSet(Service.class);
    }

    /**
     * 获取基础包下所有的拦截器类
     *
     * @return return
     */
    public static Set<Class<?>> getInterceptorClassSet() {
        return getClassSet(Interceptor.class);
    }

    /**
     * 获取基础包下所有的异常处理类
     *
     * @return return
     */
    public static Set<Class<?>> getExceptionClassSet() {
        return getClassSet(GlobalException.class);
    }

    /**
     * 获取基础包下所有Controller类
     */
    public static Set<Class<?>> getControllerClassSet() {
        return getClassSet(Controller.class);
    }

    /**
     * 获取基础包下所有Repository类
     */
    public static Set<Class<?>> getRepositoryClassSet() {
        return getClassSet(Repository.class);
    }

    /**
     * 获取基础包下所有Bean类
     */
    public static Set<Class<?>> getBeanClassSet() {
        return getClassSet(Controller.class, Service.class, Repository.class, Interceptor.class, GlobalException.class);
    }


    /**
     * 获取基础包下某类或者接口的所有子类
     *
     * @param superClass superClass
     */
    @SuppressWarnings("unchecked")
    public static <T> Set<Class<T>> getClassSetBySuper(Class<T> superClass) {
        Set<Class<T>> deriveSet = new HashSet<>();
        CLASS_SET.stream()
                .filter(clazz -> superClass.isAssignableFrom(clazz) && !superClass.equals(clazz))
                .forEach((clazz) -> {
                    deriveSet.add((Class<T>) clazz);
                });
        return deriveSet;
    }

    /**
     * 获取基础包下包含指定注解的类
     *
     * @param annotations annotations
     */
    @SafeVarargs
    public static Set<Class<?>> getClassSet(Class<? extends Annotation>... annotations) {
        return annotations.length <= 0
                ? CLASS_SET
                : CLASS_SET.stream().filter(clazz -> Stream.of(annotations).anyMatch(clazz::isAnnotationPresent)).collect(Collectors.toSet());
    }
}
