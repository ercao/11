#ifndef __UTIL_H__
#define __UTIL_H__
#include <string>

#pragma warning(disable:26451)
/**
 * @brief 工具类
*/
class Util final {
public:
	/**
	 * @brief 去掉字符串中的额空格
	 * @param s
	*/
	static string &trim(std::string &s) {
		size_t index = 0;
		if (!s.empty()) {
			while ((index = s.find(' ', index)) != string::npos) {
				s.erase(index, 1);
			}
		}
		return s;
	}

	/**
	 * @brief 字符串加上单引号
	 * @param s
	 * @return
	*/
	static string &quote(string &s) {
		return s = "'" + s + "'";
	}

	/**
	 * @brief 转为 UTF8;
	 * @param str
	 * @return
	*/
	static std::string string_to_utf8(const std::string &str) {
		return str;
	}

	static std::string utf8_to_string(const std::string &str) {
		return str;
	}
};
#endif // !__UTIL_H__
