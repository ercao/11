<%@ page import="cn.edu.ysu.music.api.entity.Song" %>
<%@ page import="cn.edu.ysu.music.api.entity.Page" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<h1><%= "音乐列表" %>
</h1>
<br/>
<%
    Page<Song> songs = (Page<Song>) request.getAttribute("songs");

    out.println("音乐列表");
    out.println(songs);
    out.println(page);
%>
</body>
</html>
