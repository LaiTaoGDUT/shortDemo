package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import utils.DbUtil;
import utils.routineUtil;

/**
 * Servlet implementation class registerServlet
 */
@WebServlet("/registerServlet")
public class registerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public registerServlet() {
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
		//获取浏览器发来的注册信息
		String userId = request.getParameter("userId");
		String userName = request.getParameter("userName");
		String userPassword = request.getParameter("userPassword");
		System.out.println(userId + "+" + userName + "+" + userPassword);
		String result = "";
		String reason = "";
		
		if(userId.equals("") || userName.equals("") || userPassword.equals("")) {   //如果用户id为空值
			result = "failed";
			reason = "有参数为空值";
		} else if(!routineUtil.isInteger(userId)) {
			result = "failed";
			reason = "用户ID格式不合法";
		} else if(userId.length() < 6 || userId.length() > 16 || userPassword.length() < 6 || userPassword.length() > 16) {
			result = "failed";
			reason = "用户ID或密码长度不合法";
		} else if(userName.length() > 6) {
			result = "failed";
			reason = "用户名长度不合法";
		}else {  //查询数据库中是否已有该用户ID
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from user where userId=?";
			List<Object> list = new ArrayList<Object>();
			list.add(userId);
			try {
				Map<String, Object> map = dbutil.findSimpleResult(sql, list);
				if(!map.isEmpty()) {  //已有该ID
					result = "failed";
					reason = "用户ID已存在";
				} else {    //没有该ID，将用户ID写入数据库
					sql = "insert into user(userId, userName, userPassword, whetherHaveNumber) values (?, ?, ?, ?)";
					//list在前面已经add过userId了
					list.add(userName);
					list.add(userPassword);
					list.add(false);
					boolean flag = dbutil.updateByPreparedStatement(sql, list);
					if(!flag) {
						result = "failed";
						reason = "服务器出错，请联系管理员";
					} else {
						result = "success";
					}
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				result = "failed";
				reason = "服务器出错，请联系管理员";
			} finally {
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
			res.put("userId", userId);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
