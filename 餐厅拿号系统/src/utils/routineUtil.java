package utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.Cookie;

/**
 * 一些常规的判定类
 * @author 赖涛
 *
 */
public class routineUtil {
	/**
	 * 判断一个字符串是否为纯数字
	 * @param str
	 */
	public static boolean isInteger(String str) {
		for (int i = str.length() - 1; i >= 0; i--) {
			if (!Character.isDigit(str.charAt(i))) {
				return false;
			}
		}
		return true;
	}
	/**
	 * 判断指定名字的cookie是否存在
	 * @param cookies cookieName
	 * @return 返回查询到的cookie的值，若没有则返回""
	 * @throws UnsupportedEncodingException 
	 */
	public static String judgeCookiesExist(Cookie[] cookies, String cookieName) throws UnsupportedEncodingException {
		String flag = "";
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if(URLDecoder.decode(cookie.getName(), "utf-8").equals(cookieName)) {  //cookies存在
					flag = cookie.getValue();
				}
			}
		}
		return flag;
	}
	/**
	 * 
	 * @return 以字符串形式返回yyyy-MM-dd kk:mm:ss格式的当前时间
	 */
	public static String getCurrentDateTime() {
		Date date = new Date(); 
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateStr = format.format(date);
		return dateStr;
	}
	public static void main(String[] args) {
		//
	}
}
