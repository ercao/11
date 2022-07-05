package cn.edu.ysu.music.framework.bean;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Method;

/**
 * 封装Controller信息
 *
 * @author author
 */
@Getter
@Setter
@AllArgsConstructor
public class Handler {
    private Class<?> clazz;
    private Method method;
}
