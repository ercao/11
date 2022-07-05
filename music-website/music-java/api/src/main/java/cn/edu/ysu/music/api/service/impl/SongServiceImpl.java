package cn.edu.ysu.music.api.service.impl;

import cn.edu.ysu.music.api.constant.ExceptionConstant;
import cn.edu.ysu.music.api.dao.SongDao;
import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Song;
import cn.edu.ysu.music.api.exception.ServiceException;
import cn.edu.ysu.music.api.service.AlbumService;
import cn.edu.ysu.music.api.service.ArtistService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.util.ServiceUtil;
import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.annotion.Service;
import cn.edu.ysu.music.framework.annotion.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 歌曲业务类
 *
 * @author ercao
 */
@Service
public class SongServiceImpl implements SongService {

    @Autowired
    SongDao songDao;

    @Autowired
    AlbumService albumService;

    @Autowired
    ArtistService artistService;

    @Override
    @Transactional
    public void add(Song song) {
        song.setUuid(UUID.randomUUID().toString());

        ServiceUtil.requireTrue(songDao.insert(song), ExceptionConstant.Song.ADD_FAILED);
    }

    @Override
    @Transactional
    public void remove(String uuid) {
        requireNotNullId(uuid);

        ServiceUtil.requireTrue(songDao.delete(uuid), ExceptionConstant.Song.REMOVE_FAILED);
    }

    @Override
    @Transactional
    public void update(Song song) {
        requireNotNullId(song.getUuid());

        // 移除不能修改的成员属性
        song.setArtistList(null);
        song.setAlbumEntity(null);

        ServiceUtil.requireTrue(songDao.update(song), ExceptionConstant.Song.UPDATE_FAILED);
    }

    @Override
    @Transactional
    public void updateBatch(String[] ids, Song song) {
        checkExist(ids);
        song.setUuid(null);
        song.setAlbumEntity(null);
        song.setArtistList(null);

        ServiceUtil.requireTrue(songDao.updateBatch(ids, song), ExceptionConstant.Song.UPDATE_FAILED);
    }

    @Override
    public void checkExist(String[] songs) {
        if (songs.length != songDao.checkExist(songs)) {
            throw new ServiceException(ExceptionConstant.Song.NOT_EXIST);
        }
    }

    @Override
    public Song get(String id) {
        requireNotNullId(id);

        Song song = songDao.selectEntityById(id);
        if (song == null) {
            throw new ServiceException(ExceptionConstant.Song.NOT_EXIST);
        }
        fillSong(song);
        return song;
    }

    @Override
    public Page<Song> list(int page, int size) {
        var total = songDao.total();
        size = (int) ServiceUtil.checkSize(size, total);
        page = (int) ServiceUtil.checkPage(page, size, total);

        var songs = songDao.selectList(page, size);
        songs.forEach(this::fillSong);
        return new Page<>(page, total, size, songs);
    }

    @Override
    public List<Song> listRandom(int size) {
        long total = songDao.total();
        if (total < 1) {
            return new ArrayList<>();
        }


        List<Song> songs = songDao.selectList((int) (Math.random() * (total / size)), size);
        songs.forEach(this::fillSong);
        return songs;
    }

    @Override
    public List<Song> listByArtist(String artist) {
        if (StringUtils.isEmpty(artist)) {
            return new ArrayList<>();
        }

        List<Song> songs = songDao.selectListByArtist(artist);
        songs.forEach(this::fillSong);
        return songs;
    }

    @Override
    public List<Song> listByAlbum(String album) {
        if (StringUtils.isEmpty(album)) {
            return new ArrayList<>();
        }

        List<Song> songs = songDao.selectListByAlbum(album);
        songs.forEach(this::fillSong);
        return songs;
    }

    @Override
    public List<Song> listByPlaylist(String playlist) {
        if (StringUtils.isEmpty(playlist)) {
            return new ArrayList<>();
        }

        List<Song> songs = songDao.selectListByPlaylist(playlist);
        songs.forEach(this::fillSong);
        return songs;
    }


    @Override
    public List<Song> list(String[] ids) {
        if (ArrayUtils.isEmpty(ids)) {
            return new ArrayList<>();
        }

        checkExist(ids);
        List<Song> songs = songDao.selectList(ids);
        songs.forEach(this::fillSong);
        return songs;
    }

    /**
     * 填充歌曲实体
     *
     * @param song song
     */
    private void fillSong(Song song) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // 填充专辑
            if (StringUtils.isNotEmpty(song.getAlbum())) {
                song.setAlbumEntity(albumService.get(song.getAlbum()));
            }

            // 填充歌手数组
            String[] artists = mapper.readValue(song.getArtists(), String[].class);
            song.setArtistList(artistService.list(artists));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void requireNotNullId(String id) {
        ServiceUtil.requireNotNullId(id, ExceptionConstant.Song.ID_REQUIRED);
    }
}
