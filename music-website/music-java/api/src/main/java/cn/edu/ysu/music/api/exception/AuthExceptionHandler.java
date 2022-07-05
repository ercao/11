package cn.edu.ysu.music.api.exception;


import cn.edu.ysu.music.api.entity.Result;
import cn.edu.ysu.music.framework.ExceptionHandler;
import cn.edu.ysu.music.framework.annotion.GlobalException;
import cn.edu.ysu.music.framework.annotion.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 权限类异常处理
 *
 * @author ercao
 */
@GlobalException(AuthException.class)
@ResponseBody
public class AuthExceptionHandler implements ExceptionHandler {

    @Override
    public Result<String> exceptionHandler(HttpServletRequest req, Throwable e) {
        return Result.failure(e.getMessage(), 403);
    }
}
