package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.annotion.Controller;
import cn.edu.ysu.music.framework.annotion.RequestMapping;
import cn.edu.ysu.music.framework.bean.Handler;
import cn.edu.ysu.music.framework.bean.Request;
import org.apache.commons.collections4.CollectionUtils;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

/**
 * 控制器助手类
 *
 * @author author
 */
public class ControllerHelper {

    private static final Map<Request, Handler> CONTROLLER_MAP = new HashMap<>();

    static {
        Set<Class<?>> set = ClassHelper.getControllerClassSet();
        if (CollectionUtils.isNotEmpty(set)) {
            // 遍历 Controller 类的所有方法构建 Request-Handler 映射
            set.forEach(clazz -> {
                String prefixPath = clazz.getAnnotation(Controller.class).value();
                Method[] methods = clazz.getMethods();

                Stream.of(methods).forEach(method -> {
                    if (!method.isAnnotationPresent(RequestMapping.class)) {
                        return;
                    }

                    RequestMapping annotation = method.getAnnotation(RequestMapping.class);

                    CONTROLLER_MAP.put(new Request(annotation.method().name(), prefixPath + annotation.value()), new Handler(clazz, method));
                });
            });
        }
    }

    /**
     * 获取处理器
     *
     * @param path
     * @param method
     */
    public static Handler getHandler(String path, String method) {
        return CONTROLLER_MAP.get(new Request(method, path));
    }
}
