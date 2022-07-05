package cn.edu.ysu.music.api.controller.api;

import cn.edu.ysu.music.api.entity.Lyric;
import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Result;
import cn.edu.ysu.music.api.entity.Song;
import cn.edu.ysu.music.api.interceptor.RequiredRole;
import cn.edu.ysu.music.api.interceptor.Role;
import cn.edu.ysu.music.api.service.LyricService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.util.ControllerUtil;
import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.bean.Param;

import java.util.List;

/**
 * 歌曲控制器
 *
 * @author ercao
 */
@Controller("/api")
public class SongController {

    @Autowired
    SongService songService;

    @Autowired
    LyricService lyricService;

    /**
     * 分页获取所有歌曲
     *
     * @param param 请求参数
     */
    @RequestMapping("/songs")
    @ResponseBody
    public Result<Page<Song>> list(@RequestParam Param param) {
        return Result.success(songService.list(ControllerUtil.parsePage(param), ControllerUtil.parseSize(param)));
    }

    /**
     * 随机获取歌曲列表
     *
     * @param param 请求参数
     */
    @RequestMapping("/songs/random")
    @ResponseBody
    public Result<List<Song>> listRandom(@RequestParam Param param) {
        return Result.success(songService.listRandom(ControllerUtil.parseSize(param)));
    }

    /**
     * 歌曲歌曲详情
     *
     * @param param 请求参数
     */
    @RequestMapping("/song")
    @ResponseBody
    public Result<Song> get(@RequestParam Param param) {
        return Result.success(songService.get(ControllerUtil.parseId(param)));
    }


    /**
     * 添加歌词
     *
     * @param song song
     * @return return
     */
    @RequestMapping(value = "/song", method = RequestMethod.POST)
    @ResponseBody
    @RequiredRole(Role.Admin)
    public Result<Object> add(@RequestBody Song song) {
        songService.add(song);

        return Result.success("添加歌曲成功");
    }

    /**
     * 删除歌曲
     *
     * @param id id
     * @return return
     */
    @RequestMapping(value = "/song", method = RequestMethod.DELETE)
    @ResponseBody
    @RequiredRole(Role.Admin)
    public Result<Object> remove(@RequestBody String id) {
        songService.remove(id);

        return Result.success("删除歌曲成功");
    }

    /**
     * 修改歌曲
     *
     * @param song song
     * @return return
     */
    @RequestMapping(value = "/song", method = RequestMethod.PUT)
    @ResponseBody
    @RequiredRole(Role.Admin)
    public Result<Object> update(@RequestBody Song song) {
        songService.update(song);

        return Result.success("修改歌曲成功");
    }

    /**
     * 获取歌曲歌词
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/song/lyric")
    @ResponseBody
    public Result<Lyric> lyric(@RequestParam Param param) {
        String id = ControllerUtil.parseId(param);

        return Result.success(lyricService.get(id));
    }
}
