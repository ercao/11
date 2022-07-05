package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.bean.Param;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * 请求帮助类
 *
 * @author author
 */
public class RequestHelper {

    public static Param parseParameters(HttpServletRequest request) {
        Map<String, Object> paramMap = new HashMap<>();
        Map<String, String[]> map = request.getParameterMap();

        map.forEach((key, value) -> {
            if (!ArrayUtils.isNotEmpty(value)) {
                return;
            }

            if (value.length == 1) {
                paramMap.put(key, value[0]);
                return;
            }

            paramMap.put(key, value);
        });
        return new Param(paramMap);
    }


    /**
     * 解析请求体
     *
     * @param request
     * @return
     */
    public static <V> V parseBody(HttpServletRequest request, Class<V> clazz) {
        try {
            String body = IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8);
            if (StringUtils.isEmpty(body)) {
                return null;
            }

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(body, clazz);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 解析请求体为map
     *
     * @param request
     * @param clazz
     * @param <K>
     * @param <V>
     */
    public static <K, V> Map<K, V> parseBodyMap(HttpServletRequest request, Class<Map<K, V>> clazz) {
        return parseBody(request, clazz);
    }

    /**
     * 获取所有请求头
     *
     * @param req req
     * @return return
     */
    public static Map<String, String> parseHeaders(HttpServletRequest req) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> names = req.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            headers.put(name, req.getHeader(name));
        }
        return headers;
    }

    /**
     * 获取请求头
     *
     * @param req req
     * @param key key
     * @return return
     */
    public static String parseHeader(HttpServletRequest req, String key) {


        return req.getHeader(key);
    }
}
