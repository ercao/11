package cn.edu.ysu.music.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 歌词实体类
 *
 * @author ercao
 */
@Data
@NoArgsConstructor
public class Lyric {
    /**
     * 歌词所属歌曲
     */
    private String song;

    /**
     * 歌词内容
     */
    private String content;
}
