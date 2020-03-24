package utils;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class DbUtil {
	//数据库地址
	private static String dbUrl = "jdbc:mysql://localhost:3306/restaurant_queue_system?useSSL=false";
	//用户名
	private static String dbUserName = "root";
	//密码
	private static String dbPassword = "123456";
	//驱动名称
	private static String jdbcName = "com.mysql.jdbc.Driver";
	
	private Connection con; 
	private PreparedStatement pstmt;
	private ResultSet resultSet;
	
	public Connection getCon(){
		try {
			Class.forName(jdbcName);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			con = DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return con;
	}
	
	public void closeCon() throws Exception {
		if(resultSet != null) {
			resultSet.close();
			if(con != null) {
				con.close();
			}
		}
	}
	/**
	 * 实现数据库的增删改
	 * @param sql
	 * @param params
	 * @return
	 * @throws SQLException
	 */
	public boolean updateByPreparedStatement(String sql, List<Object> params) throws SQLException {
		boolean flag = false;
		int result = -1;
		pstmt = con.prepareStatement(sql);
		int index = 1;
		if(params != null && !params.isEmpty()) {
			for(int i = 0; i < params.size(); i++) {
				pstmt.setObject(index++, params.get(i));
			}
		}
		result = pstmt.executeUpdate();
		flag = result > 0 ? true : false;
		return flag;	
	}
	/**
	 * 查询单条数据,如有多条数据则返回最后一条
	 * @param sql
	 * @param params
	 * @return
	 * @throws SQLException
	 */
	public Map<String, Object> findSimpleResult(String sql, List<Object> params) throws SQLException {
		Map<String, Object> map = new HashMap<String, Object>();
		int index = 1;
		pstmt = con.prepareStatement(sql);
		if(params != null && !params.isEmpty()) {
			for(int i = 0;i < params.size(); i++) {
				pstmt.setObject(index++, params.get(i));
			}
		}
		resultSet = pstmt.executeQuery();   //返回查询结果
		ResultSetMetaData metaData = resultSet.getMetaData();
		int col_len = metaData.getColumnCount();    //获取查询结果的列数
		while(resultSet.next()) {
			for(int j = 0; j < col_len; j++) {
				String cols_name = metaData.getColumnName(j + 1);
				Object cols_value = resultSet.getObject(cols_name);  //获取该列的数据
				if(cols_value == null) {
					cols_value = "";
				}
				map.put(cols_name, cols_value);
			}
		}
		return map;
	}
	/**
	 * 查询多条数据
	 * @param sql
	 * @param params
	 * @return
	 * @throws SQLException
	 */
	public List<Map<String, Object>> findMoreResult(String sql, List<Object> params) throws SQLException {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		int index = 1;
		pstmt = con.prepareStatement(sql);
		if(params != null && !params.isEmpty()) {
			for(int i = 0;i < params.size(); i++) {
				pstmt.setObject(index++, params.get(i));
			}
		}
		resultSet = pstmt.executeQuery();   //返回查询结果
		ResultSetMetaData metaData = resultSet.getMetaData();
		int col_len = metaData.getColumnCount();    //获取查询结果的列数
		while(resultSet.next()) {
			Map<String, Object> map = new HashMap<String, Object>();
			for(int j = 0; j < col_len; j++) {
				String cols_name = metaData.getColumnName(j + 1);
				Object cols_value = resultSet.getObject(cols_name);  //获取该列的数据
				if(cols_value == null) {
					cols_value = "";
				}
				map.put(cols_name, cols_value);
			}
			list.add(map);
		}
		return list;
	} 

	/**通过反射机制查询单条记录
	 * @param sql
	 * @param params
	 * @param cls
	 * @return
	 * @throws Exception
	 */
	public <T> T findSimpleRefResult(String sql, List<Object> params,
			Class<T> cls )throws Exception{
		T resultObject = null;
		int index = 1;
		pstmt = con.prepareStatement(sql);
		if(params != null && !params.isEmpty()){
			for(int i = 0; i<params.size(); i++){
				pstmt.setObject(index++, params.get(i));
			}
		}
		resultSet = pstmt.executeQuery();
		ResultSetMetaData metaData  = resultSet.getMetaData();
		int cols_len = metaData.getColumnCount();
		while(resultSet.next()){
			//通过反射机制创建一个实例
			resultObject = cls.newInstance();
			for(int j = 0; j < cols_len; j++){
				String cols_name = metaData.getColumnName(j + 1);
				Object cols_value = resultSet.getObject(cols_name);
				if(cols_value == null){
					cols_value = "";
				}
				Field field = cls.getDeclaredField(cols_name);
				field.setAccessible(true); //打开javabean的访问权限
				field.set(resultObject, cols_value);
			}
		}
		return resultObject;
	}	
	/**通过反射机制查询多条记录
	 * @param sql 
	 * @param params
	 * @param cls
	 * @return
	 * @throws Exception
	 */
	public <T> List<T> findMoreRefResult(String sql, List<Object> params,
			Class<T> cls )throws Exception {
		List<T> list = new ArrayList<T>();
		int index = 1;
		pstmt = con.prepareStatement(sql);
		if(params != null && !params.isEmpty()){
			for(int i = 0; i<params.size(); i++){
				pstmt.setObject(index++, params.get(i));
			}
		}
		resultSet = pstmt.executeQuery();
		ResultSetMetaData metaData  = resultSet.getMetaData();
		int cols_len = metaData.getColumnCount();
		while(resultSet.next()){
			//通过反射机制创建一个实例
			T resultObject = cls.newInstance();
			for(int j = 0; j < cols_len; j++){
				String cols_name = metaData.getColumnName(j + 1);
				Object cols_value = resultSet.getObject(cols_name);
				if(cols_value == null){
					cols_value = "";
				}
				Field field = cls.getDeclaredField(cols_name);
				field.setAccessible(true); //打开javabean的访问权限
				field.set(resultObject, cols_value);
			}
			list.add(resultObject);
		}
		return list;
	}
	
	public static void main(String[] args) throws Exception {
		DbUtil dbutil = new DbUtil();
		dbutil.getCon();
		String sql = "select * from restaurant";  //查询餐厅列表信息
		List<Object> list = new ArrayList<Object>();
		List<Map<String, Object>> resultSet = new ArrayList<Map<String, Object>>();
		resultSet = dbutil.findMoreResult(sql, list);
		System.out.println(resultSet);
		dbutil.closeCon();
	}
}

