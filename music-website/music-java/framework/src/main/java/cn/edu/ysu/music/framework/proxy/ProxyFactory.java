package cn.edu.ysu.music.framework.proxy;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;

import java.util.List;

/**
 * 代理工厂
 *
 * @author author
 */
public class ProxyFactory {

    /**
     * 通过目标类和一组代理接口生成ProxyChain实例
     *
     * @param targetClass targetClass
     * @param proxyList   代理列表
     * @param <T>         <T>
     * @return ProxyChain
     */
    @SuppressWarnings("unchecked")
    public static <T> T createProxy(final Class<?> targetClass, final List<Proxy> proxyList) {
        return (T) Enhancer.create(targetClass, (MethodInterceptor) (obj, method, args, proxy) ->
                new ProxyChain(targetClass, obj, method, proxy, args, proxyList).doProxyChain());
    }

}
