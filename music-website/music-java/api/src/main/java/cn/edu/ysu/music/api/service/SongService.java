package cn.edu.ysu.music.api.service;

import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Song;

import java.util.List;

/**
 * 歌曲业务类接口
 *
 * @author ercao
 */
public interface SongService {

    /**
     * 检查是否存在该歌曲
     *
     * @param songs 歌曲编号数组
     */
    void checkExist(String[] songs);

    /**
     * 添加歌曲
     *
     * @param song song
     */
    void add(Song song);


    /**
     * 删除歌曲
     *
     * @param uuid uuid
     */
    void remove(String uuid);

    /**
     * 修改歌曲
     *
     * @param song song
     */
    void update(Song song);


    /**
     * 批量更新
     *
     * @param ids  ids
     * @param song song
     */
    void updateBatch(String[] ids, Song song);


    /**
     * 获取歌曲
     *
     * @param id id
     * @return return
     */
    Song get(String id);


    /**
     * 分页获取歌曲列表
     *
     * @param page page
     * @param size size
     * @return return
     */
    Page<Song> list(int page, int size);

    /**
     * 根据id批量获取
     *
     * @param ids ids
     * @return return
     */
    List<Song> list(String[] ids);


    /**
     * 随机获取歌曲列表
     *
     * @param size size
     * @return return
     */
    List<Song> listRandom(int size);

    /**
     * 获取所有歌曲
     *
     * @param artist artist
     * @return return
     */
    List<Song> listByArtist(String artist);

    /**
     * 查询专辑的所有歌曲
     *
     * @param album album
     * @return return
     */
    List<Song> listByAlbum(String album);

    /**
     * 查询歌单的所有歌曲
     *
     * @param playlist playlist
     * @return return
     */
    List<Song> listByPlaylist(String playlist);


}
