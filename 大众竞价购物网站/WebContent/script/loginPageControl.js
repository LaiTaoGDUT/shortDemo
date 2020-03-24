$(function() {

/**
 * 函数描述：检查cookies的有效性
 * 参数描述：无
 * 返回值：无
 */
  function CheckUserInfo() {                                    //获取已有cookie
    if ($.cookie("rmbUser") === "true") {
      $("#remember_me").prop("checked", true);
      $("#login_user_id").val($.cookie("userName"));
      $("#login_user_password").val($.cookie("passWord"));
    }
	else {
      $("#login_user_password").val("");
	}
  }
/**
 * 函数描述：存储cookies
 * 参数描述：无
 * 返回值：无
 */
  function saveUserInfo() {                                       //存储cookie
    if ($("#remember_me").prop("checked") == true) {
      var userName = $("#login_user_id").val();
      var passWord = $("#login_user_password").val();
      $.cookie("rmbUser", "true", { expires: 7 });
      $.cookie("userName", userName, { expires: 7 });
      $.cookie("passWord", passWord, { expires: 7 });
    }
    else {
      $.cookie("rmbUser", "false", { expires: -1 });
      $.cookie("userName", '', { expires: -1 });
      $.cookie("passWord", '', { expires: -1 });
    }
  }
/**
 * 函数描述：绑定手机端侧滑菜单展开的事件
 * 参数描述：无
 * 返回值：无
 */
function sideMenuOpenEvent() {
    let mobileMenu = $(".mobile_menu");
    let menuFilm = $(".menu_film");
    let menuWrapper = $(".menu_wrapper");
    mobileMenu.on("click", function() {
        menuWrapper.addClass("slideIn");
        menuFilm.show();
    })
}
/**
 * 函数描述：绑定手机端侧滑菜单关闭的事件
 * 参数描述：无
 * 返回值：无
 */
function  sideMenuCloseEvent() {
    let menuFilm = $(".menu_film");
    let menuWrapper = $(".menu_wrapper");
    menuFilm.on("click", function() {
        menuWrapper.removeClass("slideIn");
        menuFilm.hide();
    })
}
/**
 * 函数描述：绑定从登陆和注册的切换事件
 * 参数描述：无
 * 返回值：无
 */
function switchToRegister() {
    let formLogin = $(".form_login");
    let formRegister = $(".form_register");
    let registerButton = $(".register_btn");
    let registerLoginButton = $(".register_login_btn");
    registerButton.on("click", function() {
        formLogin.hide();
        formRegister.show();
    });
    registerLoginButton.on("click", function() {
        formRegister.hide();
        formLogin.show();
    })

}


/**
 * 函数描述：登录事件
 * 参数描述：无
 * 返回值：无
 */
var updateOrder;       //定时更新订单事件
var whetherReflashHistory;     //这个参数是用来标识在获取到“正在进行的订单”为空时，是否刷新历史订单，刚取号或者获取到有正在进行的订单时，
                                //将这个参数置为1，表明下一次没有获取到正在进行的订单时要刷新一遍历史订单，如果没有获取到正在进行的订单时，如果这个参数是1，
                                //就刷新一遍历史订单，否则不需要刷新，刷新历史订单的同时把这个参数
                                //置为0，表示下一次不需要刷新了
var oldRemainDesktop;      //这个参数是用来观察剩余桌数是否发生变化，作为是否发送通知的依据

function login() {
    let loginBtn = $(".login_btn");
    loginBtn.on("click", function(event) {
        saveUserInfo();
        let userId = $("#login_user_id").val();
        let userPassword = $("#login_user_password").val();
        let user = $(".user");
        event.preventDefault();
        if(loginInformationValidation(userId, userPassword)) {
            $.post("/大众竞价购物网站/loginServlet", {
                userId: userId,
                userPassword: userPassword
            }, function(result) {
                if(result.result == "success") {
                    sessionStorage.setItem('userName', result.userName);
                    sessionStorage.setItem('userId', userId);
                    window.location.href="index.html";
                } else {
                	alert(result.reason);
                }
            })
        } else {
            return;
        }
    })
}
/**
 * 函数描述：登录信息验证
 * 参数描述：id为用户账号，pass为用户密码
 * 返回值：true为验证通过，false为验证不通过
 */
function loginInformationValidation(id, pass) {
    let flag = true;
    let positiveInteger = /^[0-9]*[1-9][0-9]*$/;   //正整数正则
    let idLength = id.length;
    let passLength = pass.length;
    let loginUserIdWarning = $(".login_user_id_warning");
    let loginUserPasswordWarning = $(".login_user_password_warning");
    loginUserIdWarning.hide();
    loginUserPasswordWarning.hide();
    if(id == "") {
        loginUserIdWarning.show().text("用户账号不能为空！");
        flag = false;
    } else if(pass == "") {
        loginUserPasswordWarning.show().text("用户密码不能为空！");
        flag = false;
    } else if(!positiveInteger.test(id)) {
        loginUserIdWarning.show().text("用户账号必须为纯数字！");
        flag = false;
    } else if(idLength < 6) {
        loginUserIdWarning.show().text("用户账号必须大于6位");
        flag = false;
    } else if (idLength > 16) {
        loginUserIdWarning.show().text("用户账号必须小于16位");
        flag = false;
    } else if(passLength < 6) {
        loginUserPasswordWarning.show().text("用户密码必须大于6位");
        flag = false;
    } else if (passLength > 16) {
        loginUserPasswordWarning.show().text("用户密码必须小于16位");
        flag = false;
    }
    return flag;
}
/**
 * 函数描述：获取所有餐厅的信息并填入首页的餐厅列表中
 * 参数描述：id为用户账号，pass为用户密码
 * 返回值：true为验证通过，false为验证不通过
 */
function acquireRestaurantInfo() {
    $.post("/竞价商城系统/getRestaurantInfoServlet", {

    }, function(result) {
        if(result.result == "failed") {
            alert(result.reason);
            switchMainToLogin();
        } else {
            result.orderList.forEach(function(item) {
                $("." + item.restaurantId).children("span").text("当前等待：" + (item.totalNumber - item.currentNumber) + "桌");
            })
        }
    });
}
/**
 * 函数描述：更新正在进行的订单信息事件
 * 参数描述：无
 * 返回值：无
 */
function updateOrderMsg() {
    let orderContent = $(".order_leftContent_inner_content").children("ul");
    let historyContent = $(".history_leftContent_inner_content").children("ul");
    $.post("/竞价商城系统/getCurrentOrderServlet", {
        //no parameter
    }, function(result) {
        if(result.result == "failed") {
            alert(result.reason + "请重新登录");
            switchToLogin();
        } else {
            if(result.result == "empty") {
                orderContent.empty();     //清空正在进行的订单
                if(whetherReflashHistory == 1) {    //如果需要刷新历史订单
                    $.post("/竞价商城系统/getHistoryOrderServlet", {   //获取历史订单
                        //no parameter
                    }, function(result) {
                        if(result.result == "failed") {
                            alert(result.reason);
                            switchToLogin();
                        } else if(result.result == "empty"){
                            historyContent.empty();
                            //do nothing
                        } else {
                            historyContent.empty();
                            createHistoryOrderCard(result.orderList); //获取历史订单
                        }
                    });
                    whetherReflashHistory = 0;
                } else {
                    //do nothing
                }
            } else {      //更新现有订单
                let remainDesktop = result.myNumber - result.currentCallNumber;
                let sendNotification = 0;
                if(remainDesktop != oldRemainDesktop && oldRemainDesktop < 6) {
                    sendNotification = 1;
                    oldRemainDesktop = remainDesktop;
                }
                if(remainDesktop == 0) {
                    remainDesktop = "正在叫号";
                }
                $(".order_list_content_remain").text("剩余桌数：" + remainDesktop);
                $(".order_list_content_expectWait").text("预计等待：" + (result.myNumber - result.currentCallNumber) * 5 + "分钟");
                if(sendNotification == 1) {
                    CreatNotification(result.restaurantName, remainDesktop,$(".order_list_content_expectWait").text());
                }
            }
        }
    });
}
Notification.requestPermission();                                   //桌面通知允许请求

function CreatNotification(restaurantName, remainDesktop, expectWait) {                                  //桌面通知

      // 检查用户是否同意接受通知
      if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notice;
        if(remainDesktop != "正在叫号") {
            notice = new Notification("就餐通知！",{
                body: "还有" + remainDesktop + "桌客人就到您就餐啦！"+ expectWait,
                tag: restaurantName,
                icon: "image/" + restaurantName + ".png",
                renotify: false,
                timestamp: '',
              });
        } else {
            notice = new Notification("就餐通知！",{
                body: "您的号码正在被叫号！速速前往就餐！",
                tag: restaurantName,
                icon: "image/" + restaurantName + ".png",
                renotify: false,
                timestamp: '',
              });
        }
          setTimeout(function() {
            notice.close();
          },4000);
      }
}
/**
 * 函数描述：注册事件
 * 参数描述：无
 * 返回值：无
 */
function register() {
	let registerBtn = $(".register_register_btn");
	registerBtn.on("click", function() {
        let registerCheckBox = $(".register_checkbox_label");
        registerCheckBox.children("span").hide();
        if(registerCheckBox.children("input").prop("checked") == false) {
            registerCheckBox.children("span").show();
        }
        let userId = $("#register_user_id").val();
        let userPassword = $("#register_user_password").val();
        let userName = $("#register_user_name").val();
        let passwordAgain = $("#register_user_password_again").val();
        if(registerInformationValidation(userId, userName, userPassword, passwordAgain)) {
        	$.post("/大众竞价购物网站/registerServlet", {
        		userId: userId,
        		userName: userName,
        		userPassword: userPassword,
        	}, function(result) {
        		if(result.result == "success") {
        			alert("注册成功，现在你可以使用该账号密码登录系统了!");
        		    $(".form_register").hide();
        		    $(".form_login").show();
        		    $("#login_user_id").val(result.userId);
        		} else {
        			alert("注册失败！" + result.reason);
        		}
        	})
        }
	})
}

/**
 * 函数描述：注册信息验证
 * 参数描述：id为用户账号，pass为用户密码
 * 返回值：true为验证通过，false为验证不通过
 */
function registerInformationValidation(id, name, pass, passAgain) {
    let flag = true;
    let positiveInteger = /^[0-9]*[1-9][0-9]*$/;   //正整数正则
    let idLength = id.length;
    let nameLength = name.length;
    let passLength = pass.length;
    let registerUserIdWarning = $(".register_user_id_warning");
    let registerUserPasswordWarning = $(".register_user_password_warning");
    let registerUserNameWarning = $(".register_user_name_warning");
    let registerUserPasswordAgainWarning = $(".register_user_password_again_warning");
    
    registerUserIdWarning.hide();
    registerUserPasswordWarning.hide();
    registerUserNameWarning.hide();
    registerUserPasswordAgainWarning.hide();
    
    if(id == "") {
    	registerUserIdWarning.show().text("用户账号不能为空！");
        flag = false;
    } else if(pass == "") {
    	registerUserPasswordWarning.show().text("用户密码不能为空！");
        flag = false;
    } else if(name == "") {
    	registerUserNameWarning.show().text("用户昵称不能为空！");
        flag = false;
    } else if(!positiveInteger.test(id)) {
        registerUserIdWarning.show().text("用户账号必须为纯数字！");
        flag = false;
    } else if(idLength < 6) {
        registerUserIdWarning.show().text("用户账号必须大于6位");
        flag = false;
    } else if (idLength > 16) {
        registerUserIdWarning.show().text("用户账号必须小于16位");
        flag = false;
    } else if (nameLength > 6) {
    	registerUserNameWarning.show().text("用户昵称必须小于6位");
        flag = false;
    } else if(passLength < 6) {
        registerUserPasswordWarning.show().text("用户密码必须大于6位");
        flag = false;
    } else if (passLength > 16) {
        registerUserPasswordWarning.show().text("用户密码必须小于16位");
        flag = false;
    } else if(pass != passAgain) {
    	registerUserPasswordAgainWarning.show().text("确认密码不匹配！");
        flag = false;
    }
    return flag;
}
/**
 * 函数描述：显示密码强度（仅供娱乐）
 * 参数描述：无
 * 返回值：无
 */
function showPasswordStrength() {
    let registerUserPassword = $("#register_user_password");
    let strengthPlain = $(".strength_plain");
    registerUserPassword.keyup(function() {
        strengthPlain.each(function(item) {
            this.classList.remove("passwordStrengthFill");
        });
        let value = $(this).val();
        if(value.length <= 6) {
            //do nithing
        } else if(value.length <= 8) {
            strengthPlain[0].classList.add("passwordStrengthFill");
        } else if(value.length <= 12) {
            strengthPlain[0].classList.add("passwordStrengthFill");
            strengthPlain[1].classList.add("passwordStrengthFill");
        } else if(value.length <= 14) {
            strengthPlain[0].classList.add("passwordStrengthFill");
            strengthPlain[1].classList.add("passwordStrengthFill");
            strengthPlain[2].classList.add("passwordStrengthFill");
        } else if(value.length <= 16) {
            strengthPlain[0].classList.add("passwordStrengthFill");
            strengthPlain[1].classList.add("passwordStrengthFill");
            strengthPlain[2].classList.add("passwordStrengthFill");
            strengthPlain[3].classList.add("passwordStrengthFill");
        } else {
            strengthPlain.addClass("passwordStrengthFill");
        }
    })
}
/**
 * 函数描述：登出事件
 * 参数描述：无
 * 返回值：无
 */
function logout() {
	let logoutBtn = $(".logout");
	logoutBtn.on("click", function() {
		$.post("/竞价商城系统/logoutServlet", {
				//no parameter
		}, function(result) {
			if(result.result == "failed") {
				alert(result.reason)
			} else {
                switchToLogin();
                clearInterval(updateOrder);
			}
		})
	})
}
/**
 * 函数描述：关于我们事件
 * 参数描述：无
 * 返回值：无
 */
function aboutUs() {
	let about_us = $(".about_us");
	about_us.on("click", function() {
		$.post("/竞价商城系统/aboutServlet", {
			//no parameter
		}, function(result) {
			if(result.result == "failed") {
				alert(result.reason);
				switchToLogin();
			} else {
				alert(result.message);
			}
		})
	})
} 
/**
 * 函数描述：切换主页面到登录页面
 * 参数描述：无
 * 返回值：无
 */
function switchMainToLogin() {
    $(".without_login").show();
    $(".login_btn_container").show();
    $(".welcome").hide();
    $(".menu_container_top").hide();
    $("#main_login").show();
    $("#main_content").hide();
}

/**
 * 函数描述：切换到登录页面
 * 参数描述：无
 * 返回值：无
 */
function switchToLogin() {
    $(".without_login").show();
    $(".login_btn_container").show();
    $(".welcome").hide();
    $(".menu_container_top").hide();
    $("#main_login").show();
    $("#main_content").hide();
    $("#main_order").hide();
}
/**
 * 函数描述：切换登录页面到主界面
 * 参数描述：无
 * 返回值：无
 */
function switchLoginToMain() {
    $(".without_login").hide();
    $(".login_btn_container").hide();
    $(".welcome").show();
    $(".menu_container_top").show();
    $("#main_login").hide();
    $("#main_content").show();
}
/**
 * 函数描述：切换主页面到我的订单页面
 * 参数描述：无
 * 返回值：无
 */
function switchMainToMyOrder() {
    $("#main_content").hide();
    $("#main_order").show();
}
/**
 * 函数描述：切换我的订单页面到主界面
 * 参数描述：无
 * 返回值：无
 */
function switchMyOrderToMain() {
    $("#main_order").hide();
    $("#main_content").show();
}
/**
 * 函数描述：点击首页
 * 参数描述：无
 * 返回值：无
 */
function clickMain() {
    let myMain = $(".my_main");
    myMain.on("click", function() {
        let mainLogin = $("#main_login");
        if(!mainLogin.is(":hidden")) {  //在登录页面
            alert("请先登录!");
        } else {
            switchMyOrderToMain();
        }
    })
}
/**
 * 函数描述：点击我的订单
 * 参数描述：无
 * 
 * 返回值：无
 */
function clickMyOrder() {
    let myOrder = $(".my_order");
    let orderContent = $(".order_leftContent_inner_content").children("ul");
    let historyContent = $(".history_leftContent_inner_content").children("ul");
    myOrder.click(function() {
        let mainLogin = $("#main_login");
        if(!mainLogin.is(":hidden")) {  //在登录页面
            alert("请先登录!");
        } else {
            $.post("/竞价商城系统/getCurrentOrderServlet", {   //获取当前订单
                //no parameter
            }, function(result) {
                if(result.result == "failed") {
                    alert(result.reason);
                    switchToLogin();
                } else {
                    if(result.result == "empty"){
                        //do nothing
                        orderContent.empty();
                        switchMainToMyOrder();
                        whetherReflashHistory = 0;
                    } else {
                        orderContent.empty();
                        switchMainToMyOrder();
                        createOrderCard(result); //生成订单卡片
                        oldRemainDesktop = result.myNumber - result.currentCallNumber;
                        whetherReflashHistory = 1;
                    }
                    $.post("/竞价商城系统/getHistoryOrderServlet", {   //获取历史订单
                        //no parameter
                    }, function(result) {
                        if(result.result == "failed") {
                            alert(result.reason);
                            switchToLogin();
                        } else if(result.result == "empty"){
                            historyContent.empty();
                            //do nothing
                        } else {
                            historyContent.empty();
                            createHistoryOrderCard(result.orderList); //获取历史订单
                        }
                    });
                }
            });
        }
    })
}
/**
 * 函数描述：生成我的订单中的所有信息
 * 参数描述：无
 * 
 * 返回值：无
 */
function createAllOrder() {
    let myOrder = $(".my_order");
    let orderContent = $(".order_leftContent_inner_content").children("ul");
    let historyContent = $(".history_leftContent_inner_content").children("ul");
    let mainLogin = $("#main_login");
    $.post("/竞价商城系统/getCurrentOrderServlet", {   //获取当前订单
        //no parameter
    }, function(result) {
        if(result.result == "failed") {
            alert(result.reason);
            switchToLogin();
        } else {
            if(result.result == "empty"){
                //do nothing
                orderContent.empty();
                whetherReflashHistory = 0;
            } else {
                orderContent.empty();
                createOrderCard(result); //生成订单卡片
                oldRemainDesktop = result.myNumber - result.currentCallNumber;
                whetherReflashHistory = 1;
            }
            $.post("/竞价商城系统/getHistoryOrderServlet", {   //获取历史订单
                //no parameter
            }, function(result) {
                if(result.result == "failed") {
                    alert(result.reason);
                    switchToLogin();
                } else if(result.result == "empty"){
                    historyContent.empty();
                    //do nothing
                } else {
                    historyContent.empty();
                    createHistoryOrderCard(result.orderList); //获取历史订单
                }
            });
        }
    });
}
/**
 * 函数描述：点击拿号！
 * 参数描述：无
 * 返回值：无
 */
function takeTheNumber() {
    let myOrder = $(".my_order");
    let queueImmediately = $(".queue_immediately");
    queueImmediately.on("click", function() {
        let restaurantId = $(this).prop("id");
        $.post("/竞价商城系统/takeNmuberServlet", {
            restaurantId: restaurantId
        }, function(res) {
            if(res.result == "failed") {
                alert(res.reason);
                if(res.reason == "您还未登录！") {
                    switchMainToLogin();
                }
            } else {
                alert("拿号成功!");
                myOrder.trigger("click");   //触发一次所有订单的刷新事件
            }
        });
    })
}
/**
 * 函数描述：创建有效订单卡片
 * 参数描述：res是从服务端获取的回调参数
 * 返回值：无
 */
function createOrderCard(res) {
    let remainDesktop = res.myNumber - res.currentCallNumber;
    if(remainDesktop == 0) {
        remainDesktop = "正在叫号";
    }
    let father = $(".order_leftContent_inner_content");
    let fatherUl = father.children("ul");
    let li = $("<li></li>");
    li.addClass("order_list");
    let div = $("<div></div>");
    //左边
    let listImg = $("<div></div>");
    listImg.addClass("order_list_img");
    let img = $("<img>");
    img.prop("src","image/" + res.restaurantName + ".png");
    img.appendTo(listImg);
    listImg.appendTo(div);
    //右边
    let listContent = $("<div></div>");
    listContent.addClass("order_list_content");
    let contentTime = $("<div></div>");
    contentTime.addClass("order_list_content_time");
    contentTime.text(res.time);
    contentTime.appendTo(listContent);
    let contentTitle = $("<div></div>");
    contentTitle.addClass("order_list_content_title");
    contentTitle.text(res.restaurantName);
    contentTitle.appendTo(listContent);
    let contentRemain = $("<div></div>");
    contentRemain.addClass("order_list_content_remain");
    contentRemain.text("剩余桌数：" + remainDesktop);
    contentRemain.appendTo(listContent);
    let contentExpectWait = $("<div></div>");
    contentExpectWait.addClass("order_list_content_expectWait");
    contentExpectWait.text("预计等待：" + (res.myNumber - res.currentCallNumber) * 15 + "分钟");
    contentExpectWait.appendTo(listContent);
    let contentMyNumber = $("<div></div>");
    contentMyNumber.addClass("order_list_content_myNumber");
    contentMyNumber.text("我的号码：" + res.myNumber);
    contentMyNumber.appendTo(listContent);
    let contentCallNumber = $("<div></div>");
    contentCallNumber.addClass("order_list_content_callNumber");
    contentCallNumber.text("取号凭证：" + res.verificationCode);
    contentCallNumber.appendTo(listContent);
    listContent.appendTo(div);
    div.appendTo(li);
    li.appendTo(fatherUl);
}

/**
 * 函数描述：创建历史订单卡片
 * 参数描述：orderList是从一个包含所有订单参数对象地数组，可从回调参数中地orderList字段获得，
 * 返回值：无
 */
function createHistoryOrderCard(orderList) {
    let father = $(".history_leftContent_inner_content");
    let fatherUl = father.children("ul");
    orderList.forEach(function(element) {
        let li = $("<li></li>");
        li.addClass("order_list");
        let div = $("<div></div>");
        //左边
        let listImg = $("<div></div>");
        listImg.addClass("order_list_img");
        let img = $("<img>");
        img.prop("src","image/" + element.restaurantName + ".png");
        img.appendTo(listImg);
        listImg.appendTo(div);
        //右边
        let listContent = $("<div></div>");
        listContent.addClass("order_list_content");
        let contentTime = $("<div></div>");
        contentTime.addClass("order_list_content_time");
        contentTime.text(element.time);
        contentTime.appendTo(listContent);
        let contentAgain = $("<div></div>");
        contentAgain.addClass("order_list_content_again");
        contentAgain.text("再来一单");
        contentAgain.appendTo(listContent);
        let contentTitle = $("<div></div>");
        contentTitle.addClass("order_list_content_title");
        contentTitle.text(element.restaurantName);
        contentTitle.appendTo(listContent);
        let contentState = $("<div></div>");
        contentState.addClass("order_list_content_state");
        contentState.text("就餐状态：已就餐");
        contentState.appendTo(listContent);
        let contentMyComment = $("<div></div>");
        contentMyComment.addClass("order_list_content_myComment");
        contentMyComment.text("我的评价：未评价");
        let writeComment = $("<span></span>");
        writeComment.addClass("write_comment");
        writeComment.text("去评价");
        writeComment.appendTo(contentMyComment);
        contentMyComment.appendTo(listContent);
        let contentMyNumber = $("<div></div>");
        contentMyNumber.addClass("order_list_content_myNumber");
        contentMyNumber.text("我的号码:" + element.myNumber);
        contentMyNumber.appendTo(listContent);
        listContent.appendTo(div);
        div.appendTo(li);
        li.appendTo(fatherUl);
        let orderSeparate = $("<div></div>");
        orderSeparate.addClass("order_separate");
        let separateContainer = $("<div></div>");
        separateContainer.addClass("shopCard_separate_container");
        let div2 = $("<div></div>");
        let separateBorder = $("<div></div>");
        separateBorder.addClass("shopCard_separate_container_border");
        separateBorder.appendTo(div2);
        div2.appendTo(separateContainer);
        separateContainer.appendTo(orderSeparate);
        orderSeparate.appendTo(fatherUl);   
    });


    
}
/**
 * 函数描述：清除事件的默认行为
 * 参数描述：无
 * 返回值：无
 */
function clearEventDefault() {
    $(".register_btn").on("click", function(event) {
        event.preventDefault();
    });
    $(".register_login_btn").on("click", function(event) {
        event.preventDefault();
    });
    $(".register_register_btn").on("click", function(event) {
        event.preventDefault();
    });
    
}
/**
 * 函数描述：设置背景的轮换时间
 * 参数描述：time为时间，单位为毫秒
 * 返回值：无
 */
function setBackgroundRotationTime(time) {
    let rotation1 = $(".rotation1");
    let rotation2 = $(".rotation2");
    let rotation3 = $(".rotation3");
    let container1 = $(".container_inner1");
    let container2 = $(".container_inner2");
    let container3 = $(".container_inner3");
    let timeSet = 1;
    setInterval(function() {
        timeSet += 1;
        if(timeSet > 3) {
            timeSet = 1;
        }
        if(timeSet == 1) {
            rotation3.css("opacity", 0);
            rotation1.css("opacity", 1);
            container3.fadeOut(1000, function() {
                container1.fadeIn(1000);
            });
            
        } else if(timeSet == 2) {
            rotation1.css("opacity", 0);
            rotation2.css("opacity", 1);
            container1.fadeOut(1000, function() {
                container2.fadeIn(1000);
            });
        } else if(timeSet == 3) {
            rotation2.css("opacity", 0);
            rotation3.css("opacity", 1);
            container2.fadeOut(1000, function() {
                container3.fadeIn(1000);
            });
        }
        
    }, time);
}

/**
 * 函数描述：判断元素是否在浏览器窗口中
 * 参数描述：elm是元素对象
 * 返回值：true为可见，false为不可见
 */
function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    //获取当前浏览器的视口高度，不包括工具栏和滚动条
  //document.documentElement.clientHeight兼容 Internet Explorer 8、7、6、5
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    //bottom top是相对于视口的左上角位置
    //bottom大于0或者top-视口高度小于0可见
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
/**
 * 函数描述：监听滚动条的滚动事件
 * 参数描述：
 * 返回值：
 */
function listenScorll() {
    $(window).scroll(function(event){
        let phantom = $("#phantom");
        if(checkVisible(document.querySelector("#header"))) {
            phantom.css("opacity", 0);
            phantom.css("visibility", "hidden");
        } else {
            phantom.css("opacity", 1);
            phantom.css("visibility", "visible");
        }
    });
}

/**
 * 函数描述：初始化所有事件的绑定
 * 参数描述：无
 * 返回值：无
 */
function mobileEventIninit() {
    sideMenuOpenEvent();
    sideMenuCloseEvent();
    switchToRegister();
    login();
    clearEventDefault();
    register();
    setBackgroundRotationTime(10000);
    logout();
    aboutUs();
    takeTheNumber();
    clickMyOrder();
    clickMain();
    CheckUserInfo();
    showPasswordStrength();
    listenScorll();
}
mobileEventIninit();



})