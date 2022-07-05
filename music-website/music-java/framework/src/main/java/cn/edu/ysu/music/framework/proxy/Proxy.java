package cn.edu.ysu.music.framework.proxy;

/**
 * 代理接口
 *
 * @author author
 */
public interface Proxy {
    /**
     * 代理
     *
     * @param proxyChain 代理链
     * @return return
     * @throws Throwable throwable
     */
    Object doProxy(ProxyChain proxyChain) throws Throwable;
}
