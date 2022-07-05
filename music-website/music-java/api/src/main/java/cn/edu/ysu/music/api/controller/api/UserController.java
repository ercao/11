package cn.edu.ysu.music.api.controller.api;

import cn.edu.ysu.music.api.entity.Playlist;
import cn.edu.ysu.music.api.entity.Result;
import cn.edu.ysu.music.api.entity.User;
import cn.edu.ysu.music.api.interceptor.RequiredRole;
import cn.edu.ysu.music.api.interceptor.Role;
import cn.edu.ysu.music.api.service.PlayListService;
import cn.edu.ysu.music.api.service.UserService;
import cn.edu.ysu.music.api.util.ControllerUtil;
import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.bean.Param;

import java.util.List;

/**
 * 用户控制器
 *
 * @author ercao
 */
@Controller("/api")
public class UserController {
    @Autowired
    PlayListService playListService;

    @Autowired
    UserService userService;

    /**
     * 用户登陆
     *
     * @param user user
     * @return return
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public Result<String> login(@RequestBody User user) {
        return Result.success("登陆成功", userService.login(user));
    }

    /**
     * 获取用户的详细信息
     *
     * @param param param
     * @return return
     */
    @RequestMapping(value = "/user", method = RequestMethod.GET)
    @ResponseBody
    @RequiredRole
    public Result<User> get(@RequestParam Param param) {
        String id = ControllerUtil.parseId(param);
        return Result.success(userService.get(id));
    }

    /**
     * 获取用户的所有歌单
     *
     * @param param param
     * @return return
     */
    @RequestMapping(value = "/user/playlists", method = RequestMethod.GET)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<List<Playlist>> list(@RequestParam Param param) {
        String id = ControllerUtil.parseId(param);
        return Result.success(playListService.listByUser(id));
    }
}
