package cn.edu.ysu.music.framework.proxy;

import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Method;

/**
 * 切面代理
 *
 * @author author
 */
@Slf4j
public abstract class AbstractAspectProxy implements Proxy {

    @Override
    public final Object doProxy(ProxyChain proxyChain) throws Throwable {
        Class<?> clazz = proxyChain.getTargetClass();
        Method method = proxyChain.getTargetMethod();
        Object[] params = proxyChain.getMethodParams();
        Object result = null;

        begin();
        try {
            boolean flag = intercept(method, params);
            if (flag) {
                before(method, params);
                result = proxyChain.doProxyChain();
                after(method, params);
            } else {

                result = proxyChain.doProxyChain();
            }
        } catch (Exception e) {
            throw e;
        } finally {
            end();
        }
        return result;
    }

    /**
     * 开始增强
     */
    public abstract void begin();

    /**
     * 切入点判断
     *
     * @param method method
     * @param params params
     * @return return
     */
    public abstract boolean intercept(Method method, Object[] params) throws Throwable;

    /**
     * 前置增强
     *
     * @param method method
     * @param params params
     * @throws Throwable throwable
     */
    public abstract void before(Method method, Object[] params) throws Throwable;


    /**
     * 后置增强
     *
     * @param method method
     * @param params params
     * @throws Throwable throwable
     */
    public abstract void after(Method method, Object[] params) throws Throwable;

    /**
     * 异常增强
     *
     * @param method method
     * @param params params
     * @throws Throwable throwable
     */
    public abstract void error(Method method, Object[] params) throws Throwable;

    /**
     * 最终增强
     */
    public abstract void end();

}
