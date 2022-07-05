package cn.edu.ysu.music.framework.helper;

import cn.edu.ysu.music.framework.annotion.Aspect;
import cn.edu.ysu.music.framework.proxy.AbstractAspectProxy;
import cn.edu.ysu.music.framework.proxy.Proxy;
import cn.edu.ysu.music.framework.proxy.ProxyFactory;
import cn.edu.ysu.music.framework.proxy.TransactionProxy;
import cn.edu.ysu.music.framework.util.ClassUtil;
import cn.edu.ysu.music.framework.util.ReflectionUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.*;

/**
 * AOP 助手类
 *
 * @author author
 */
@Slf4j
public class AopHelper {

    static {
        try {
            createTargetMap(createProxyMap()).forEach((targetClass, prosyList) -> {
                Object proxy = ProxyFactory.createProxy(targetClass, prosyList);

                // IOC容器 替换为代理对象
                BeanHelper.setBean(targetClass, proxy);
            });
        } catch (Exception e) {
            log.error("AOP 失败", e);
            throw new RuntimeException(e);
        }

    }

    /**
     * 获取 代理类-目标类映射
     *
     * @return return
     * @throws Exception exception
     */
    private static Map<Class<? extends Proxy>, Set<Class<?>>> createProxyMap() throws Exception {
        Map<Class<? extends Proxy>, Set<Class<?>>> proxyMap = new HashMap<>();
        addAspectProxy(proxyMap);
        addTransactionProxy(proxyMap);
        return proxyMap;
    }

    /**
     * 添加切面代理
     *
     * @param proxyMap proxyMap
     */
    private static void addAspectProxy(Map<Class<? extends Proxy>, Set<Class<?>>> proxyMap) {
        ClassHelper.getClassSetBySuper(AbstractAspectProxy.class).forEach((proxyClass) -> {
            if (!proxyClass.isAnnotationPresent(Aspect.class)) {
                return;
            }

            Aspect aspect = proxyClass.getAnnotation(Aspect.class);
            String packageName = aspect.pkg();
            String className = aspect.cls();


            Set<Class<?>> targetClassSet = new HashSet<>();
            if (!StringUtils.isNotEmpty(className)) {
                // 添加该包下的所有类
                targetClassSet.addAll(ClassUtil.getClassSet(packageName));
            } else {
                targetClassSet.add(ClassUtil.loadClass(packageName + "." + className));
            }
            proxyMap.put(proxyClass, targetClassSet);
        });
    }

    /**
     * 添加事务代理
     *
     * @param proxyMap proxyMap
     */
    private static void addTransactionProxy(Map<Class<? extends Proxy>, Set<Class<?>>> proxyMap) {
        proxyMap.put(TransactionProxy.class, ClassHelper.getServiceClassSet());
    }

    /**
     * 生成 目标类-代理对象列表 Map
     *
     * @param proxyMap proxyMap
     */
    private static Map<Class<?>, List<Proxy>> createTargetMap(Map<Class<? extends Proxy>, Set<Class<?>>> proxyMap) {
        Map<Class<?>, List<Proxy>> targetMap = new HashMap<>();
        proxyMap.forEach((proxyClass, targetClassSet) -> {
            targetClassSet.forEach((targetClass) -> {
                Proxy proxy = ReflectionUtil.newInstance(proxyClass);
                if (targetMap.containsKey(targetClass)) {
                    targetMap.get(targetClass).add(proxy);
                } else {
                    ArrayList<Proxy> proxyList = new ArrayList<>();
                    proxyList.add(proxy);
                    targetMap.put(targetClass, proxyList);
                }
            });
        });
        return targetMap;
    }

}
