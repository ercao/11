package cn.edu.ysu.music.api.interceptor;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static cn.edu.ysu.music.api.interceptor.Role.User;

/**
 * 权限注解
 *
 * @author ercao
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiredRole {
    Role value() default User;
}
