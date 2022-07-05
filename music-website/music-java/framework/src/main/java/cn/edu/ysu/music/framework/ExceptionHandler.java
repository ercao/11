package cn.edu.ysu.music.framework;

import javax.servlet.http.HttpServletRequest;

/**
 * 异常处理类
 *
 * @author ercao
 */
public interface ExceptionHandler {
    /**
     * 异常处理
     *
     * @param req req
     * @param e   e
     * @return return
     */
    Object exceptionHandler(HttpServletRequest req, Throwable e);
}
