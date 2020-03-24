package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import utils.DbUtil;
import utils.routineUtil;

/**
 * Servlet implementation class loginServlet
 */
@WebServlet("/loginServlet")
public class loginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public loginServlet() {
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
		//获取浏览器发来的登陆信息
		String userId = request.getParameter("userId");
		String userPassword = request.getParameter("userPassword");
		String result = "";
		String userName = "";
		String reason = "";
		if(userId.equals("") || userPassword.equals("")) {   //如果用户id为空值
			result = "failed";
			reason = "有参数为空值";
		} else if(!routineUtil.isInteger(userId)) {
			result = "failed";
			reason = "用户ID格式不合法";
		} else if(userId.length() < 6 || userId.length() > 16 || userPassword.length() < 6 || userPassword.length() > 16) {
			result = "failed";
			reason = "用户ID或密码长度不合法";
		} else {
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from user where userId=? and userPassword=?";
			List<Object> list = new ArrayList<Object>();
			list.add(userId);
			list.add(userPassword);
			try {
				Map<String, Object> map = dbutil.findSimpleResult(sql, list);
				if(!map.isEmpty()) {   //数据库中有与之匹配的数据
					result = "success";
					userName = (String) map.get("userName");
					request.getSession().setAttribute("userId", userId);//登录成功，向session中存入user信息
					request.getSession().setMaxInactiveInterval(30*60);   //30分钟没有活动，session失效
					Cookie cookie = new Cookie("userId", userId);//创建cookie并将成功登陆的用户保存在里面
					response.addCookie(cookie); // 服务器返回给浏览器cookie以便下次判断
				} else {
					result = "failed";
					reason = "账号或密码错误";
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				result = "failed";
				reason = "服务器出错，请联系管理员";
			}finally {
				try {
					dbutil.closeCon();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		response.setContentType("application/json; charset=utf-8"); 
		JSONObject res = new JSONObject();
		res.put("result", result);
		if(result.equals("failed")) {
			res.put("reason", reason);
		} else {
			res.put("userName", userName);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
