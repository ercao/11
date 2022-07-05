package cn.edu.ysu.music.api.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

/**
 * 分页数据
 *
 * @author ercao
 */
@AllArgsConstructor
@Getter
@ToString
public class Page<T> {
    /**
     * 当前页
     */
    long page;

    /**
     * 总记录数
     */
    long total;

    /**
     * 每页数量
     */
    long size;

    /**
     * 数据
     */
    List<T> data;
}
