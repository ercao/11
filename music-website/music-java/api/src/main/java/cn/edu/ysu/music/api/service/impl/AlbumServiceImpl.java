package cn.edu.ysu.music.api.service.impl;

import cn.edu.ysu.music.api.constant.ExceptionConstant;
import cn.edu.ysu.music.api.dao.AlbumDao;
import cn.edu.ysu.music.api.entity.Album;
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
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 专辑业务实现类
 *
 * @author ercao
 */
@Service
@Slf4j
public class AlbumServiceImpl implements AlbumService {

    @Autowired
    AlbumDao albumDao;

    @Autowired
    SongService songService;

    @Autowired
    ArtistService artistService;

    @Override
    @Transactional
    public void add(Album album) {
        album.setUuid(UUID.randomUUID().toString());
        album.setCreateTime(LocalDateTime.now());

        if (!albumDao.insert(album)) {
            throw new ServiceException(ExceptionConstant.Album.ADD_FAILED);
        }
    }


    @Override
    @Transactional
    public void remove(String id) {
        requireNotNullId(id);

        List<Song> songs = songService.listByAlbum(id);
        // 更新歌曲专辑信息
        songService.updateBatch(
                (String[]) songs.stream().map(Song::getUuid).toArray()
                , new Song.Builder().withAlbum(id).build());

        if (!albumDao.delete(id)) {
            throw new ServiceException(ExceptionConstant.Album.REMOVE_FAILED);
        }
    }

    @Override
    public void update(Album album) {
        throw new ServiceException("暂不支持更新专辑信息");
    }

    @Override
    public Album get(String id) {
        requireNotNullId(id);

        Album album = albumDao.selectEntityById(id);
        if (album == null) {
            throw new ServiceException(ExceptionConstant.Album.NOT_EXIST);
        }

        fillAlbum(album);
        return album;
    }

    @Override
    public Page<Album> list(int page, int size) {
        long total = albumDao.total();
        List<Album> albums = albumDao.selectList((int) ServiceUtil.checkPage(page, size, total), (int) ServiceUtil.checkSize(size, total));
        albums.forEach(this::fillAlbum);
        return new Page<>(page, total, size, albums);
    }

    @Override
    public List<Album> listByArtist(String artistId) {
        if (StringUtils.isEmpty(artistId)) {
            return new ArrayList<>();
        }

        List<Album> albums = albumDao.selectListByArtist(artistId);
        albums.forEach(this::fillAlbum);
        return albums;
    }

    @Override
    public List<Album> listRandom(int size) {
        long total = albumDao.total();
        List<Album> albums = albumDao.selectList((int) (Math.random() * (total / size)), size);
        albums.forEach(this::fillAlbum);
        return albums;
    }


    /**
     * 填充专辑信息
     *
     * @param album album
     */
    private void fillAlbum(Album album) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String[] artists = mapper.readValue(album.getArtists(), String[].class);
            album.setArtistList(artistService.list(artists));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void requireNotNullId(String id) {
        ServiceUtil.requireNotNullId(id, ExceptionConstant.Album.ID_REQUIRED);
    }

}
