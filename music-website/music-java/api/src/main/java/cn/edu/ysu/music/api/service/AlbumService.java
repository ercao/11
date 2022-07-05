package cn.edu.ysu.music.api.service;

import cn.edu.ysu.music.api.entity.Album;
import cn.edu.ysu.music.api.entity.Page;

import java.util.List;

/**
 * 专辑业务类接口
 *
 * @author ercao
 */
public interface AlbumService {

    /**
     * 添加专辑
     *
     * @param album album
     */
    void add(Album album);

    /**
     * 删除专辑
     *
     * @param id id
     */
    void remove(String id);

    /**
     * 修改专辑详情
     *
     * @param album album
     */
    void update(Album album);


    /**
     * 获取专辑
     *
     * @param id id
     * @return return
     */
    Album get(String id);


    /**
     * 分页获取歌单列表
     *
     * @param page page
     * @param size size
     * @return return
     */
    Page<Album> list(int page, int size);


    /**
     * 获取某歌手的所有专辑
     *
     * @param artistId artistId
     * @return return
     */
    List<Album> listByArtist(String artistId);

    /**
     * 随机返回专辑
     *
     * @param size size
     * @return return
     */
    List<Album> listRandom(int size);
}
