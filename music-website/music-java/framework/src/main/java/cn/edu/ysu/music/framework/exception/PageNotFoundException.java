package cn.edu.ysu.music.framework.exception;

/**
 * 页面不存在
 *
 * @author ercao
 */
public class PageNotFoundException extends RuntimeException {
    public PageNotFoundException(String message) {
        super(message);
    }
}
