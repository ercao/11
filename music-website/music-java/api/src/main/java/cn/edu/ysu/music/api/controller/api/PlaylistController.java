package cn.edu.ysu.music.api.controller.api;

import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Playlist;
import cn.edu.ysu.music.api.entity.Result;
import cn.edu.ysu.music.api.entity.Song;
import cn.edu.ysu.music.api.interceptor.RequiredRole;
import cn.edu.ysu.music.api.interceptor.Role;
import cn.edu.ysu.music.api.service.PlayListService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.util.ControllerUtil;
import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.bean.Param;

import java.util.List;

/**
 * 歌单控制器
 *
 * @author ercao
 */
@Controller("/api")
public class PlaylistController {

    @Autowired
    PlayListService playListService;

    @Autowired
    SongService songService;


    /**
     * 分页获取所有歌单列表
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/playlists")
    @ResponseBody
    public Result<Page<Playlist>> list(@RequestParam Param param) {
        int page = ControllerUtil.parsePage(param);
        int size = ControllerUtil.parseSize(param);
        String tag = ControllerUtil.parseTag(param);

        return Result.success(playListService.list(tag, page, size));
    }


    /**
     * 随机获取歌单
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/playlists/random")
    @ResponseBody
    public Result<List<Playlist>> listRandom(@RequestParam Param param) {

        int size = ControllerUtil.parseSize(param);
        String tag = ControllerUtil.parseTag(param);


        return Result.success(playListService.listRandom(tag, size));
    }

    /**
     * 获取所有歌单标签
     *
     * @param param param
     */
    @RequestMapping("/playlists/tags")
    @ResponseBody
    public Result<List<Playlist.Tag>> tagList(@RequestParam Param param) {
        return Result.success(playListService.listAllTags());
    }

    /**
     * 获取歌单详情
     *
     * @param param 请求参数
     */
    @RequestMapping("/playlist")
    @ResponseBody
    public Result<Playlist> get(@RequestParam Param param) {
        return Result.success(playListService.get(ControllerUtil.parseId(param)));
    }

    /**
     * 添加歌单
     *
     * @param playlist playlist
     * @return return
     */
    @RequestMapping(value = "/playlist", method = RequestMethod.POST)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Object> add(@RequestBody Playlist playlist) {
        playListService.add(playlist);

        return Result.success("添加歌单成功");
    }

    /**
     * 删除歌单
     *
     * @param id id
     * @return return
     */
    @RequestMapping(value = "/playlist", method = RequestMethod.DELETE)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Object> remove(@RequestBody String id) {
        playListService.remove(id);

        return Result.success("删除歌单成功");
    }

    /**
     * 修改歌歌单信息
     *
     * @param playlist playlist
     * @return return
     */
    @RequestMapping(value = "/playlist", method = RequestMethod.PUT)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Object> update(@RequestBody Playlist playlist) {
        playListService.update(playlist);

        return Result.success("修改歌单成功");
    }

    /**
     * 获取歌单的所有歌曲
     *
     * @param param param
     */
    @RequestMapping(value = "/playlist/songs", method = RequestMethod.GET)
    @ResponseBody
    public Result<List<Song>> songs(@RequestParam Param param) {

        return Result.success(songService.listByPlaylist(ControllerUtil.parseId(param)));
    }

    /**
     * 添加歌单歌曲
     *
     * @param param param
     * @param songs songs
     */
    @RequestMapping(value = "/playlist/songs", method = RequestMethod.POST)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Playlist> addSongs(@RequestParam Param param, @RequestBody String[] songs) {
        String id = ControllerUtil.parseId(param);

        playListService.addSongs(id, songs);
        return Result.success("成功添加" + songs.length + "个歌曲");
    }

    /**
     * 删除歌单歌曲
     *
     * @param param param
     * @param songs songs
     */
    @RequestMapping(value = "/playlist/songs", method = RequestMethod.DELETE)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Playlist> removeSongs(@RequestParam Param param, @RequestBody String[] songs) {
        String id = ControllerUtil.parseId(param);

        playListService.removeSongs(id, songs);
        return Result.success("成功删除" + songs.length + "个歌曲");
    }

    /**
     * 添加歌单标签
     *
     * @param param param
     * @param tags  tags
     */
    @RequestMapping(value = "/playlist/tags", method = RequestMethod.POST)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Playlist> addTag(@RequestParam Param param, @RequestBody String[] tags) {
        String id = ControllerUtil.parseId(param);

        playListService.addTags(id, tags);
        return Result.success("成功添加" + tags.length + "个标签");
    }


    /**
     * 删除歌单标签
     *
     * @param param param
     * @param tags  tags
     */
    @RequestMapping(value = "/playlist/tags", method = RequestMethod.DELETE)
    @ResponseBody
    @RequiredRole(Role.User)
    public Result<Playlist> removeTag(@RequestParam Param param, @RequestBody String[] tags) {
        String id = ControllerUtil.parseId(param);

        playListService.removeTags(id, tags);
        return Result.success("成功删除" + tags.length + "个标签");
    }
}
