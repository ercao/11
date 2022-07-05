package cn.edu.ysu.music.api.interceptor;

/**
 * 角色
 *
 * @author ercao
 */
public enum Role {
    /**
     * 普通用户，管理员
     */
    Admin("1"), User("0");

    final String value;

    Role(String value) {
        this.value = value;
    }
}
