package cn.edu.ysu.music.api.controller.api;

import cn.edu.ysu.music.api.entity.*;
import cn.edu.ysu.music.api.service.AlbumService;
import cn.edu.ysu.music.api.service.ArtistService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.util.ControllerUtil;
import cn.edu.ysu.music.framework.annotion.*;
import cn.edu.ysu.music.framework.bean.Param;

import java.util.List;

/**
 * 歌手
 *
 * @author ercao
 */
@Controller("/api")
public class ArtistController {

    @Autowired
    ArtistService artistService;

    @Autowired
    AlbumService albumService;

    @Autowired
    SongService songService;


    /**
     * 分页返回所有歌手
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/artists")
    @ResponseBody
    public Result<Page<Artist>> list(@RequestParam Param param) {
        return Result.success(artistService.list(ControllerUtil.parsePage(param), ControllerUtil.parseSize(param)));
    }


    /**
     * 随机返回歌手列表
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/artists/random")
    @ResponseBody
    public Result<List<Artist>> listRandom(@RequestParam Param param) {
        return Result.success(artistService.listRandom(ControllerUtil.parseSize(param, 3)));
    }

    /**
     * 获取歌手
     *
     * @param param param
     * @return return
     */
    @RequestMapping("/artist")
    @ResponseBody
    public Result<Artist> get(@RequestParam Param param) {
        return Result.success(artistService.get(ControllerUtil.parseId(param)));
    }

    /**
     * 获取歌手所有专辑
     *
     * @param param param
     * @return return
     */
    @RequestMapping(value = "/artist/albums", method = RequestMethod.GET)
    @ResponseBody
    public Result<List<Album>> albums(@RequestParam Param param) {
        return Result.success(albumService.listByArtist(ControllerUtil.parseId(param)));
    }

    /**
     * 获取歌手所有歌曲
     *
     * @param param param
     * @return return
     */
    @RequestMapping(value = "/artist/songs", method = RequestMethod.GET)
    @ResponseBody
    public Result<List<Song>> songs(@RequestParam Param param) {
        return Result.success(songService.listByArtist(ControllerUtil.parseId(param)));
    }
}
