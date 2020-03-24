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
 * Servlet implementation class nextNumberServlet
 */
@WebServlet("/nextNumberServlet")
public class nextNumberServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public nextNumberServlet() {
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
		String result = "failed";
		String reason = "";
		String restaurantName = "";
		long currentCallNumber = 0;
		Cookie[] cookies = request.getCookies();
		String restaurantId = routineUtil.judgeCookiesExist(cookies, "restaurantId");
		if(restaurantId.equals("")) {   //未登录
			result = "failed";
			reason = "您还未登录！";
		} else {          //已登录
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from restaurant where restaurantId=?";  //查询餐厅的当前号码是否和总号码一致
			List<Object> list1 = new ArrayList<Object>();
			list1.add(restaurantId);
			Map<String, Object> map1;
			try {
				map1 = dbutil.findSimpleResult(sql, list1);
				restaurantName = (String)map1.get("restaurantName");
				currentCallNumber = (long)map1.get("currentCallNumber");
				if(currentCallNumber == (long)map1.get("currentTotalNumber")) {  //当前叫号已经是最大号码
					result = "failed";
					reason = "没有更多号码啦!";
				} else {
					currentCallNumber = currentCallNumber + 1;  //当前叫号加一
					sql = "update restaurant set currentCallNumber = ? where restaurantId = ?";
					List<Object> list2 = new ArrayList<Object>();
					list2.add(currentCallNumber);
					list2.add(restaurantId);
					dbutil.updateByPreparedStatement(sql, list2);
					currentCallNumber = currentCallNumber - 1;  //上一号的有效性变成false
					sql = "update callNumber set effectiveness = false where restaurantName = ? and number = ?";
					List<Object> list3 = new ArrayList<Object>();
					list3.add(restaurantName);
					list3.add(currentCallNumber);
					dbutil.updateByPreparedStatement(sql, list3);
					result = "success";
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
		} else {
             //do nothing
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
