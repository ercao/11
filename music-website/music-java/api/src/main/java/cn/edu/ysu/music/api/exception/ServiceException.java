package cn.edu.ysu.music.api.exception;

/**
 * 业务类异常
 *
 * @author ercao
 */
public class ServiceException extends RuntimeException {
    public ServiceException(String message) {
        super(message);
    }
}
