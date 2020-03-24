package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

/**
 * Servlet implementation class restaurantLogoutServlet
 */
@WebServlet("/restaurantLogoutServlet")
public class restaurantLogoutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public restaurantLogoutServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String result = "";
		String reason = "";
		HttpSession session = request.getSession();
		session.invalidate();       //清空session里面的信息
		// 判断cookie是否有restaurantName，如果有代表登陆过
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if(URLDecoder.decode(cookie.getName(), "utf-8").equals("restaurantId")) {  //cookies存在
					cookie.setMaxAge(0);   //删除cookie
					cookie.setValue("");
					cookie.setPath("/");
					response.addCookie(cookie);
					result = "success";
				}
			}
		} else {
			result = "success";     //未登录也返回成功
		}
		if(!result.equals("success")) {
			result = "failed";
			reason = "服务器错误！";
		}
		response.setContentType("application/json; charset=utf-8"); 
		JSONObject res = new JSONObject();
		res.put("result", result);
		if(result.equals("failed")) {
			res.put("reason", reason);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
