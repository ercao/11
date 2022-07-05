package cn.edu.ysu.music.api.constant;

/**
 * 异常常量
 *
 * @author ercao
 */
public class ExceptionConstant {

    public static class Album {
        public static final String NOT_EXIST = "专辑不存在";
        public static final String ID_REQUIRED = "专辑编号不能为空";
        public static final String ADD_FAILED = "专辑添加失败";
        public static final String UPDATE_FAILED = "专辑更新失败";
        public static final String REMOVE_FAILED = "专辑删除失败";
    }

    public static class Artist {
        public static final String NOT_EXIST = "歌手不存在";
        public static final String ID_REQUIRED = "歌手编号不能为空";
        public static final String ADD_FAILED = "歌手添加失败";
        public static final String UPDATE_FAILED = "歌手更新失败";
        public static final String REMOVE_FAILED = "歌手删除失败";
    }

    public static class Lyric {
        public static final String NOT_EXIST = "歌词不存在";
        public static final String ID_REQUIRED = "歌词编号不能为空";
        public static final String ADD_FAILED = "歌词添加失败";
        public static final String UPDATE_FAILED = "歌词更新失败";
        public static final String REMOVE_FAILED = "歌词删除失败";
    }

    public static class Playlist {
        public static final String NOT_EXIST = "歌单不存在";
        public static final String ID_REQUIRED = "歌单编号不能为空";
        public static final String ADD_FAILED = "歌单添加失败";
        public static final String UPDATE_FAILED = "歌单更新失败";
        public static final String REMOVE_FAILED = "歌单删除失败";

        public static final String TAG_INVALID = "歌单标签无效";
        public static final String TAGS_UPDATE_FAILED = "歌单标签更新失败";
        public static final String SONGS_UPDATE_FAILED = "歌单歌曲更新失败";
    }

    public static class Song {
        public static final String NOT_EXIST = "歌曲不存在";
        public static final String ID_REQUIRED = "歌曲编号不能为空";
        public static final String ADD_FAILED = "歌曲添加失败";
        public static final String UPDATE_FAILED = "歌曲更新失败";
        public static final String REMOVE_FAILED = "歌曲删除失败";
    }

    public static class User {
        public static final String NOT_EXIST = "用户不存在";
        public static final String PASSWORD_WRONG = "密码错误";

        public static final String SAVE_TOKEN_FAILED = "token保存失败";

        public static final String ID_REQUIRED = "用户编号不能为空";
        public static final String ADD_FAILED = "用户添加失败";
        public static final String UPDATE_FAILED = "用户更新失败";
        public static final String REMOVE_FAILED = "用户删除失败";
    }
}
