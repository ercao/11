package cn.edu.ysu.music.api.dao;

import cn.edu.ysu.music.api.constant.DbConstant;
import cn.edu.ysu.music.api.entity.Artist;
import cn.edu.ysu.music.api.util.DbUtil;
import cn.edu.ysu.music.framework.annotion.Repository;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 歌手Dao接口
 *
 * @author ercao
 */
@Repository
public class ArtistDao {

    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getFieldMap(Artist artist) {
        Map<String, Object> map = new HashMap<>(7);

        map.put("uuid", artist.getUuid());
        map.put("user", artist.getUser());
        map.put("name", artist.getName());
        map.put("description", artist.getDescription());
        map.put("picture_url", artist.getPictureUrl());
        map.put("type", artist.getType());
        map.put("area", artist.getArea());
        map.put("status", artist.getStatus());

        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取所有数据总数
     */
    public long total() {
        return DatabaseHelper.queryResult(Long.class, DbConstant.SelectTotalSqlPrefix.ARTIST + ";");
    }

    /**
     * 检查歌手是否存在
     *
     * @param uuids uuids
     * @return return
     */
    public long checkExist(String[] uuids) {

        String str = "?, ".repeat(uuids.length);
        String sql = DbConstant.SelectTotalSqlPrefix.ARTIST + " where uuid in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.queryResult(Long.class, sql, (Object[]) uuids);
    }

    /**
     * 查询歌手
     *
     * @param uuid 歌手编号
     */
    public Artist selectEntityById(String uuid) {
        String sql = DbConstant.SelectSqlPrefix.ARTIST + "where uuid=?";
        return DatabaseHelper.queryEntity(Artist.class, sql, uuid);
    }

    /**
     * 根据歌手编号查询所有歌手
     *
     * @param uuids uuids
     * @return return
     */
    public List<Artist> selectList(String[] uuids) {

        String str = "?, ".repeat(uuids.length);
        String sql = DbConstant.SelectSqlPrefix.ARTIST + "where uuid in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.queryList(Artist.class, sql, (Object[]) uuids);
    }

    /**
     * 分页查询所有歌手
     */
    public List<Artist> selectList(int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.ARTIST + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Artist.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 歌手名字子串查询
     *
     * @param name 歌手名字子串
     */
    public List<Artist> selectList(String name, int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.ARTIST + "where `name` like %?% " + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Artist.class, sql, name, DbUtil.getOffset(page, size), size);
    }

    /**
     * 插入一条歌手数据
     *
     * @param artist artist
     */
    public boolean insert(Artist artist) {
        return DatabaseHelper.insertEntity(DbConstant.TableName.ARTIST, getFieldMap(artist));
    }

    /**
     * 删除一条歌手
     *
     * @param uuid 歌手编号
     */
    public boolean delete(String uuid) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.ARTIST, Map.entry("uuid", uuid));
    }

    /**
     * 更新歌手信息
     *
     * @param artist 修改后的歌手实体
     */
    public boolean update(Artist artist) {
        String uuid = artist.getUuid();
        artist.setUser(null);
        return DatabaseHelper.updateEntity(
                DbConstant.TableName.ARTIST,
                Map.entry("uuid", uuid),
                getFieldMap(artist));
    }


}
