

document.querySelector(".header_menu_list_register").addEventListener('click', function() {
	$.post("/restaurant_queue_system/register", {
		userId: '1314580',
		userName: '淅淅沥沥',
		userPassword: '1314580'
	},function(data, status) {
		if(status == 'success') {
			alert(data.result);
		} else {
			alert("错误！")
		}
	}, 'json')
});

document.querySelector(".header_menu_list_login").addEventListener('click', function() {
	$.post("/restaurant_queue_system/loginServlet", {
		userId: '1314580',
		userPassword: '1314580'
	},function(data, status) {
		if(status == 'success') {
			alert(data.result);
		} else {
			alert("错误！")
		}
	}, 'json')
});

document.querySelector(".header_menu_list_about").addEventListener('click', function() {
	$.post("/restaurant_queue_system/about", {
		//无需传参
	},function(data, status) {
		if(status == 'success') {
			alert(data.result);
		} else {
			alert("错误！")
		}
	}, 'json')
});

