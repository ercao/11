package cn.edu.ysu.music.api.interceptor;

import cn.edu.ysu.music.api.exception.AuthException;
import cn.edu.ysu.music.api.service.UserService;
import cn.edu.ysu.music.framework.InterceptorHandler;
import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.annotion.Interceptor;
import cn.edu.ysu.music.framework.bean.Handler;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

/**
 * 认证
 *
 * @author ercao
 */
@Interceptor(priority = 1000)
public class AuthInterceptor implements InterceptorHandler {

    private static final String AUTH_FLAG = "Bearer";
    @Autowired
    UserService userService;

    @Override
    public boolean preHandler(HttpServletRequest req, HttpServletResponse res, Handler handler) {

        RequiredRole auth = handler.getMethod().getAnnotation(RequiredRole.class);
        if (auth == null) {
            auth = handler.getClazz().getAnnotation(RequiredRole.class);
        }
        if (auth == null) {
            return true;
        }

        try {
            // 是否登陆
            String token = req.getHeader("Authorization");
            if (StringUtils.isEmpty(token)) {
                throw new AuthException("用户未登陆");
            }

            token = token.substring(token.lastIndexOf(AUTH_FLAG) + AUTH_FLAG.length()).trim();
            DecodedJWT decode = JWT.decode(token);
            if (decode.getExpiresAt().before(new Date())) {
                throw new AuthException("Token 过期");
            }

            userService.verificationToken(token);
            String role = decode.getClaim("role").asString();
            if (Role.Admin.value.equals(role)) {
                return true;
            }

            if (!auth.value().value.equalsIgnoreCase(role)) {
                throw new AuthException("无权限");
            }

            // TODO: 更新 Token
            return true;
        } catch (JWTDecodeException e) {
            throw new AuthException("Token 无效");
        }
    }
}
