package cn.edu.ysu.music.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;


/**
 * 歌单实体类
 *
 * @author ercao
 */
@Data
@NoArgsConstructor
public class Album {
    /**
     * 专辑编号
     */
    private String uuid;
    /**
     * 专辑名称
     */
    private String name;
    /**
     * 专辑描述
     */
    private String description;
    /**
     * 专辑所属歌手
     */
    private String artists;

    private List<Artist> artistList;

    /**
     * 专辑图片Url
     */
    private String pictureUrl;
    /**
     * 专辑发行时间
     */
    private Date publishTime;
    /**
     * 专辑创建时间
     */
    private LocalDateTime createTime;
    /**
     * 专辑状态
     */
    private String status;
}
