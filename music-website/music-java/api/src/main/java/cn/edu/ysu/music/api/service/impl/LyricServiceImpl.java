package cn.edu.ysu.music.api.service.impl;

import cn.edu.ysu.music.api.constant.ExceptionConstant;
import cn.edu.ysu.music.api.dao.LyricDao;
import cn.edu.ysu.music.api.entity.Lyric;
import cn.edu.ysu.music.api.service.LyricService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.util.ServiceUtil;
import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.annotion.Service;
import cn.edu.ysu.music.framework.annotion.Transactional;

/**
 * 歌词业务类
 *
 * @author ercao
 */
@Service
public class LyricServiceImpl implements LyricService {

    @Autowired
    LyricDao lyricDao;

    @Autowired
    SongService songService;


    @Override
    @Transactional
    public void add(Lyric lyric) {
        songService.checkExist(new String[]{lyric.getSong()});

        ServiceUtil.requireTrue(lyricDao.insert(lyric), ExceptionConstant.Lyric.ADD_FAILED);
    }

    @Override
    @Transactional
    public void remove(String uuid) {
        requireNotNullId(uuid);

        ServiceUtil.requireTrue(lyricDao.delete(uuid), ExceptionConstant.Lyric.REMOVE_FAILED);
    }

    @Override
    @Transactional
    public void update(Lyric lyric) {
        requireNotNullId(lyric.getSong());

        ServiceUtil.requireTrue(lyricDao.update(lyric), ExceptionConstant.Lyric.UPDATE_FAILED);
    }

    @Override
    public Lyric get(String uuid) {
        requireNotNullId(uuid);

        return lyricDao.selectEntityById(uuid);
    }


    private void requireNotNullId(String id) {
        ServiceUtil.requireNotNullId(id, ExceptionConstant.Lyric.ID_REQUIRED);
    }
}
