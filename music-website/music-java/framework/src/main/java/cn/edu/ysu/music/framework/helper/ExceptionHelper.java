package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.ExceptionHandler;
import cn.edu.ysu.music.framework.annotion.GlobalException;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

/**
 * 异常处理帮助类
 *
 * @author ercao
 */
@Slf4j
public class ExceptionHelper {


    private static final Map<Class<? extends Throwable>, ExceptionHandler> EXCEPTION_HANDLER_MAP;

    static {
        EXCEPTION_HANDLER_MAP = new HashMap<>();
        Map<Class<?>, Object> beanMap = BeanHelper.getBeanMap();

        beanMap.forEach((key, value) -> {
            if (ExceptionHandler.class.isAssignableFrom(key)) {
                GlobalException annotation = key.getAnnotation(GlobalException.class);
                if (annotation == null) {
                    throw new RuntimeException("未声明 GlobalException 注解" + key.getName());
                }

                var exception = annotation.value();

                if (EXCEPTION_HANDLER_MAP.containsKey(exception)) {
//                    throw new RuntimeException(exception.getName() + "存在多个异常处理器" + key.getName());
                    log.warn(exception.getName() + "存在多个异常处理器 --- 覆盖");
                }

                EXCEPTION_HANDLER_MAP.put(exception, (ExceptionHandler) value);
            }
        });
    }

    public static ExceptionHandler getExceptionHandler(Class<? extends Throwable> clazz) {
        return EXCEPTION_HANDLER_MAP.get(clazz);
    }
}
