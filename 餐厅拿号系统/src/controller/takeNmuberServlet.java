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
 * Servlet implementation class takeNmuberServlet
 */
@WebServlet("/takeNmuberServlet")
public class takeNmuberServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public takeNmuberServlet() {
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
		String restaurantId = request.getParameter("restaurantId");
		long currentCallNumber = 0;
		long currentTotalNumber = 0;
		String time = routineUtil.getCurrentDateTime();    //订单创建时间
		String restaurantName = "";
		String result = "";
		String reason = "";
		// 判断cookie是否有userId，如果有代表登陆过
		Cookie[] cookies = request.getCookies();
		String userId = routineUtil.judgeCookiesExist(cookies, "userId");
		if(userId.equals("")) {   //未登录
			result = "failed";
			reason = "您还未登录！";
		} else {    //已登录
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from user where userId=?";  //查询该用户是否已经拿号了
			List<Object> list1 = new ArrayList<Object>();
			list1.add(userId);
			try {
				Map<String, Object> map1 = dbutil.findSimpleResult(sql, list1);
				if((boolean)map1.get("whetherHaveNumber")) { //用户已拿号
					result = "failed";
					reason = "您已拿号！";
				} else {   //用户未拿号，可以到该餐厅拿号
					sql = "select * from restaurant where restaurantId=?";
					List<Object> list2 = new ArrayList<Object>();
					list2.add(restaurantId);
					Map<String, Object> map2 = dbutil.findSimpleResult(sql, list2);
					restaurantName = (String)map2.get("restaurantName");
					currentCallNumber = (long)map2.get("currentCallNumber");
					currentTotalNumber = (long)map2.get("currentTotalNumber") + 1;  //用户拿到的号码是当前总号码加一
					//向数据库插入此条拿号信息
					sql="insert into callnumber(number,restaurantName,userId,verificationCode,effectiveness,dateTime) values (?, ?, ?, ?, ?, ?)";
					List<Object> list3 = new ArrayList<Object>();
					list3.add(currentTotalNumber);
					list3.add(restaurantName);
					list3.add(userId);
					list3.add("123456");  //验证码一律置为123456
					list3.add(true);   //刚拿的号肯定是有效的
					list3.add(time);
					dbutil.updateByPreparedStatement(sql, list3);
					//将数据库中该用户的是否拿号字段置为1
					sql="update user set whetherHaveNumber = true where userId = ?";
					dbutil.updateByPreparedStatement(sql, list1);
					//将餐厅的总号码字段加一
					sql="update restaurant set currentTotalNumber = ? where restaurantId = ?";
					List<Object> list4 = new ArrayList<Object>();
					list4.add(currentTotalNumber);
					list4.add(restaurantId);
					dbutil.updateByPreparedStatement(sql, list4);
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
			res.put("restaurantName",restaurantName);
			res.put("myNumber", currentTotalNumber);
			res.put("currentCallNumber", currentCallNumber);
			res.put("verificationCode", "123456");
			res.put("time", time);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
