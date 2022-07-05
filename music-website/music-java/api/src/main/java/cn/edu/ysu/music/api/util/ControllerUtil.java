package cn.edu.ysu.music.api.util;

import cn.edu.ysu.music.api.constant.CommonConstant;
import cn.edu.ysu.music.framework.bean.Param;

/**
 * 控制器工具类
 *
 * @author ercao
 */
public final class ControllerUtil {

    public static int parsePage(Param param) {
        return parsePage(param, 1);
    }

    public static int parsePage(Param param, int defaultValue) {
        int page = defaultValue;
        if (param.containKey(CommonConstant.ParamKey.PAGE)) {
            page = param.getInt(CommonConstant.ParamKey.PAGE);
        }
        return page;
    }

    public static int parseSize(Param param, int defaultValue) {
        int size = defaultValue;
        if (param.containKey(CommonConstant.ParamKey.SIZE)) {
            size = param.getInt(CommonConstant.ParamKey.SIZE);
        }
        return size;
    }

    public static int parseSize(Param param) {
        return parseSize(param, 10);
    }

    public static String parseId(Param param) {
        String id = "";
        if (param.containKey(CommonConstant.ParamKey.ID)) {
            id = param.getString(CommonConstant.ParamKey.ID);
        }
        return id;
    }

    public static String parseTag(Param param) {
        String tag = "全部";
        if (param.containKey(CommonConstant.ParamKey.TAG)) {
            tag = param.getString(CommonConstant.ParamKey.TAG);
        }
        return tag;
    }
}
