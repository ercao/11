package cn.edu.ysu.music.framework.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.net.JarURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

/**
 * 类操作工具类
 *
 * @author
 */
@Slf4j
public final class ClassUtil {
    /**
     * 获取类加载器
     */
    public static ClassLoader getClassLoader() {
        return Thread.currentThread().getContextClassLoader();
    }

    /**
     * 加载类
     *
     * @param className     全类名
     * @param isInitialized 是否初始化
     */
    public static Class<?> loadClass(String className, boolean isInitialized) {
        Class<?> clazz = null;
        try {
            clazz = Class.forName(className, isInitialized, getClassLoader());
        } catch (Exception e) {
            log.error("类加载失败", e);
            throw new RuntimeException(e);
        }
        return clazz;
    }

    /**
     * 加载并初始化类
     *
     * @param className 全类名
     */
    public static Class<?> loadClass(String className) {
        log.info(className);
        return loadClass(className, true);
    }


    /**
     * 获取包名下所有类集合
     *
     * @param packageName 包名
     */
    public static Set<Class<?>> getClassSet(String packageName) {
        Set<Class<?>> classSet = new HashSet<>();
        try {
            Enumeration<URL> urls = getClassLoader().getResources(packageName.replace('.', '/'));
            while (urls.hasMoreElements()) {
                URL url = urls.nextElement();
                if (url == null) {
                    continue;
                }

                String protocol = url.getProtocol();
                if ("file".equalsIgnoreCase(protocol)) {
                    String packagePath = url.getPath().replace("%20", " ");
                    addClass(classSet, packagePath, packageName);
                } else if ("jar".equalsIgnoreCase(protocol)) {
                    JarURLConnection jarUrlConnection = (JarURLConnection) url.openConnection();
                    if (jarUrlConnection == null) {
                        continue;
                    }

                    JarFile jarFile = jarUrlConnection.getJarFile();
                    if (jarFile == null) {
                        continue;
                    }

                    Enumeration<JarEntry> jarEntries = jarFile.entries();
                    while (jarEntries.hasMoreElements()) {
                        JarEntry jarEntry = jarEntries.nextElement();
                        String jarEntryName = jarEntry.getName();
                        if (!jarEntryName.endsWith(".class")) {
                            continue;
                        }

                        String className = jarEntryName.substring(0, jarEntryName.lastIndexOf('.')).replace("/", ".");
                        doAddClass(classSet, className);
                    }
                }
            }
        } catch (Exception e) {
            log.error("获取类集合失败", e);
            throw new RuntimeException(e);
        }
        return classSet;
    }

    /**
     * 递归将包下所有类加入到包集合中
     *
     * @param classSet    包集合
     * @param packagePath 包路径
     * @param packageName 包名
     */
    private static void addClass(Set<Class<?>> classSet, String packagePath, String packageName) {
        File[] files = new File(packagePath).listFiles(file -> ((file.isFile() && file.getName().endsWith(".class")) || file.isDirectory()));

        assert files != null;
        for (var file : files) {
            String fileName = file.getName();
            if (file.isFile()) {
                String className = fileName.substring(0, fileName.lastIndexOf('.'));
                if (StringUtils.isNotEmpty(packageName)) {
                    className = packageName + '.' + className;
                }
                doAddClass(classSet, className);
            } else {
                String subPackagePath = fileName;
                if (StringUtils.isNotEmpty(packagePath)) {
                    subPackagePath = packagePath + '/' + subPackagePath;
                }

                String subPackageName = fileName;
                if (StringUtils.isNotEmpty(packageName)) {
                    subPackageName = packageName + '.' + subPackageName;
                }
                addClass(classSet, subPackagePath, subPackageName);
            }
        }
    }

    /**
     * 添加到类集合中
     *
     * @param classSet  类集合
     * @param className 包路径
     */
    private static void doAddClass(Set<Class<?>> classSet, String className) {
        classSet.add(loadClass(className, false));
    }

}
