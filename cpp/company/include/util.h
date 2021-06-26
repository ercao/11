#ifndef __UTIL_H__
#define __UTIL_H__
#include <string>
#include <Windows.h>

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
		int nwLen = ::MultiByteToWideChar(CP_ACP, 0, str.c_str(), -1, NULL, 0);
		wchar_t *pwBuf = new wchar_t[nwLen + 1];// 一定要加 1，不然会出现尾巴  
		ZeroMemory(pwBuf, nwLen * 2 + 2);
		::MultiByteToWideChar(CP_ACP, 0, str.c_str(), static_cast<int> (str.length()), pwBuf, nwLen);
		int nLen = ::WideCharToMultiByte(CP_UTF8, 0, pwBuf, -1, NULL, NULL, NULL, NULL);
		char *pBuf = new char[nLen + 1];
		ZeroMemory(pBuf, nLen + 1);

		::WideCharToMultiByte(CP_UTF8, 0, pwBuf, nwLen, pBuf, nLen, NULL, NULL);
		std::string retStr(pBuf);
		delete[]pwBuf;
		delete[]pBuf;
		pwBuf = NULL;
		pBuf = NULL;
		return retStr;
	}

	static std::string utf8_to_string(const std::string &str) {
		int nwLen = MultiByteToWideChar(CP_UTF8, 0, str.c_str(), -1, NULL, 0);
		wchar_t *pwBuf = new wchar_t[nwLen + 1];// 一定要加 1，不然会出现尾巴  
		memset(pwBuf, 0, nwLen * 2 + 2);
		MultiByteToWideChar(CP_UTF8, 0, str.c_str(), static_cast<int>(str.length()), pwBuf, nwLen);
		int nLen = WideCharToMultiByte(CP_ACP, 0, pwBuf, -1, NULL, NULL, NULL, NULL);
		char *pBuf = new char[nLen + 1];
		memset(pBuf, 0, nLen + 1);
		WideCharToMultiByte(CP_ACP, 0, pwBuf, nwLen, pBuf, nLen, NULL, NULL);
		std::string retStr = pBuf;
		delete[]pBuf;
		delete[]pwBuf;
		pBuf = NULL;
		pwBuf = NULL;
		return retStr;
	}
};
#endif // !__UTIL_H__
