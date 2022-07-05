package cn.edu.ysu.music.api.service;

import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.User;

/**
 * 用户业务类接口
 *
 * @author ercao
 */
public interface UserService {

    /**
     * 登陆
     *
     * @param user user
     * @return return
     */
    String login(User user);

    /**
     * 验证token
     *
     * @param token token
     * @return return
     */
    void verificationToken(String token);


    /**
     * 添加用户
     *
     * @param user user
     */
    void add(User user);

    /**
     * 删除用户
     *
     * @param uuid uuid
     */
    void remove(String uuid);

    /**
     * 修改用户信息
     *
     * @param user user
     */
    void update(User user);

    /**
     * 获取用户
     *
     * @param id       id
     * @param password 是否获取密码
     * @return return
     */
    User get(String id, boolean password);

    /**
     * 不填充密码
     *
     * @param id 用户编号
     * @return return
     */
    default User get(String id) {
        return get(id, false);
    }

    /**
     * 分页获取用户列表
     *
     * @param page page
     * @param size size
     * @return return
     */
    Page<User> list(int page, int size);
}
