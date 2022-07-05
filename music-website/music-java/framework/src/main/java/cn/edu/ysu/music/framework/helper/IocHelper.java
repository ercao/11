package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.util.ReflectionUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Set;
import java.util.stream.Stream;

/**
 * IOC Helper
 *
 * @author author
 */
@Slf4j
public class IocHelper {

    static {
        var beanMap = BeanHelper.getBeanMap();

        if (MapUtils.isNotEmpty(beanMap)) {

            // 根据@Autowired 注解注入实例
            beanMap.forEach((clazz, bean) -> {
                Field[] fields = clazz.getDeclaredFields();
                Stream.of(fields).forEach((field) -> {
                    if (!field.isAnnotationPresent(Autowired.class)) {
                        return;
                    }

                    Class<?> beanClass = findImplementClass(field.getType());
                    ReflectionUtil.setField(bean, field, BeanHelper.getBean(beanClass));
                });
            });
        }

    }


    /**
     * 寻找实现类
     *
     * @param interfaceClass
     * @return
     */
    private static <T> Class<T> findImplementClass(Class<T> interfaceClass) {
        // 不是抽象类和接口，返回本身
        if (!interfaceClass.isInterface() && !Modifier.isAbstract(interfaceClass.getModifiers())) {
            return interfaceClass;
        }

        Set<Class<T>> derived = ClassHelper.getClassSetBySuper(interfaceClass);
        if (derived.size() > 1) {
            var msg = "含有多个派生类Bean";
            var e = new RuntimeException(msg);
            log.error(msg, e);
            throw e;
        }

        return derived.iterator().next();
    }
}
