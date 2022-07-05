package cn.edu.ysu.music.api.dao;

import cn.edu.ysu.music.api.constant.DbConstant;
import cn.edu.ysu.music.api.entity.Lyric;
import cn.edu.ysu.music.api.util.DbUtil;
import cn.edu.ysu.music.framework.annotion.Repository;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 歌词 Dao
 *
 * @author ercao
 */
@Repository
public class LyricDao {
    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getFieldMap(Lyric lyric) {
        Map<String, Object> map = new HashMap<>(2);

        map.put("song", lyric.getSong());
        map.put("content", lyric.getContent());

        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取所有歌词总数
     */
    public long total() {
        return DatabaseHelper.queryResult(Long.class, DbConstant.SelectTotalSqlPrefix.LYRIC + ";");
    }

    /**
     * 查询歌词
     *
     * @param song 歌词歌曲编号
     */
    public Lyric selectEntityById(String song) {
        String sql = DbConstant.SelectSqlPrefix.LYRIC + "where song=?";
        return DatabaseHelper.queryEntity(Lyric.class, sql, song);
    }

    /**
     * 分页查询所有歌词
     */
    public List<Lyric> selectList(int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.LYRIC + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(Lyric.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 插入一条歌词数据
     *
     * @param lyric lyric
     */
    public boolean insert(Lyric lyric) {
        return DatabaseHelper.insertEntity(DbConstant.TableName.LYRIC, getFieldMap(lyric));
    }

    /**
     * 删除一条歌词
     *
     * @param song 歌词歌曲编号
     */
    public boolean delete(String song) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.LYRIC, Map.entry("song", song));
    }

    /**
     * 更新歌词信息
     *
     * @param lyric 修改后的歌词实体
     */
    public boolean update(Lyric lyric) {
        String song = lyric.getSong();
        lyric.setSong(null);
        return DatabaseHelper.updateEntity(
                DbConstant.TableName.LYRIC,
                Map.entry("song", song),
                getFieldMap(lyric));
    }
}
