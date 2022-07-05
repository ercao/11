package cn.edu.ysu.music.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 歌手类
 *
 * @author ercao
 */
@Data
@NoArgsConstructor
public class Artist {
    /**
     * 歌曲编号
     */
    private String uuid;


    /**
     * 歌手名字
     */
    private String name;

    /**
     * 歌手描述
     */
    private String description;

    /**
     * 歌手图片url
     */
    private String pictureUrl;

    /**
     * 歌手用户编号
     */
    private String user;

    /**
     * 用户实体
     */
    private User userEntity;

    /**
     * 歌手所属类型
     */
    private String type;

    /**
     * 歌手所属区域
     */
    private String area;

    /**
     * 歌手状态
     */
    private String status;
}
