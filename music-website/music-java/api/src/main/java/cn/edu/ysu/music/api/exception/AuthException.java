package cn.edu.ysu.music.api.exception;


/**
 * 权限类异常
 *
 * @author ercao
 */
public class AuthException extends RuntimeException {

    public AuthException(String message) {
        super(message);
    }
}
