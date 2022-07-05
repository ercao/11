package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.InterceptorHandler;
import cn.edu.ysu.music.framework.annotion.Interceptor;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.stream.Collectors;

/**
 * 拦截器帮助类
 *
 * @author ercao
 */
public class InterceptorHelper {
    private static final PriorityQueue<InterceptorHandler> INTERCEPTOR_SET;

    static {
        INTERCEPTOR_SET = new PriorityQueue<>(Comparator.comparingInt((InterceptorHandler elem) -> elem.getClass().getAnnotation(Interceptor.class).priority()));

        Map<Class<?>, Object> beanMap = BeanHelper.getBeanMap();
        // 获取所有实现了InterceptorHandler接口的Bean
        List<Object> collect = beanMap.values().stream().filter(InterceptorHandler.class::isInstance).collect(Collectors.toList());

        collect.forEach((interceptor) -> {
                    INTERCEPTOR_SET.add((InterceptorHandler) interceptor);
                }
        );
    }

    /**
     * 获取拦截器粗合理器
     *
     * @return return
     */
    public static PriorityQueue<InterceptorHandler> getInterceptorSet() {
        return new PriorityQueue<>(INTERCEPTOR_SET);
    }
}
