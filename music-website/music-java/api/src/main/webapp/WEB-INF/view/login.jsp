<%--
  Created by IntelliJ IDEA.
  User: ercao
  Date: 6/19/22
  Time: 5:20 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登陆</title>
</head>
<body>
<form method="POST" action="/login">
    <label>
        <span>用户名：</span>
        <input name="username" type="text"/>
    </label>

    <label>
        <span>密码：</span>
        <input name="password" type="password"/>
    </label>
    <button type="submit">登陆</button>
</form>
</body>
</html>
