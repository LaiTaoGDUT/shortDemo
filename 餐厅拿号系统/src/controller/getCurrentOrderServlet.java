package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
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
 * Servlet implementation class getCurrentOrderServlet
 */
@WebServlet("/getCurrentOrderServlet")
public class getCurrentOrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getCurrentOrderServlet() {
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
		String restaurantName = "";
		long currentCallNumber = 0;
		int verificationCode = 123456;
		String time = "";
		long myNumber = 0;
		Cookie[] cookies = request.getCookies();
		String userId = routineUtil.judgeCookiesExist(cookies, "userId");
		if(userId.equals("")) {   //未登录
			result = "failed";
			reason = "您还未登录！";
		} else {             //已登录
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from callNumber where userId=? and effectiveness = true";  //查询该用户有效的订单
			List<Object> list1 = new ArrayList<Object>();
			list1.add(userId);
			Map<String, Object> map;
			try {
				map = dbutil.findSimpleResult(sql, list1);
				if(map.isEmpty()) {
					result = "empty";
				} else {
					result = "success";
					restaurantName = (String) map.get("restaurantName");
					myNumber = (long)map.get("number");
					verificationCode = (int)map.get("verificationCode");
					time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(map.get("dateTime"));
					//从餐厅信息表中根据餐厅名字查询出餐厅当前叫号
					sql = "select currentCallNumber from restaurant where restaurantName=?";  //查询指定餐厅的当前叫号  
					List<Object> list2 = new ArrayList<Object>();
					list2.add(restaurantName);
					Map<String, Object> map2 = dbutil.findSimpleResult(sql, list2);
					currentCallNumber = (long)map2.get("currentCallNumber");
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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
		} else if(result.equals("empty")) {
			//do nothing
		} else {
			res.put("restaurantName",restaurantName);
			res.put("myNumber", myNumber);
			res.put("currentCallNumber", currentCallNumber);
			res.put("verificationCode", verificationCode);
			res.put("time", time);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
