package cn.edu.ysu.music.api.dao;

import cn.edu.ysu.music.api.constant.DbConstant;
import cn.edu.ysu.music.api.entity.Album;
import cn.edu.ysu.music.api.util.DbUtil;
import cn.edu.ysu.music.framework.annotion.Repository;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 专辑Dao
 *
 * @author ercao
 */
@Repository
public class AlbumDao {


    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getFieldMap(Album album) {
        Map<String, Object> map = new HashMap<>(8);

        map.put("uuid", album.getUuid());
        map.put("name", album.getName());
        map.put("description", album.getDescription());
        map.put("artists", album.getArtists());
        map.put("picture_url", album.getArtists());
        map.put("publish_time", album.getPublishTime());
        map.put("create_time", album.getCreateTime());
        map.put("status", album.getStatus());

        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取所有专辑总数
     */
    public long total() {
        return DatabaseHelper.queryResult(Long.class, DbConstant.SelectTotalSqlPrefix.ALBUM);
    }

    /**
     * 查询专辑
     *
     * @param uuid 专辑编号
     */
    public Album selectEntityById(String uuid) {
        String sql = DbConstant.SelectSqlPrefix.ALBUM + "where uuid=?";
        return DatabaseHelper.queryEntity(Album.class, sql, uuid);
    }

    /**
     * 分页查询所有专辑
     */
    public List<Album> selectList(int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.ALBUM + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Album.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 专辑名称子串查询
     *
     * @param name name
     */
    public List<Album> selectList(String name, int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.ALBUM + "where `username` like %?% " + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Album.class, sql, name, DbUtil.getOffset(page, size), size);
    }

    /**
     * 插入一条专辑数据
     *
     * @param album album
     */
    public boolean insert(Album album) {
        return DatabaseHelper.insertEntity(DbConstant.TableName.ALBUM, getFieldMap(album));
    }

    /**
     * 删除一条专辑数据
     *
     * @param uuid 专辑编号
     */
    public boolean delete(String uuid) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.ALBUM, Map.entry("uuid", uuid));
    }

    /**
     * 更新专辑信息
     *
     * @param album 修改后的专辑实体
     */
    public boolean update(Album album) {
        String uuid = album.getUuid();
        album.setUuid(null);

        return DatabaseHelper.updateEntity(
                DbConstant.TableName.ALBUM,
                Map.entry("uuid", uuid),
                getFieldMap(album));
    }


    /**
     * 查询专辑列表通过歌手
     *
     * @param artistId artistId
     */
    public List<Album> selectListByArtist(String artistId) {
        String sql = DbConstant.SelectSqlPrefix.ALBUM + "where json_contains(artists, concat('\"', ?, '\"') )";
        return DatabaseHelper.queryList(Album.class, sql, artistId);
    }
}
