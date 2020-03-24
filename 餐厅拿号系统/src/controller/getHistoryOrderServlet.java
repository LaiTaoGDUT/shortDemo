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

import org.json.JSONArray;
import org.json.JSONObject;

import utils.DbUtil;
import utils.routineUtil;

/**
 * Servlet implementation class getHistoryOrderServlet
 */
@WebServlet("/getHistoryOrderServlet")
public class getHistoryOrderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getHistoryOrderServlet() {
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
		JSONArray orderList = new JSONArray();
		// 判断cookie是否有userId，如果有代表登陆过
		Cookie[] cookies = request.getCookies();
		String userId = routineUtil.judgeCookiesExist(cookies, "userId");
		if(userId.equals("")) {   //未登录
			result = "failed";
			reason = "您还未登录！";
		} else {       //已经登录
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from callNumber where userId=? and effectiveness = false order by dateTime desc";  //查询该用户所有已经失效的订单
			List<Object> list1 = new ArrayList<Object>();
			list1.add(userId);
			List<Map<String, Object>> resultSet = new ArrayList<Map<String, Object>>();
			try {
				resultSet = dbutil.findMoreResult(sql, list1);
				if(resultSet.isEmpty()) {  //没有历史订单
					result = "empty";
				} else {
					result = "success";
					for(Map<String, Object> item : resultSet) {
						JSONObject listItem = new JSONObject();
						listItem.put("restaurantName",(String)item.get("restaurantName"));
						listItem.put("myNumber",(long)item.get("number"));
						listItem.put("time",new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(item.get("dateTime")));
						orderList.put(listItem);
					}
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				result = "failed";
				reason = "服务器异常！";
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
			res.put("orderList", orderList);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
