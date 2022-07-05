package cn.edu.ysu.music.api.service;

import cn.edu.ysu.music.api.entity.Lyric;

/**
 * 歌词业务类接口
 *
 * @author ercao
 */
public interface LyricService {

    /**
     * 添加歌词
     *
     * @param lyric lyric
     * @return return
     */
    void add(Lyric lyric);

    /**
     * 删除歌词
     *
     * @param uuid uuid
     * @return return
     */
    void remove(String uuid);

    /**
     * 修改歌词
     *
     * @param lyric lyric
     */
    void update(Lyric lyric);

    /**
     * 获取歌曲
     *
     * @param uuid uuid
     * @return return
     */
    Lyric get(String uuid);
}
