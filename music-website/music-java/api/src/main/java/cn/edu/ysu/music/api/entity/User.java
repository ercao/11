package cn.edu.ysu.music.api.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户实体类
 *
 * @author ercao
 */
@Data
@NoArgsConstructor
public class User {
    /**
     * 用户编号
     */
    private String uuid;
    /**
     * 用户名
     */
    private String username;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 用户头像路径
     */
    private String avatarUrl;
    /**
     * 上次登陆时间
     */
    private LocalDateTime loginTime;
    /**
     * 用户角色
     */
    private String role;
    /**
     * 用户状态
     */
    private String status;

    @NoArgsConstructor
    public static class Builder {
        private final User user = new User();

        public User build() {
            return user;
        }

        public Builder withUuid(String uuid) {
            user.setUuid(uuid);
            return this;
        }

        public Builder withLoginTime(LocalDateTime loginTime) {
            user.setLoginTime(loginTime);
            return this;
        }
    }
}
