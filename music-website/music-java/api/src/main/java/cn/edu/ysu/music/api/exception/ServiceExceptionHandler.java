package cn.edu.ysu.music.api.exception;

import cn.edu.ysu.music.api.entity.Result;
import cn.edu.ysu.music.framework.ExceptionHandler;
import cn.edu.ysu.music.framework.annotion.GlobalException;
import cn.edu.ysu.music.framework.annotion.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 业务逻辑类异常处理
 *
 * @author ercao
 */
@GlobalException(ServiceException.class)
@ResponseBody
public class ServiceExceptionHandler implements ExceptionHandler {

    @Override
    public Result<String> exceptionHandler(HttpServletRequest req, Throwable e) {
        return Result.failure(e.getMessage());
    }
}
