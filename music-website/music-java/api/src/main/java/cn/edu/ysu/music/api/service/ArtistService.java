package cn.edu.ysu.music.api.service;

import cn.edu.ysu.music.api.entity.Artist;
import cn.edu.ysu.music.api.entity.Page;

import java.util.List;

/**
 * 歌手业务类接口
 *
 * @author ercao
 */
public interface ArtistService {

    /**
     * 添加歌手
     *
     * @param artist artist
     * @return return
     */
    void add(Artist artist);

    /**
     * 删除歌手
     *
     * @param uuid uuid
     * @return return
     */
    void remove(String uuid);

    /**
     * 修改歌手
     *
     * @param artist artist
     */
    void update(Artist artist);

    /**
     * 获取歌手
     *
     * @param id id
     * @return return
     */
    Artist get(String id);


    /**
     * 分页获取歌手
     *
     * @param page page
     * @param size size
     * @return return
     */
    Page<Artist> list(int page, int size);

    /**
     * 随机返回歌手数组
     *
     * @param size size
     * @return return
     */
    List<Artist> listRandom(int size);

    /**
     * 批量获取歌手
     *
     * @param ids ids
     * @return return
     */
    List<Artist> list(String[] ids);

}
