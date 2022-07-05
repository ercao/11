package cn.edu.ysu.music.api.service;


import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Playlist;

import java.util.List;

/**
 * 歌单业务类接口
 *
 * @author ercao
 */
public interface PlayListService {

    /**
     * 添加歌单
     *
     * @param playlist playlist
     * @return return
     */
    void add(Playlist playlist);

    /**
     * 删除歌单
     *
     * @param id id
     * @return return
     */
    void remove(String id);

    /**
     * 修改歌单详情
     *
     * @param playlist playlist
     * @return return
     */
    void update(Playlist playlist);

    /**
     * 添加多个歌曲到我的歌单
     *
     * @param id    id
     * @param songs songs
     */
    void addSongs(String id, String[] songs);

    /**
     * 从我的歌单删除歌曲
     *
     * @param id    id
     * @param songs songs
     */
    void removeSongs(String id, String[] songs);

    /**
     * 添加标签
     *
     * @param id   id
     * @param tags tags
     */
    void addTags(String id, String[] tags);

    /**
     * 删除标签
     *
     * @param id   id
     * @param tags tags
     */
    void removeTags(String id, String[] tags);

    /**
     * 歌单
     *
     * @param id id
     * @return return
     */
    Playlist get(String id);


    /**
     * 分页获取歌单列表
     *
     * @param tag  tag
     * @param page page
     * @param size size
     * @return return
     */
    Page<Playlist> list(String tag, int page, int size);


    /**
     * 获取所有歌曲标签
     *
     * @return return
     */
    List<Playlist.Tag> listAllTags();

    /**
     * 获取某用户的所有歌单
     *
     * @param userId userId
     * @return return
     */
    List<Playlist> listByUser(String userId);

    /**
     * 随机获取歌单列表
     *
     * @param tag
     * @param size size
     * @return return
     */
    List<Playlist> listRandom(String tag, int size);

}
