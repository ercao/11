package cn.edu.ysu.music.api.dao;

import cn.edu.ysu.music.api.constant.DbConstant;
import cn.edu.ysu.music.api.entity.Song;
import cn.edu.ysu.music.api.util.DbUtil;
import cn.edu.ysu.music.framework.annotion.Repository;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;
import org.apache.commons.lang3.ArrayUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 歌曲Dao层
 *
 * @author ercao
 */
@Repository
public class SongDao {
    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getFieldMap(Song song) {
        Map<String, Object> map = new HashMap<>();

        map.put("uuid", song.getUuid());
        map.put("name", song.getName());
        map.put("picture_url", song.getArtists());
        map.put("artists", song.getArtists());
        map.put("album", song.getAlbum());
        map.put("url", song.getUrl());
        map.put("status", song.getStatus());

        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取所有数据总数
     */
    public long total() {
        return DatabaseHelper.queryResult(Long.class, DbConstant.SelectTotalSqlPrefix.SONG + ";");
    }

    /**
     * 表中是否存在歌曲
     *
     * @param uuids 歌曲编号数组
     * @return 存在歌曲的数量
     */
    public long checkExist(String[] uuids) {
        String str = "?, ".repeat(uuids.length);
        String sql = DbConstant.SelectTotalSqlPrefix.SONG + "where uuid in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.queryResult(Long.class, sql, (Object[]) uuids);

    }

    /**
     * 查询歌曲
     *
     * @param uuid 歌曲编号
     */
    public Song selectEntityById(String uuid) {
        String sql = DbConstant.SelectSqlPrefix.SONG + "where uuid=?";
        return DatabaseHelper.queryEntity(Song.class, sql, uuid);
    }

    /**
     * 根据歌曲编号查询所有歌曲
     *
     * @param uuids uuids
     * @return return
     */
    public List<Song> selectList(String[] uuids) {
        String str = "?, ".repeat(uuids.length);
        String sql = DbConstant.SelectSqlPrefix.SONG + "where uuid in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.queryList(Song.class, sql, (Object[]) uuids);
    }


    /**
     * 根据专辑查询所有歌曲
     *
     * @param album album
     * @return return
     */
    public List<Song> selectListByAlbum(String album) {
        String sql = DbConstant.SelectSqlPrefix.SONG + "where album=?;";
        return DatabaseHelper.queryList(Song.class, sql, album);
    }

    /**
     * 分页查询所有数据
     */
    public List<Song> selectList(int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.SONG + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Song.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 用户名子串查询
     *
     * @param username 用户名字串
     */
    public List<Song> selectList(String username, int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.SONG + "where `username` like %?% " + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Song.class, sql, username, DbUtil.getOffset(page, size), size);
    }

    /**
     * 插入一条歌曲数据
     *
     * @param song song
     */
    public boolean insert(Song song) {
        return DatabaseHelper.insertEntity(DbConstant.TableName.SONG, getFieldMap(song));
    }

    /**
     * 删除一条歌曲
     *
     * @param uuid 歌曲编号
     */
    public boolean delete(String uuid) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.SONG, Map.entry("uuid", uuid));
    }

    /**
     * 更新歌曲信息
     *
     * @param song 修改后的歌曲实体
     */
    public boolean update(Song song) {
        String uuid = song.getUuid();
        song.setUuid(null);
        return DatabaseHelper.updateEntity(
                DbConstant.TableName.SONG,
                Map.entry("uuid", uuid),
                getFieldMap(song));
    }

    /**
     * 批量更新歌曲信息
     *
     * @param ids  ids
     * @param song song
     */
    public boolean updateBatch(String[] ids, Song song) {
        song.setUuid(null);

        return DatabaseHelper.updateBatch(DbConstant.TableName.SONG, Map.entry("uuid", ids), getFieldMap(song));
    }

    /**
     * 批量更新歌曲专辑
     *
     * @param ids ids
     */
    public boolean updateAlbum(String[] ids, String album) {
        String str = "?, ".repeat(ids.length);
        String sql = DbConstant.UpdateSqlPrefix.SONG + " album:=? where uuid in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.update(sql, (Object) ArrayUtils.insert(0, ids, album)) == ids.length;
    }

    public List<Song> selectListByArtist(String artist) {
        String sql = DbConstant.SelectSqlPrefix.SONG + " where json_contains(artists, concat('\"', ?, '\"'));";
        return DatabaseHelper.queryList(Song.class, sql, artist);


    }

    public List<Song> selectListByPlaylist(String playlist) {
        String sql = DbConstant.SelectSqlPrefix.SONG + " where uuid in (\n" +
                "    SELECT distinct song.uuid\n" +
                "    FROM playlist, JSON_TABLE(\n" +
                "            playlist.songs,\n" +
                "            '$[*]'\n" +
                "            COLUMNS(\n" +
                "                uuid varchar(36) PATH '$'\n" +
                "                )\n" +
                "        ) song where playlist.uuid = ?\n" +
                "    ); ";
        return DatabaseHelper.queryList(Song.class, sql, playlist);
    }

}
