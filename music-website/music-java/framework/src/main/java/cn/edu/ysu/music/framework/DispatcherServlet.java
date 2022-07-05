package cn.edu.ysu.music.framework;

import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.bean.Handler;
import cn.edu.ysu.music.framework.bean.View;
import cn.edu.ysu.music.framework.exception.PageNotFoundException;
import cn.edu.ysu.music.framework.helper.*;
import cn.edu.ysu.music.framework.util.ReflectionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

/**
 * @author ercao
 */
@WebServlet(urlPatterns = "/*", loadOnStartup = 0)
@Slf4j
public final class DispatcherServlet extends HttpServlet {
    @Override
    public void init(ServletConfig config) throws ServletException {
        //
        HelperLoader.init();

        registerServlet(config.getServletContext());
    }

    /**
     * 注册
     *
     * @param context
     */
    private void registerServlet(ServletContext context) {
        // jsp文件路径
        ServletRegistration jsp = context.getServletRegistration("jsp");
        jsp.addMapping(ConfigHelper.getAppJspPath() + "*");

        // 静态资源路径
        ServletRegistration asset = context.getServletRegistration("default");
        asset.addMapping("/favicon.ico");
        asset.addMapping(ConfigHelper.getAppAssetPath() + "*");
    }

    @Override
    public void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String requestMethod = req.getMethod().toUpperCase();
        String requestPath = req.getPathInfo();

        Handler handler = ControllerHelper.getHandler(requestPath, requestMethod);

        PriorityQueue<InterceptorHandler> interceptorHandlers = InterceptorHelper.getInterceptorSet();
        try {
            // 允许跨域请求
            setResponseHeader(resp);
            if (RequestMethod.OPTIONS.name().equals(requestMethod)) {
                return;
            }

            // 404
            if (handler == null) {
                throw new PageNotFoundException("Request not supported");
            }

            // 前置拦截器
            if (!interceptorHandlers.stream().allMatch((predicate) -> predicate.preHandler(req, resp, handler))) {
                return;
            }

            Class<?> controllerClass = handler.getClazz();
            Object controller = BeanHelper.getBean(controllerClass);
            Method method = handler.getMethod();

            List<Object> params = new ArrayList<>();

            List.of(method.getParameters()).forEach(parameter -> {
                if (parameter.isAnnotationPresent(RequestParam.class)) {
                    // 请求参数
                    params.add(RequestHelper.parseParameters(req));
                } else if (parameter.isAnnotationPresent(RequestBody.class)) {
                    // 请求体
                    params.add(RequestHelper.parseBody(req, parameter.getType()));
                } else if (parameter.isAnnotationPresent(RequestHeader.class)) {
                    // 请求头
                    String key = parameter.getAnnotation(RequestHeader.class).value();
                    params.add(StringUtils.isEmpty(key) ? RequestHelper.parseHeaders(req) : RequestHelper.parseHeader(req, key));
                } else {
                    params.add(null);
                }
            });

            var result = ReflectionUtil.invokeMethod(controller, method, params.toArray());

            handleResult(method.isAnnotationPresent(ResponseBody.class), result, req, resp, handler);
        } catch (Exception e) {
            Throwable cause = e;
            if (e.getClass() == InvocationTargetException.class) {
                cause = e.getCause();
            }
            ExceptionHandler exceptionHandler = ExceptionHelper.getExceptionHandler(cause.getClass());

            if (exceptionHandler != null) {
                // 处理异常
                Object result = exceptionHandler.exceptionHandler(req, cause);

                handleResult(exceptionHandler.getClass().isAnnotationPresent(ResponseBody.class), result, req, resp, handler);
            } else {
                throw new RuntimeException("未处理的异常", e);
            }
        } finally {
            interceptorHandlers.forEach(
                    (predicate) -> predicate.afterCompletion(req, resp, handler));
        }
    }

    private void handleResult(boolean isResponseBody, Object result, HttpServletRequest req, HttpServletResponse res, Handler handler) throws ServletException, IOException {
        PriorityQueue<InterceptorHandler> interceptorHandlers = InterceptorHelper.getInterceptorSet();
        if (!interceptorHandlers.stream().allMatch((predicate) -> predicate.postHandler(req, res, handler))) {
            return;
        }

        if (isResponseBody) {
            handleDataResult(result, res);
        } else {
            handleViewResult(result, req, res);
        }
    }

    /**
     * 转发jsp页面
     *
     * @param view
     */
    private void handleViewResult(Object view, HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        Object path = view;

        if (view instanceof View) {
            path = ((View) view).getPath();
            ((View) view).getModel().forEach(req::setAttribute);
        }

        path += path.toString().endsWith(".jsp") ? "" : ".jsp";
        req.getRequestDispatcher(ConfigHelper.getAppJspPath() + path).forward(req, res);
    }

    private void setResponseHeader(HttpServletResponse res) throws IOException {
        res.setCharacterEncoding("UTF-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Origin,Accept, X-Requested-With, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    }

    /**
     * 返回json数据
     *
     * @param data
     */
    private void handleDataResult(Object data, HttpServletResponse res) throws IOException {
        res.setHeader("Content-Type", "application/json");

        PrintWriter writer = res.getWriter();
        // jackson 转换
        String jsonString = (new ObjectMapper()).findAndRegisterModules().writeValueAsString(data);
        writer.write(jsonString);
        writer.flush();
        writer.close();
    }
}
