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
 * Servlet implementation class getTotalNumberServlet
 */
@WebServlet("/getTotalNumberServlet")
public class getTotalNumberServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getTotalNumberServlet() {
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
		long totalNumber = 0;
		Cookie[] cookies = request.getCookies();
		String restaurantId = routineUtil.judgeCookiesExist(cookies, "restaurantId");
		if(restaurantId.equals("")) {   //未登录
			result = "failed";
			reason = "您还未登录！";
		} else {
			DbUtil dbutil = new DbUtil();
			dbutil.getCon();
			String sql = "select * from restaurant where restaurantId=?";  //查询餐厅的当前号码是否和总号码一致
			List<Object> list = new ArrayList<Object>();
			list.add(restaurantId);
			Map<String, Object> map;
			try {
				map = dbutil.findSimpleResult(sql, list);
				totalNumber = (long)map.get("currentTotalNumber");
				result = "success";
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
             res.put("totalNumber", totalNumber);
		}
		PrintWriter writer = response.getWriter();
		writer.write(res.toString());
		writer.close();
	}

}
