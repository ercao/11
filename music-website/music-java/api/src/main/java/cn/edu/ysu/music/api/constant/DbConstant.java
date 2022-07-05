package cn.edu.ysu.music.api.constant;

/**
 * 数据库相关常量
 *
 * @author ercao
 */
public class DbConstant {
    private static final String SELECT_TOTAL_SQL_PREFIX = "select count(*) ";

    public static String SELECT_PAGE_SQL = " limit ?,? ";

    /**
     * 数据库表名字
     */
    public static class TableName {
        public static final String ALBUM = "album";
        public static final String ARTIST = "artist";
        public static final String LYRIC = "lyric";
        public static final String PLAYLIST = "playlist";
        public static final String PLAYLIST_TAG = "playlist_tag";
        public static final String SONG = "song";
        public static final String USER = "user";
        public static final String JWT = "jwt";
    }

    /**
     * 数据库select查询实体语句通用前缀
     */
    public static class SelectSqlPrefix {
        public static final String ALBUM = "select uuid, name, description, artists, picture_url as pictureUrl, publish_time as publishTime, create_time as createTime, status from " + TableName.ALBUM + " ";
        public static final String ARTIST = "select uuid, name, description, picture_url as pictureUrl, user, type, area, status from " + TableName.ARTIST + " ";
        public static final String LYRIC = "select song, content from " + TableName.LYRIC + " ";
        public static final String PLAYLIST = "select uuid, name, description, picture_url as pictureUrl, user, songs, tags, update_time as updateTime, create_time as createTime from " + TableName.PLAYLIST + " ";
        public static final String PLAYLIST_TAG = "select `name` from " + TableName.PLAYLIST_TAG + " ";
        public static final String SONG = "select uuid, name, picture_url as pictureUrl, artists, album, url, status from " + TableName.SONG + " ";
        public static final String USER = "select uuid, username, password, nickname , avatar_url as avatarUrl, login_time as loginTime, role, status from " + TableName.USER + " ";
        public static final String JWT = "select token, expire_time as expireTime from " + TableName.JWT + " ";
    }

    /**
     * select语句查询总数前缀
     */
    public static class SelectTotalSqlPrefix {
        public static final String ALBUM = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.ALBUM + " ";
        public static final String ARTIST = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.ARTIST + " ";
        public static final String LYRIC = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.LYRIC + " ";
        public static final String PLAYLIST = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.PLAYLIST + " ";
        public static final String PLAYLIST_TAG = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.PLAYLIST_TAG + " ";
        public static final String SONG = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.SONG + " ";
        public static final String USER = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.USER + " ";
        public static final String JWT = SELECT_TOTAL_SQL_PREFIX + " from " + TableName.JWT + " ";
    }

    /**
     * 更新SQL通用前缀
     */
    public static class UpdateSqlPrefix {
        public static final String ALBUM = "update " + TableName.ALBUM + " set ";
        public static final String SONG = "update " + TableName.SONG + " set ";
        public static final String ARTIST = "update " + TableName.ARTIST + " set ";
        public static final String LYRIC = "update " + TableName.LYRIC + " set ";
        public static final String PLAYLIST = "update " + TableName.PLAYLIST + " set ";
        public static final String PLAYLIST_TAG = "update " + TableName.ALBUM + " set ";
        public static final String USER = "update " + TableName.USER + " set ";
    }
}
