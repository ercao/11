package cn.edu.ysu.music.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 歌单实体类
 *
 * @author ercao
 */
@Data
@NoArgsConstructor
public class Playlist {
    /**
     * 歌单编号
     */
    private String uuid;
    /**
     * 歌单名称
     */
    private String name;
    /**
     * 歌单描述
     */
    private String description;

    /**
     * 歌单图片
     */
    private String pictureUrl;

    /**
     * 歌单所属用户
     */
    private String user;

    /**
     * 用户实体
     */
    private User userEntity;

    /**
     * 歌单歌曲
     */
    private String songs;

    /**
     * 歌曲实体
     */
    private List<Song> songList;

    /**
     * 歌单标签
     */
    private String tags;

    /**
     * 歌单更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 歌单创建时间
     */
    private LocalDateTime createTime;

    /**
     * 歌单标签实体类
     */
    @Data
    @NoArgsConstructor
    public static class Tag {
        /**
         * 歌单标签名字
         */
        public String name;
    }
}
