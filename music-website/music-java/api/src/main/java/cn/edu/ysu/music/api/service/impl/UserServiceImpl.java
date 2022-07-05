package cn.edu.ysu.music.api.service.impl;

import cn.edu.ysu.music.api.constant.ExceptionConstant;
import cn.edu.ysu.music.api.dao.UserDao;
import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.User;
import cn.edu.ysu.music.api.exception.AuthException;
import cn.edu.ysu.music.api.exception.ServiceException;
import cn.edu.ysu.music.api.service.UserService;
import cn.edu.ysu.music.api.util.ServiceUtil;
import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.annotion.Service;
import cn.edu.ysu.music.framework.annotion.Transactional;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/**
 * 用户业务类
 *
 * @author ercao
 */
@Service
@Slf4j
public class UserServiceImpl implements UserService {
    /**
     * 过期时间 默认15分钟
     */
    private static final long EXPIRE_TIME = 15 * 60 * 1000;
    private static final String TOKEN_SECRET = "privateKey";


    @Autowired
    UserDao userDao;

    /**
     * 用户登陆
     *
     * @param loginUser user
     */
    @Override
    @Transactional
    public String login(User loginUser) {
        User user = userDao.selectEntityByUsername(loginUser.getUsername());

        if (user == null) {
            throw new ServiceException(ExceptionConstant.User.NOT_EXIST);
        }

        if (!user.getPassword().equals(loginUser.getPassword())) {
            throw new ServiceException(ExceptionConstant.User.PASSWORD_WRONG);
        }

        // 生成jwt token
        String token = JWT.create()
                .withPayload(Map.of(
                        "uuid", user.getUuid(),
                        "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                        "nickname", user.getNickname() != null ? user.getNickname() : "",
                        "role", user.getRole()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRE_TIME))
                .withHeader(Map.of(
                        "alg", "HS256",
                        "typ", "JWT"
                )).sign(Algorithm.HMAC256(TOKEN_SECRET));

        if (!userDao.insertJwtToken(token)) {
            throw new ServiceException(ExceptionConstant.User.SAVE_TOKEN_FAILED);
        }

        int expired = userDao.clearExpiredToken();
        log.debug("清除了" + expired + "条失效Token");

        // 修改用户登陆时间
        update(new User.Builder()
                .withUuid(user.getUuid())
                .withLoginTime(LocalDateTime.now())
                .build());

        return token;
    }

    @Override
    public void verificationToken(String token) {
        if (userDao.checkExistToken(new String[]{token}) < 1) {
            throw new AuthException("token 不存在");
        }
    }

    @Override
    public void add(User user) {
        user.setUuid(UUID.randomUUID().toString());

        ServiceUtil.requireTrue(userDao.insert(user), ExceptionConstant.User.ADD_FAILED);
    }


    @Override
    public void remove(String id) {
        requireNotNullId(id);

        ServiceUtil.requireTrue(userDao.delete(id), ExceptionConstant.User.REMOVE_FAILED);
    }

    @Override
    public void update(User user) {
        requireNotNullId(user.getUuid());
        ServiceUtil.requireTrue(userDao.update(user), ExceptionConstant.User.UPDATE_FAILED);
    }


    @Override
    public User get(String id, boolean password) {
        requireNotNullId(id);

        User user = userDao.selectEntityById(id);
        if (user == null) {
            throw new ServiceException(ExceptionConstant.User.NOT_EXIST);
        }

        if (!password) {
            user.setPassword(null);
        }
        return user;
    }

    @Override
    public Page<User> list(int page, int size) {
        throw new ServiceException("暂未实现 listUser");
    }


    private void requireNotNullId(String id) {
        ServiceUtil.requireNotNullId(id, ExceptionConstant.User.ID_REQUIRED);
    }
}
