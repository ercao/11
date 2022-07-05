package cn.edu.ysu.music.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 歌曲实体类
 *
 * @author ercao
 */
@Data
@NoArgsConstructor
public class Song {
    /**
     * 歌曲编号
     */
    private String uuid;

    /**
     * 歌曲名字
     */
    private String name;

    /**
     * 歌曲图片url
     */
    private String pictureUrl;

    /**
     * 歌曲
     */
    private String artists;

    /**
     * 歌手实体
     */
    private List<Artist> artistList;

    /**
     * 歌曲所属专辑
     */
    private String album;
    private Album albumEntity;

    /**
     * 歌曲url
     */
    private String url;

    /**
     * 歌曲状态
     */
    private String status;

    @NoArgsConstructor
    public static class Builder {
        private final Song song = new Song();

        public Song build() {
            return song;
        }

        public Builder withAlbum(String album) {
            song.setAlbum(album);
            return this;
        }
    }

}
