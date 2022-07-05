package cn.edu.ysu.music.api.util;

import cn.edu.ysu.music.api.exception.ServiceException;
import org.apache.commons.lang3.StringUtils;

/**
 * 业务类工具类
 *
 * @author ercao
 */
public class ServiceUtil {
    public static long checkPage(long page, long size, long total) {
        var maxPage = (int) Math.ceil(((double) total) / size);
        return Math.min(page, maxPage);
    }

    public static long checkSize(long size, long total) {
        return size < 1 || size > total ? 10 : size;
    }

    public static void requireNotNullId(String id, String message) {
        if (StringUtils.isEmpty(id)) {
            throw new ServiceException(message);
        }
    }

    public static void requireTrue(boolean flag, String msg) {
        if (!flag) {
            throw new ServiceException(msg);
        }
    }
}
