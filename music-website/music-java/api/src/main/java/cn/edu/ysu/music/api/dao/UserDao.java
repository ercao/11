package cn.edu.ysu.music.api.dao;

import cn.edu.ysu.music.api.constant.DbConstant;
import cn.edu.ysu.music.api.entity.User;
import cn.edu.ysu.music.api.util.DbUtil;
import cn.edu.ysu.music.framework.annotion.Repository;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;
import com.auth0.jwt.JWT;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户 Dao 接口
 *
 * @author ercao
 */
@Repository
public class UserDao {


    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getUserFieldMap(User user) {
        Map<String, Object> map = new HashMap<>(7);

        map.put("uuid", user.getUuid());
        map.put("username", user.getUsername());
        map.put("password", user.getPassword());
        map.put("avatar_url", user.getAvatarUrl());
        map.put("login_time", user.getLoginTime());
        map.put("role", user.getRole());
        map.put("status", user.getStatus());

        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取 field-成员属性 映射
     */
    private static Map<String, Object> getJwtFieldMap(String token) {
        Map<String, Object> map = new HashMap<>(2);

        map.put("token", token);
        map.put("expire_time", Timestamp.from(JWT.decode(token).getExpiresAt().toInstant()));

        return DbUtil.removeNullValue(map);
    }

    /**
     * 获取所有用户总数
     */
    public long total() {
        return DatabaseHelper.queryResult(Long.class, DbConstant.SelectTotalSqlPrefix.USER + ";");
    }

    /**
     * 检查表中是否存在该token
     *
     * @param tokens tokens
     * @return return
     */
    public long checkExistToken(String[] tokens) {
        String str = "?, ".repeat(tokens.length);
        String sql = DbConstant.SelectTotalSqlPrefix.JWT + "where token in (" + str.substring(0, str.lastIndexOf(", ")) + ")";
        return DatabaseHelper.queryResult(Long.class, sql, (Object[]) tokens);

    }

    /**
     * 查询用户
     *
     * @param uuid 用户编号
     */
    public User selectEntityById(String uuid) {
        String sql = DbConstant.SelectSqlPrefix.USER + "where uuid=?";
        return DatabaseHelper.queryEntity(User.class, sql, uuid);
    }

    /**
     * 根据用户名查询用户
     *
     * @param username username
     */
    public User selectEntityByUsername(String username) {
        String sql = DbConstant.SelectSqlPrefix.USER + "where username=?";
        return DatabaseHelper.queryEntity(User.class, sql, username);
    }

    /**
     * 分页查询所有用户
     */
    public List<User> selectList(int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.USER + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(User.class, sql, DbUtil.getOffset(page, size), size);
    }

    /**
     * 用户名字子串查询
     *
     * @param name 用户名字子串
     */
    public List<User> selectList(String name, int page, int size) {
        String sql = DbConstant.SelectSqlPrefix.USER + "where `name` like %?% " + DbConstant.SELECT_PAGE_SQL;
        return DatabaseHelper.queryList(User.class, sql, name, DbUtil.getOffset(page, size), size);
    }

    /**
     * 插入一条用户数据
     *
     * @param user user
     */
    public boolean insert(User user) {
        return DatabaseHelper.insertEntity(DbConstant.TableName.USER, getUserFieldMap(user));
    }

    /**
     * 插入一条jwt token记录
     *
     * @param token token
     * @return return
     */
    public boolean insertJwtToken(String token) {

        return DatabaseHelper.insertEntity(DbConstant.TableName.JWT, getJwtFieldMap(token));
    }

    /**
     * 删除一条用户
     *
     * @param uuid 用户编号
     */
    public boolean delete(String uuid) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.USER, Map.entry("uuid", uuid));
    }

    /**
     * 删除一条token记录
     *
     * @param token token
     */
    public boolean deleteToken(String token) {
        return DatabaseHelper.deleteEntity(DbConstant.TableName.JWT, Map.entry("token", token));
    }

    /**
     * 清除过期token
     *
     * @return return
     */
    public int clearExpiredToken() {
        String sql = "delete from " + DbConstant.TableName.JWT + " where current_time > expire_time;";
        return DatabaseHelper.update(sql);
    }


    /**
     * 更新用户信息
     *
     * @param user 修改后的用户实体
     */
    public boolean update(User user) {
        String uuid = user.getUuid();
        user.setUuid(null);
        return DatabaseHelper.updateEntity(
                DbConstant.TableName.USER,
                Map.entry("uuid", uuid),
                getUserFieldMap(user));
    }
}
