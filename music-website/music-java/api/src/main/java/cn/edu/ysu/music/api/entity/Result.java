package cn.edu.ysu.music.api.entity;

import lombok.Getter;

/**
 * 返回结果类
 *
 * @author ercao
 */
@Getter
public class Result<T> {
    /**
     * 结果信息
     */
    private final String msg;

    /**
     * 结果代码
     */
    private final int code;


    /**
     * 结果数据
     */
    private final T data;

    private Result(String msg, int code, T data) {
        this.msg = msg;
        this.code = code;
        this.data = data;
    }

    private Result(String msg, int code) {
        this.msg = msg;
        this.code = code;
        this.data = null;
    }

    public static <T> Result<T> success() {
        return new Result<T>("ok", 200);
    }

    public static <T> Result<T> success(T data) {
        return new Result<T>("ok", 200, data);
    }

    public static <T> Result<T> success(String msg) {
        return new Result<T>(msg, 200);
    }

    public static <T> Result<T> success(String msg, T data) {
        return new Result<T>(msg, 200, data);
    }

    public static <T> Result<T> failure(String msg) {
        return new Result<T>(msg, 404);
    }

    public static <T> Result<T> failure(String msg, int code) {
        return new Result<T>(msg, code);
    }
}
