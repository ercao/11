package cn.edu.ysu.music.api.controller.api;

import cn.edu.ysu.music.api.entity.Album;
import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Result;
import cn.edu.ysu.music.api.entity.Song;
import cn.edu.ysu.music.api.interceptor.RequiredRole;
import cn.edu.ysu.music.api.interceptor.Role;
import cn.edu.ysu.music.api.service.AlbumService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.util.ControllerUtil;
import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.bean.Param;

import java.util.List;

/**
 * 专辑控制器
 *
 * @author ercao
 */
@Controller("/api")
public class AlbumController {

    @Autowired
    AlbumService albumService;

    @Autowired
    SongService songService;


    /**
     * 分页获取专辑
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/albums")
    @ResponseBody
    public Result<Page<Album>> list(@RequestParam Param param) {
        return Result.success(albumService.list(ControllerUtil.parsePage(param), ControllerUtil.parseSize(param)));
    }

    /**
     * 随机返回
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/albums/random")
    @ResponseBody
    public Result<List<Album>> listRandom(@RequestParam Param param) {
        return Result.success(albumService.listRandom(ControllerUtil.parseSize(param, 3)));
    }

    /**
     * 获取专辑详情
     *
     * @param param param
     * @return return
     */
    @RequestMapping(value = "/album", method = RequestMethod.GET)
    @ResponseBody
    public Result<Album> get(@RequestParam Param param) {
        return Result.success(albumService.get(ControllerUtil.parseId(param)));
    }

    /**
     * 添加专辑
     *
     * @param album album
     * @return return
     */
    @RequestMapping(value = "/album", method = RequestMethod.POST)
    @ResponseBody
    @RequiredRole(Role.Admin)
    public Result<Album> add(@RequestBody Album album) {
        albumService.add(album);

        return Result.success("添加专辑成功");
    }


    /**
     * 编辑专辑信息
     *
     * @param album album
     * @return return
     */
    @RequestMapping(value = "/album", method = RequestMethod.PUT)
    @ResponseBody
    @RequiredRole(Role.Admin)
    public Result<Album> update(@RequestBody Album album) {
        albumService.update(album);

        return Result.success("修改专辑成功");
    }

    /**
     * 删除专辑
     *
     * @param id id
     * @return return
     */
    @RequestMapping(value = "/album", method = RequestMethod.DELETE)
    @ResponseBody
    @RequiredRole(Role.Admin)
    public Result<Album> delete(@RequestBody String id) {
        albumService.remove(id);
        return Result.success("删除专辑成功");
    }

    /**
     * 获取专辑所有歌曲
     *
     * @param param param
     * @return return
     */
    @RequestMapping(value = "/album/songs")
    @ResponseBody
    public Result<List<Song>> songs(@RequestParam Param param) {
        return Result.success(songService.listByAlbum(ControllerUtil.parseId(param)));
    }
}
