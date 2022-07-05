package cn.edu.ysu.music.framework.proxy;

import cn.edu.ysu.music.framework.annotion.Transactional;
import cn.edu.ysu.music.framework.helper.DatabaseHelper;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Method;

/**
 * 数据库事务代理
 *
 * @author author
 */
@Slf4j
public class TransactionProxy implements Proxy {

    @Override
    public Object doProxy(ProxyChain proxyChain) throws Throwable {
        Object result = null;

        Method method = proxyChain.getTargetMethod();

        if (!method.isAnnotationPresent(Transactional.class)) {
            result = proxyChain.doProxyChain();
        } else {
            try {
                DatabaseHelper.beginTransaction();
                result = proxyChain.doProxyChain();
                DatabaseHelper.commitTransaction();
            } catch (Exception e) {
                DatabaseHelper.rollbackTransaction();
                throw e;
            }
        }
        return result;
    }
}
