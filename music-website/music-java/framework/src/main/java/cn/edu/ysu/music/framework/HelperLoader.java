package cn.edu.ysu.music.framework;

import cn.edu.ysu.music.framework.helper.*;
import cn.edu.ysu.music.framework.util.ClassUtil;

import java.util.List;

/**
 * @author ercao
 */
public final class HelperLoader {

    /**
     * 加载类的静态代码块
     */
    public static void init() {
        Class<?>[] helpers = new Class[]{
                ClassHelper.class,
                BeanHelper.class,
                AopHelper.class,
                IocHelper.class,
                ControllerHelper.class,
                InterceptorHelper.class,
                ExceptionHelper.class,

        };

        List.of(helpers).forEach(clazz -> {
            ClassUtil.loadClass(clazz.getName());
        });
    }
}
