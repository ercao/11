package cn.edu.ysu.music.framework;

import cn.edu.ysu.music.framework.bean.Handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 拦截器接口
 *
 * @author ercao
 */
public interface InterceptorHandler {

    /**
     * preHandler Controller方法之前处理
     *
     * @param req     req
     * @param res     res
     * @param handler handler
     * @return return
     */
    default boolean preHandler(HttpServletRequest req, HttpServletResponse res, Handler handler) {
        return true;
    }

    /**
     * postHandler Controller方法之后 视图之前处理
     *
     * @param req     req
     * @param res     res
     * @param handler handler
     * @return return
     */
    default boolean postHandler(HttpServletRequest req, HttpServletResponse res, Handler handler) {
        return true;
    }

    /**
     * preHandler 返回视图之后处理
     *
     * @param req     req
     * @param res     res
     * @param handler handler
     * @return return
     */
    default boolean afterCompletion(HttpServletRequest req, HttpServletResponse res, Handler handler) {
        return true;
    }
}
