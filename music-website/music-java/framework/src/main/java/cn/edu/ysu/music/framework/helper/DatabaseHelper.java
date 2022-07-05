package cn.edu.ysu.music.framework.helper;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 数据库操作助手类
 *
 * @author author
 */
@Slf4j
public class DatabaseHelper {
    private static final ThreadLocal<Connection> CONNECTION_HOLDER;

    private static final QueryRunner QUERY_RUNNER;

    static {
        DbUtils.loadDriver(ConfigHelper.getJdbcDriver());

        CONNECTION_HOLDER = new ThreadLocal<>();
        QUERY_RUNNER = new QueryRunner();
    }


    /**
     * 获取数据库连接
     */
    public static Connection getConnection() {
        Connection connection = CONNECTION_HOLDER.get();
        if (connection == null) {
            try {
                connection = DriverManager.getConnection(ConfigHelper.getJdbcUrl(), ConfigHelper.getJdbcUsername(), ConfigHelper.getJdbcPassword());
            } catch (SQLException e) {
                log.error("数据库连接失败", e);
                throw new RuntimeException(e);
            } finally {
                CONNECTION_HOLDER.set(connection);
            }
        }
        return connection;
    }

    /**
     * 开启事物
     */
    public static void beginTransaction() {
        Connection connection = getConnection();

        try {
            if (connection.getAutoCommit()) {
                log.debug("开启事务");
                connection.setAutoCommit(false);
            }
        } catch (SQLException e) {
            log.error("事物开启失败", e);
            throw new RuntimeException(e);
        } finally {
            CONNECTION_HOLDER.set(connection);
        }
    }

    /**
     * 提交事物
     */
    public static void commitTransaction() {
        Connection connection = getConnection();

        try {
            if (!connection.getAutoCommit()) {
                log.debug("提交事务");
                connection.commit();
                connection.close();
            }
        } catch (SQLException e) {
            log.error("事物提交失败", e);
            throw new RuntimeException(e);
        } finally {
            CONNECTION_HOLDER.remove();
        }
    }

    /**
     * 回滚事物
     */
    public static void rollbackTransaction() {
        Connection connection = getConnection();

        try {
            if (!connection.getAutoCommit()) {
                log.debug("回滚事务");
                connection.rollback();
                connection.close();
            }
        } catch (SQLException e) {
            log.error("事物回滚失败", e);
            throw new RuntimeException(e);
        } finally {
            CONNECTION_HOLDER.remove();
        }
    }

    /**
     * 查询实体
     *
     * @param entityClass entityClass
     * @param sql         sql
     * @param params      params
     * @param <T>         <T>
     */
    public static <T> T queryEntity(Class<T> entityClass, String sql, Object... params) {
        T entity;
        Connection connection = getConnection();
        try {
            entity = QUERY_RUNNER.query(connection, sql, new BeanHandler<>(entityClass), params);
        } catch (SQLException e) {
            log.error("查询实体失败", e);
            throw new RuntimeException(e);
        }
        return entity;
    }


    /**
     * 查询结果
     *
     * @param resultClass resultClass
     * @param sql         sql
     * @param params      params
     * @param <T>         <T>
     */
    @SuppressWarnings("unchecked")
    public static <T> T queryResult(Class<T> resultClass, String sql, Object... params) {
        T result;
        Connection connection = getConnection();
        try {
            result = QUERY_RUNNER.query(connection, sql, rs -> {
                if (!rs.next()) {
                    return null;
                }

                return (T) rs.getObject(1);
            }, params);
        } catch (SQLException e) {
            log.error("查询结果失败", e);
            throw new RuntimeException(e);
        }
        return result;
    }

    /**
     * 查询 (自定义 ResultSetHandler)
     *
     * @param resultSetHandler resultSetHandler
     * @param sql              sql
     * @param params           params
     * @param <T>              <T>
     */
    public static <T> T query(ResultSetHandler<T> resultSetHandler, String sql, Object... params) {
        T result;
        Connection connection = getConnection();

        try {
            result = QUERY_RUNNER.query(connection, sql, resultSetHandler, params);
        } catch (SQLException e) {
            log.error("查询失败", e);
            throw new RuntimeException(e);
        }
        return result;
    }


    /**
     * 查询列表
     *
     * @param entityClass entityClass
     * @param sql         sql
     * @param params      params
     * @param <T>         <T>
     */
    public static <T> List<T> queryList(Class<T> entityClass, String sql, Object... params) {
        List<T> list;
        Connection connection = getConnection();
        try {
            list = QUERY_RUNNER.query(connection, sql, new BeanListHandler<>(entityClass), params);
        } catch (SQLException e) {
            log.error("查询列表失败", e);
            throw new RuntimeException(e);
        }
        return list;
    }

    /**
     * 执行更新语句（insert, delete, update）
     *
     * @param sql    sql
     * @param params params
     */
    public static int update(String sql, Object... params) {
        int rows = 0;
        try {
            Connection connection = getConnection();
            rows = QUERY_RUNNER.update(connection, sql, params);
        } catch (SQLException e) {
            log.error("执行更新语句失败", e);
            throw new RuntimeException(e);
        }
        return rows;
    }

    /**
     * 插入实体
     * hashMap 的遍历应该是 pure
     *
     * @param tableName tableName
     * @param fieldMap  fieldMap
     * @return return
     */
    public static boolean insertEntity(String tableName, Map<String, Object> fieldMap) {
        if (MapUtils.isEmpty(fieldMap)) {
            log.error("插入实体失败,fieldMap为空");
            return false;
        }

        String sql = "insert into " + tableName;

        StringBuilder columns = new StringBuilder("(");
        StringBuilder values = new StringBuilder("(");
        fieldMap.forEach((key, value) -> {
            columns.append(key).append(", ");
            values.append("?, ");
        });
        columns.replace(columns.lastIndexOf(", "), columns.length(), ")");
        values.replace(values.lastIndexOf(", "), values.length(), ")");

        sql += columns + " values " + values;

        return update(sql, fieldMap.values().toArray()) == 1;
    }

    // TODO 批量插入


    /**
     * 更新实体
     * hashMap 的遍历应该是 pure
     *
     * @param tableName tableName
     * @param id        pair
     * @param fieldMap  fieldMap
     */
    public static boolean updateEntity(String tableName, Map.Entry<String, Object> id, Map<String, Object> fieldMap) {
        if (MapUtils.isEmpty(fieldMap)) {
            log.error("更新实体失败,fieldMap为空");
            return false;
        }

        String sql = "update " + tableName + " set ";

        StringBuilder columns = new StringBuilder();
        fieldMap.keySet().forEach(key -> columns.append(key).append(" = ?, "));
        sql += columns.substring(0, columns.lastIndexOf(", ")) + " where " + id.getKey() + " = ?";

        List<Object> params = new ArrayList<>(fieldMap.values());
        params.add(id.getValue());

        return update(sql, params.toArray()) == 1;
    }

    /**
     * 更新批量
     * hashMap 的遍历应该是 pure
     *
     * @param tableName tableName
     * @param ids       pair
     * @param fieldMap  fieldMap
     */
    public static boolean updateBatch(String tableName, Map.Entry<String, Object[]> ids, Map<String, Object> fieldMap) {
        if (MapUtils.isEmpty(fieldMap)) {
            log.error("更新实体失败,fieldMap为空");
            return false;
        }

        String sql = "update " + tableName + " set ";
        StringBuilder columns = new StringBuilder();
        String placeholder = "?, ".repeat(ids.getValue().length);
        fieldMap.keySet().forEach(key -> columns.append(key).append(" = ?, "));
        sql += columns.substring(0, columns.lastIndexOf(", ")) + " where " + ids.getKey() + " in (" + placeholder.substring(0, placeholder.lastIndexOf(", ")) + ");";

        List<Object> params = new ArrayList<>(fieldMap.values());

        params.addAll(List.of(ids.getValue()));

        return update(sql, params.toArray()) == ids.getValue().length;
    }

    /**
     * 删除实体
     *
     * @param tableName tableName
     * @param id        id
     */
    public static boolean deleteEntity(String tableName, Map.Entry<String, Object> id) {
        return update("delete from " + tableName + " where " + id.getKey() + " = ?", id.getValue()) == 1;
    }

}
