package cn.edu.ysu.music.api.service.impl;

import cn.edu.ysu.music.api.constant.ExceptionConstant;
import cn.edu.ysu.music.api.dao.PlaylistDao;
import cn.edu.ysu.music.api.entity.Page;
import cn.edu.ysu.music.api.entity.Playlist;
import cn.edu.ysu.music.api.exception.ServiceException;
import cn.edu.ysu.music.api.service.PlayListService;
import cn.edu.ysu.music.api.service.SongService;
import cn.edu.ysu.music.api.service.UserService;
import cn.edu.ysu.music.api.util.ServiceUtil;
import cn.edu.ysu.music.framework.annotion.Autowired;
import cn.edu.ysu.music.framework.annotion.Service;
import cn.edu.ysu.music.framework.annotion.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 歌单控制器
 *
 * @author ercao
 */
@Service
public class PlaylistServiceImpl implements PlayListService {
    @Autowired
    PlaylistDao playlistDao;

    @Autowired
    UserService userService;

    @Autowired
    SongService songService;


    @Override
    @Transactional
    public void add(Playlist playlist) {
        ObjectMapper mapper = new ObjectMapper();


        UUID uuid = UUID.randomUUID();
        playlist.setUuid(uuid.toString());
        playlist.setCreateTime(LocalDateTime.now());
        playlist.setUpdateTime(LocalDateTime.now());

        // 处理标签
        try {
            String[] tags = mapper.readValue(playlist.getTags(), String[].class);
            var tagList = new ArrayList<>(List.of(tags));
            tagList.add("全部");
            playlist.setTags(mapper.writeValueAsString(tagList));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        ServiceUtil.requireTrue(playlistDao.insert(playlist), ExceptionConstant.Playlist.ADD_FAILED);
    }

    @Override
    @Transactional
    public void remove(String id) {
        requireNotNullId(id);

        ServiceUtil.requireTrue(playlistDao.delete(id), ExceptionConstant.Playlist.REMOVE_FAILED);
    }

    @Override
    @Transactional
    public void update(Playlist playlist) {
        requireNotNullId(playlist.getUuid());

        // 移除不能修改的成员属性
        playlist.setUserEntity(null);
        playlist.setCreateTime(null);

        // 更新修改时间
        playlist.setUpdateTime(LocalDateTime.now());

        if (StringUtils.isNoneEmpty(playlist.getTags())) {
            ObjectMapper mapper = new ObjectMapper();
            // 处理标签
            try {
                String[] tags = mapper.readValue(playlist.getTags(), String[].class);
                var tagList = Stream.of(tags).filter((tag) -> !"全部".equalsIgnoreCase(tag)).collect(Collectors.toList());
                tagList.add("全部");
                playlist.setTags(mapper.writeValueAsString(tagList));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        ServiceUtil.requireTrue(playlistDao.update(playlist), ExceptionConstant.Playlist.UPDATE_FAILED);
    }

    @Override
    @Transactional
    public void addSongs(String id, String[] songs) {
        requireNotNullId(id);
        try {
            // 检查歌曲编号是否都有效
            songService.checkExist(songs);

            ObjectMapper mapper = new ObjectMapper();
            Playlist playlist = get(id);
            Set<String> set = new HashSet<>(Set.of(mapper.readValue(playlist.getSongs(), String[].class)));
            set.addAll(List.of(songs));

            updateSongs(playlist.getUuid(), set.toArray(new String[0]));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void removeSongs(String id, String[] songs) {
        requireNotNullId(id);
        try {
            ObjectMapper mapper = new ObjectMapper();
            Playlist playlist = playlistDao.selectEntityById(id);
            Set<String> set = new HashSet<>(Set.of(mapper.readValue(playlist.getSongs(), String[].class)));
            // 删除
            List.of(songs).forEach(set::remove);
            updateSongs(playlist.getUuid(), set.toArray(new String[0]));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 修改歌单歌曲
     *
     * @param id    id
     * @param songs songs
     */
    private void updateSongs(String id, String[] songs) {
        requireNotNullId(id);
        try {
            songService.checkExist(songs);

            ObjectMapper mapper = new ObjectMapper();
            Playlist playlist = new Playlist();
            playlist.setUuid(id);
            playlist.setSongs(mapper.writeValueAsString(songs));

            try {
                update(playlist);
            } catch (ServiceException e) {
                throw new ServiceException(ExceptionConstant.Playlist.SONGS_UPDATE_FAILED);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void addTags(String id, String[] tags) {
        requireNotNullId(id);

        try {
            // 检查标签编号是否都有效
            if (tags.length != playlistDao.checkExistTag(tags)) {
                throw new ServiceException(ExceptionConstant.Playlist.TAG_INVALID);
            }

            ObjectMapper mapper = new ObjectMapper();
            Playlist playlist = playlistDao.selectEntityById(id);
            Set<String> set = new HashSet<>(Set.of(mapper.readValue(playlist.getTags(), String[].class)));
            set.addAll(List.of(tags));
            updateTags(playlist.getUuid(), set.toArray(new String[0]));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void removeTags(String id, String[] tags) {
        requireNotNullId(id);

        try {
            ObjectMapper mapper = new ObjectMapper();
            Playlist playlist = playlistDao.selectEntityById(id);
            Set<String> set = new HashSet<>(Set.of(mapper.readValue(playlist.getTags(), String[].class)));
            // 删除
            List.of(tags).forEach(set::remove);
            updateTags(playlist.getUuid(), set.toArray(new String[0]));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 修改标签
     *
     * @param id   id
     * @param tags tags
     */
    private void updateTags(String id, String[] tags) {
        requireNotNullId(id);

        try {
            ObjectMapper mapper = new ObjectMapper();

            Playlist playlist = new Playlist();
            playlist.setUuid(id);
            playlist.setTags(mapper.writeValueAsString(tags));

            try {
                update(playlist);
            } catch (ServiceException e) {
                throw new ServiceException(ExceptionConstant.Playlist.TAGS_UPDATE_FAILED);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Playlist get(String id) {
        requireNotNullId(id);

        Playlist playlist = playlistDao.selectEntityById(id);
        if (playlist == null) {
            throw new ServiceException(ExceptionConstant.Playlist.NOT_EXIST + ": " + id);
        }

        fillPlaylist(playlist);
        return playlist;
    }

    @Override
    public Page<Playlist> list(String tag, int page, int size) {
        long total = playlistDao.total(tag);
        page = (int) ServiceUtil.checkPage(page, size, total);
        size = (int) ServiceUtil.checkSize(size, total);

        List<Playlist> playlists = new ArrayList<>();
        if (total > 0) {
            playlists = playlistDao.selectList(tag, page, size);
            playlists.forEach(this::fillPlaylist);
        }
        return new Page<>(page, total, size, playlists);
    }

    @Override
    public List<Playlist.Tag> listAllTags() {
        return playlistDao.selectTagList();
    }

    @Override
    public List<Playlist> listByUser(String user) {
        if (StringUtils.isEmpty(user)) {
            return new ArrayList<>();
        }

        List<Playlist> playlists = playlistDao.selectListByUser(user);
        playlists.forEach(this::fillPlaylist);
        return playlists;
    }

    @Override
    public List<Playlist> listRandom(String tag, int size) {
        long total = playlistDao.total(tag);
        if (total < 1) {
            return new ArrayList<>();
        }

        List<Playlist> playlists = playlistDao.selectList(tag, (int) (Math.random() * (total / size)), size);
        playlists.forEach(this::fillPlaylist);
        return playlists;
    }

    /**
     * 填充歌单实体
     *
     * @param playlist playlist
     */
    private void fillPlaylist(Playlist playlist) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // 填充用户实体
            if (StringUtils.isNotEmpty(playlist.getUser())) {
                playlist.setUserEntity(userService.get(playlist.getUser()));
            }

            // 填充歌曲实体列表
            String[] songs = mapper.readValue(playlist.getSongs(), String[].class);
            playlist.setSongList(songService.list(songs));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void requireNotNullId(String id) {
        ServiceUtil.requireNotNullId(id, ExceptionConstant.Playlist.ID_REQUIRED);
    }
}
