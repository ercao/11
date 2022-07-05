package cn.edu.ysu.music.api.dao;

import cn.edu.ysu.music.api.constant.DbConstant;
import cn.edu.ysu.music.api.entity.Playlist;
import cn.edu.ysu.music.api.util.DbUtil;
import cn.edu.ysu.music.framework.annotion.Repository;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 歌单Dao接口
 *
 * @author ercao
 */
@Repository
public class PlaylistDao {
    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getFieldMap(Playlist playlist) {
        HashMap<String, Object> map = new HashMap<>(9);
        map.put("uuid", playlist.getUuid());
        map.put("name", playlist.getName());
        map.put("description", playlist.getDescription());
        map.put("picture_url", playlist.getPictureUrl());
        map.put("user", playlist.getUser());
        map.put("songs", playlist.getSongs());
        map.put("tags", playlist.getTags());
        map.put("update_time", playlist.getUpdateTime());
        map.put("create_time", playlist.getCreateTime());
        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取所有歌单总数
     *
     * @param tag tag
     */
    public long total(String tag) {
        String sql = DbConstant.SelectTotalSqlPrefix.PLAYLIST + " where json_contains(tags, concat('\"',? , '\"'));";
        return DatabaseHelper.queryResult(Long.class, sql, tag);
    }

    /**
     * 获取所有歌单标签总数
     */
    public long totalTag() {
        return DatabaseHelper.queryResult(Long.class, DbConstant.SelectTotalSqlPrefix.PLAYLIST_TAG + ";");
    }

    /**
     * 检查表中是否有该标签
     *
     * @return return
     */
    public long checkExistTag(String[] tags) {
        String str = "?, ".repeat(tags.length);
        String sql = DbConstant.SelectTotalSqlPrefix.PLAYLIST_TAG + "where name in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.queryResult(Long.class, sql, (Object[]) tags);
    }

    /**
     * 查询歌单
     *
     * @param uuid 歌单编号
     */
    public Playlist selectEntityById(String uuid) {
        String sql = DbConstant.SelectSqlPrefix.PLAYLIST + "where uuid=?";
        return DatabaseHelper.queryEntity(Playlist.class, sql, uuid);
    }


    /**
     * 分页查询所有歌单
     */
    public List<Playlist> selectList(String tag, int page, int size) {

        String sql = DbConstant.SelectSqlPrefix.PLAYLIST + " where json_contains(tags, concat('\"',? , '\"')) " + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Playlist.class, sql, tag, DbUtil.getOffset(page, size), size);
    }

    /**
     * 获取某用户的所有歌单
     */
    public List<Playlist> selectListByUser(String user) {
        String sql = DbConstant.SelectSqlPrefix.PLAYLIST + " where user=?";
        return DatabaseHelper.queryList(Playlist.class, sql, user);
    }

    /**
     * 分页查询所有歌单标签
     */
    public List<Playlist.Tag> selectTagList(int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.PLAYLIST_TAG + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Playlist.Tag.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 查询所有歌单标签
     */
    public List<Playlist.Tag> selectTagList() {
        String sql = DbConstant.SelectSqlPrefix.PLAYLIST_TAG + ";";
        return DatabaseHelper.queryList(Playlist.Tag.class, sql);
    }

    /**
     * 歌单名字子串查询
     *
     * @param name 歌单名字子串
     */
    public List<Playlist> selectListByName(String name, int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.PLAYLIST + "where `name` like %?% " + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Playlist.class, sql, name, DbUtil.getOffset(page, size), size);
    }

    /**
     * 歌单标签名字子串查询
     *
     * @param name 歌单标签名字子串
     * @param page 当前页
     * @param size 每页数量
     * @return return
     */
    public List<Playlist.Tag> selectTagList(String name, int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.PLAYLIST_TAG + " where `name` like %?%" + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Playlist.Tag.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 插入一条歌单数据
     *
     * @param playlist playlist
     */
    public boolean insert(Playlist playlist) {
        return DatabaseHelper.insertEntity(DbConstant.TableName.PLAYLIST, getFieldMap(playlist));
    }

    /**
     * 删除一条歌单
     *
     * @param uuid 歌单编号
     */
    public boolean delete(String uuid) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.PLAYLIST, Map.entry("uuid", uuid));
    }

    /**
     * 更新歌单信息
     *
     * @param playlist 修改后的歌单实体
     */
    public boolean update(Playlist playlist) {
        String uuid = playlist.getUuid();
        playlist.setUuid(null);
        return DatabaseHelper.updateEntity(
                DbConstant.TableName.PLAYLIST,
                Map.entry("uuid", uuid),
                getFieldMap(playlist));
    }


}
