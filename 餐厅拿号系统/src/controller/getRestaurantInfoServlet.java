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
 * Servlet implementation class getRestaurantInfoServlet
 */
@WebServlet("/getRestaurantInfoServlet")
public class getRestaurantInfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getRestaurantInfoServlet() {
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
		} else {
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from restaurant";  //查询餐厅列表信息
			List<Object> list = new ArrayList<Object>();
			List<Map<String, Object>> resultSet = new ArrayList<Map<String, Object>>();
			try {
				resultSet = dbutil.findMoreResult(sql, list);
				result = "success";
				for(Map<String, Object> item : resultSet) {
					JSONObject listItem = new JSONObject();
					listItem.put("restaurantId",(String)item.get("restaurantId"));
					listItem.put("totalNumber",(long)item.get("currentTotalNumber"));
					listItem.put("currentNumber",(long)item.get("currentCallNumber"));
					orderList.put(listItem);
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
		} else {
			res.put("orderList", orderList);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
