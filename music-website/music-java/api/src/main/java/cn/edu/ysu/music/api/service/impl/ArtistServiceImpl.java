package cn.edu.ysu.music.api.service.impl;

import cn.edu.ysu.music.api.constant.ExceptionConstant;
import cn.edu.ysu.music.api.dao.ArtistDao;
import cn.edu.ysu.music.api.entity.Artist;
import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.exception.ServiceException;
import cn.edu.ysu.music.api.service.ArtistService;
import cn.edu.ysu.music.api.service.UserService;
import cn.edu.ysu.music.api.util.ServiceUtil;
import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.annotion.Service;
import cn.edu.ysu.music.framework.annotion.Transactional;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 歌手业务类
 *
 * @author ercao
 */
@Service
public class ArtistServiceImpl implements ArtistService {

    @Autowired
    ArtistDao artistDao;

    @Autowired
    UserService userService;

    @Override
    @Transactional
    public void add(Artist artist) {
        artist.setUuid(UUID.randomUUID().toString());

        ServiceUtil.requireTrue(artistDao.insert(artist), ExceptionConstant.Artist.ADD_FAILED);
    }

    @Override
    @Transactional
    public void remove(String uuid) {
        requireNotNullId(uuid);

        ServiceUtil.requireTrue(artistDao.delete(uuid), ExceptionConstant.Artist.REMOVE_FAILED);
    }

    @Override
    @Transactional
    public void update(Artist artist) {
        requireNotNullId(artist.getUser());

        // 移除不能修改的属性
        artist.setUserEntity(null);

        ServiceUtil.requireTrue(artistDao.update(artist), ExceptionConstant.Artist.UPDATE_FAILED);
    }

    @Override
    public Artist get(String id) {
        requireNotNullId(id);

        Artist artist = artistDao.selectEntityById(id);
        if (artist == null) {
            throw new ServiceException(ExceptionConstant.Artist.NOT_EXIST);
        }

        fillAlbum(artist);
        return artist;
    }

    @Override
    public Page<Artist> list(int page, int size) {
        long total = artistDao.total();

        List<Artist> artists = new ArrayList<>();
        if (total > 0) {
            artists = artistDao.selectList((int) ServiceUtil.checkPage(page, size, total), (int) ServiceUtil.checkSize(size, total));
            artists.forEach(this::fillAlbum);
        }
        return new Page<>(page, total, size, artists);
    }

    @Override
    public List<Artist> listRandom(int size) {
        long total = artistDao.total();

        if (total < 1) {
            return new ArrayList<>();
        }
        List<Artist> artists = artistDao.selectList((int) (Math.random() * (total / size)), size);
        artists.forEach(this::fillAlbum);
        return artists;
    }

    @Override
    public List<Artist> list(String[] ids) {
        if (ArrayUtils.isEmpty(ids)) {
            return new ArrayList<>();
        }

        if (artistDao.checkExist(ids) != ids.length) {
            throw new ServiceException(ExceptionConstant.Artist.NOT_EXIST);
        }
        List<Artist> artists = artistDao.selectList(ids);
        artists.forEach(this::fillAlbum);
        return artists;
    }

    private void requireNotNullId(String id) {
        ServiceUtil.requireNotNullId(id, ExceptionConstant.Artist.ID_REQUIRED);
    }

    /**
     * 填充歌手信息
     *
     * @param artist artist
     */
    private void fillAlbum(Artist artist) {
        // 填充用户实体
        if (StringUtils.isNotEmpty(artist.getUser())) {
            artist.setUserEntity(userService.get(artist.getUser()));
        }
    }
}
