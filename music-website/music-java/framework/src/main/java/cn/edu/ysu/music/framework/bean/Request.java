package cn.edu.ysu.music.framework.bean;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * 请求
 *
 * @author author
 */
@Getter
@AllArgsConstructor
@EqualsAndHashCode
public class Request {
    private String method;
    private String path;
}
