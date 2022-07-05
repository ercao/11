package cn.edu.ysu.music.api.exception;

import cn.edu.ysu.music.framework.ExceptionHandler;
import cn.edu.ysu.music.framework.annotion.GlobalException;
import cn.edu.ysu.music.framework.annotion.ResponseBody;
import cn.edu.ysu.music.framework.exception.PageNotFoundException;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;


/**
 * 页面不存在异常处理
 *
 * @author ercao
 */
@Slf4j
@GlobalException(PageNotFoundException.class)
@ResponseBody
public class PageNotFoundExceptionHandler implements ExceptionHandler {
    @Override
    public String exceptionHandler(HttpServletRequest req, Throwable e) {
        return "404";
    }
}
