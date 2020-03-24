// JavaScript Document
$(function(){
"use strict";

  function PromptBox(content) {                              //自定义警告框
	$(".hide_one").fadeIn();
	$(".prompt_content").text(content);
  }

  function SlidePoint(content) {                           //自定义侧滑提示框
	var $slidePoint = $(".slide_point");
	$slidePoint.stop(false,true);
	$slidePoint.animate({right: "20px"}).animate({right: "10px"})
		.children().text(content);
	setTimeout(function() {
	  $slidePoint.animate({right: "15px",}).animate({right: "-300px"});
	},2000);
  }


  function LoginAnimate() {                                    //登陆动画
	var $loginButton = $(".login_button");
	$loginButton.children("span").text("登陆中...");
	$(".loading").animate({
	  width: "100%"
	},1000);
	setTimeout(function() {
	  $loginButton.children("span").text("登陆成功！");
	},1000);
  }

  $('<audio id="chatAudio"><source src="2776.mp3" type="audio/mpeg"></audio>').appendTo('body');    //消息提示音

  /*function CheckCookie() {                                       //cookie检查
	var dt = new Date();
    dt.setSeconds(dt.getSeconds() + 60);
    document.cookie = "cookietest=1; expires=" + dt.toGMTString();
    var cookiesEnabled = document.cookie.indexOf("cookietest=") != -1;
    if(!cookiesEnabled) {
        //没有启用cookie
		SlidePoint("没有启用cookie，记住密码功能失效，请检查浏览器的cookie设置");
    }
  }

  CheckCookie();*/

  function CheckUserInfo() {                                    //获取已有cookie
    if ($.cookie("rmbUser") === "true") {
      $("#remember_me").prop("checked", true);
      $(".account").val($.cookie("userName"));
      $(".password").val($.cookie("passWord"));
    }
	else {
      $(".password").val("");
	}
  }
  CheckUserInfo();

  function SaveUserInfo() {                                       //存储cookie
    if ($("#remember_me").prop("checked") == true) {
      var userName = $(".account").val();
      var passWord = $(".password").val();
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

  $(".login_button").click(function(){                                     //登陆按钮
	var data = {
	 "address": '广州大学城',//字符串
	 "mailbox": "123@qq.com",//字符串，用户的email
	 "introduction": "我是王尼玛",//字符串，用户设置的自我介绍
	 "nickname": "群主",//字符串，用户的昵称
	 "age": "18",//字符，用户的年龄
	};
  	SaveUserInfo();
	var $account = $(".account");
	var $password = $(".password");
	var $loginIn_h6 = $(".login_in h6");
    if($account.val() === ""){
      $loginIn_h6.text("账号不能为空");
      return false;
    }else if($password.val() === ""){
      $loginIn_h6.text("密码不能为空");
      return false;
	}else{
		$loginIn_h6.text(" ");	
		  LoginAnimate();
		  setTimeout(function() {
			$(".login").hide();
			$(".already_landed").show();
			$(".edit_area").val("");
			AcquirePersonalData(data);
			GetFriendsList();
			$webWechatTabFriends.parent().click();
		    SlidePoint("您已登陆！");
		  },1500);
  	}	
  });

  $(".account").keydown(function(event) {                         //enter键登陆
	if(event.keyCode == "13") {
	  $(".login_button").click();
	}
  });

  $(".password").keydown(function(event) {
	if(event.keyCode == "13") {
	  $(".login_button").click();
	}
  });

  function AcquirePersonalData(data) {                             //获取个人资料
    var $nickname = data.nickname;
    var $address = data.address;
    var $mailbox = data.mailbox;
    var $introduction = data.introduction;
    var $age = data.age;
    $(".display_name").text($nickname);
    $(".nickname_area h4").text($nickname);
    $(".introduction i").text($introduction);
    $(".address i").text($address);
    $(".mailbox i").text($mailbox);
    $(".age i").text($age);
    $(".my_account").val($nickname);
    $(".my_address").val($address);
    $(".my_mailbox").val($mailbox);
    $(".my_introduction").val($introduction);
    $(".my_age").val($age);
  }

  function GetFriendsList() {                                           //获取好友列表
	  var data = [ 
		{ 
		"id":"2db72f3e46",//字符串，用户的id，类似于QQ号
		"nickname":'昵称1'//用户名称
		}
		];
        var length = data.length;
		CreateChatList(length,data);
		CreateSearchList(length,data);
		GetRecentList();
  }

  $(".avatar").click(function(event){                              //展开详细资料
	var $page = AcquireCursorPage(event);
	$(".details").css("left",13 + $page.pageX);
	$(".details").css("top",13 + $page.pageY);
	$(".details").hide();
	$(".context_menu").hide();
	$(".your_details").hide();
    $(".details").show(300);
    event.stopPropagation();
	$(".set_menu").hide();
	$(".emoji_panel").fadeOut();
	$(".search_list").hide();
	$(".room_members_wrap").slideUp(200);
  });

  $(document).click(function(){                              //点击页面任意处关闭弹出窗口
    $(".details").hide(300);
	$(".your_details").hide(300);
    $(".set_menu").hide();
	$(".context_menu").hide();
	$(".update_details").hide(300);
	$(".emoji_panel").fadeOut();
	$(".hide_one").hide();
	$(".search_list").hide();
	$(".room_members_wrap").slideUp(200);
  });

  $(".search_box").click(function(event) {
	event.stopPropagation();
  });

  $(".update_details").click(function(event) {
	event.stopPropagation();
  });

  $(".details").click(function(event) {
	event.stopPropagation();
  });

  $(".emoji_panel").click(function(event) {
	event.stopPropagation();
  });

  $(".your_details").click(function(event) {
	event.stopPropagation();
  });

  $(".dropdown_menu").click(function(event) {
	event.stopPropagation();
  });

  $(".hide_three").click(function(event) {
	event.stopPropagation();
  });

  $(".hide_two").click(function(event) {
	event.stopPropagation();
  });

  $(".members").click(function(event) {
	event.stopPropagation();
  });

  $(".set").click(function(event){                              //展开顶部设置
    $(this).find(".set_menu").toggle();
    event.stopPropagation();
	$(".details").hide();
	$(".context_menu").hide();
	$(".your_details").hide();
	$(".emoji_panel").fadeOut();
	$(".search_list").hide();
	$(".room_members_wrap").slideUp(200);
  });

  $(".dropdown_menu a:last").click(function(){                      //退出登录
	$(".hide_two").fadeIn();
  });

  $(".exit").click(function() {
      var $result = "success";
      if($result === "success"){
		$(".hide_two").fadeOut();
        SlidePoint("登出成功！");
		$(".real_chat_list").empty();
		$(".real_content").children().empty();
		$(".real_search_list").children("div").empty();
		$(".recent_chat_list").empty();
		$(".box_bd").detach();
		$contactId = "";
		$titleId = "";
		$titleName = "";
		$titleImg = "";
		$(".title_name").text("未选择聊天");
        $(".already_landed").hide();
        $(".login").show();
		CheckUserInfo();
		$(".login_button").children("span").text("登陆");
		$(".loading").css("width","0%");
      }
  });

  $(".cancel").click(function() {                         //取消退出，取消修改资料
	$(".hide_two").fadeOut();
	$(".hide_three").fadeOut();
  });

  /*$(window).on("beforeunload",function() {                        //关闭页面时退出登陆
	if($(".login").is(":hidden")) {
	  $.get("http://47.106.74.100/logout",function(){
	    //do nothing
	  });
	}
  });*/

  $(".dropdown_menu a:first").click(function(){                              //展开修改资料设置
	$(".my_account").siblings("i").text("");
	$(".my_address").siblings("i").text("");
	$(".my_mailbox").siblings("i").text("");
    $(".my_account").val($(".display_name").text());
    $(".my_address").val($(".address i").text());
    $(".my_mailbox").val($(".mailbox i").text());
    $(".my_introduction").val($(".introduction i").text());
    $(".my_age").val($(".age i").text());
    $(".update_details").show(300);
	$(".set_menu").hide();
	$(".search_list").hide();
  });

  $(".voice_control").click(function() {                             //打开和关闭消息提示音
	if($(this).children("i").hasClass("open_voice")) {
	  $("#chatAudio").remove();
	  $(this).children("i").removeClass("open_voice").addClass("close_voice");
	  $(this).children("span").text("打开声音");
	}else{
  	  $('<audio id="chatAudio"><source src="2776.mp3" type="audio/mpeg"></audio>').appendTo('body');
	  $(this).children("i").removeClass("close_voice").addClass("open_voice");
	  $(this).children("span").text("关闭声音");
	}
  });

  $(".turn_down").click(function(){                   //退出修改资料
	 $(".update_details").hide(300);
  });

  $(".submit").click(function(){                          //弹出修改资料二次确认框
    if($(".red").length > 0){
      return false;
    }else {
	  $(".hide_three").fadeIn();
	}
  });

  $(".my_account").keyup(function() {                         //修改资料表格的验证
	if($(this).val() == "") {
	  $(this).siblings("i").addClass("red").removeClass("green").text("昵称不合法或为空！");
	}else {
	  $(this).siblings("i").addClass("green").removeClass("red").text("昵称正确");
	}
  });

  $(".my_address").keyup(function() {
	if($(this).val() == "") {
	  $(this).siblings("i").addClass("red").removeClass("green").text("地址不合法或为空！");
	}else {
	  $(this).siblings("i").addClass("green").removeClass("red").text("地址正确");
	}
  });

  $(".my_mailbox").keyup(function() {
	var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
	if($(this).val() == "") {
	  $(this).siblings("i").addClass("red").removeClass("green").text("邮箱不合法或为空！");
	}else if(!myreg.test($(this).val())) {
	  $(this).siblings("i").addClass("red").removeClass("green").text("邮箱不合法或为空！");
	}else {
	  $(this).siblings("i").addClass("green").removeClass("red").text("邮箱正确");
	}
  });

 /* $(".revise").click(function() {                                                      //确认修改资料
	var $myAccount = $(".my_account");
	var $myAddress = $(".my_address");
	var $myMailBox = $(".my_mailbox");
	var $updateDetails = $(".update_details");
	var $myIntroduction = $(".my_introduction");
    $.post("http://47.106.74.100/updateUserInfor",{
      account: $myAccount.val(),
      age: $(".my_age").val(),
      address: $myAddress.val(),
      introduction: $myIntroduction.val(),
	  mailbox: $myMailBox.val()
    },function(data){
      var $result = data.result;
      if($result === "success"){
        $(".display_name").text($myAccount.val());
        $(".nickname_area h4").text($myAccount.val());
        $(".introduction i").text($myIntroduction.val());
        $(".address i").text($myAddress.val());
        $(".mailbox i").text($myMailBox.val());
        $(".age i").text($(".my_age").val());
        SlidePoint("资料修改成功！");
		$updateDetails.find("i").text("");
		$updateDetails.find("i:last").text("(请输入整数)");
        $(".update_details").hide(300);
	    $(".hide_three").fadeOut();
      }
    },"json");
  }); */

  var $webWechatTabChat = $(".web_wechat_tab_chat");                       //切换联系人框与最近聊天框
  var $navView = $(".nav_view");
  var $webWechatTabPublic = $(".web_wechat_tab_public");
  var $webWechatTabFriends = $(".web_wechat_tab_friends");
  $webWechatTabFriends.addClass("web_wechat_tab_friends_hl");
  $navView.eq(2).show().siblings(".nav_view").hide();


  $webWechatTabChat.parent().click(function(){
	$(".box").hide();
	$(".chat_area").show();
	$webWechatTabChat.addClass("web_wechat_tab_chat_hl");
	$webWechatTabPublic.removeClass("web_wechat_tab_public_hl");
	$webWechatTabFriends.removeClass("web_wechat_tab_friends_hl");
	$navView.eq(0).show().siblings(".nav_view").hide();
	$(".New_message_alert").hide();
	$(document).attr("title","山寨信网页版");
  });

  $webWechatTabPublic.parent().click(function(){
	$webWechatTabPublic.addClass("web_wechat_tab_public_hl");
	$webWechatTabChat.removeClass("web_wechat_tab_chat_hl");
	$webWechatTabFriends.removeClass("web_wechat_tab_friends_hl");
	$navView.eq(1).show().siblings(".nav_view").hide();
  });

  $webWechatTabFriends.parent().click(function(){
	$(".chat_area").hide();
	$(".box").show();
	$webWechatTabFriends.addClass("web_wechat_tab_friends_hl");
	$webWechatTabChat.removeClass("web_wechat_tab_chat_hl");
	$webWechatTabPublic.removeClass("web_wechat_tab_public_hl");
	$navView.eq(2).show().siblings(".nav_view").hide();
  });

  function CreateChatList(length,data) {                                        //创建联系人列表
	var i;
	for (i = 0; i < length; i++) {
	  var $contactItem = $("<div></div>");
	  var $imgLasy = $("<img />");
	  var $info = $("<div></div>");
	  var $infoNickName = $("<h4></h4>");
	  var $infoId = $("<span></span>");
	  $contactItem.addClass("contact_item");
	  $imgLasy.attr("src","img/" + i + ".jpg");
	  $imgLasy.addClass("img_lasy");
	  $imgLasy.appendTo($contactItem);
	  $info.addClass("info");
	  $contactItem.addClass(data[i].id);
	  $infoNickName.appendTo($info);
	  $infoId.appendTo($info);
	  $info.appendTo($contactItem);
	  $contactItem.appendTo(".real_chat_list");
	  $infoNickName.text(data[i].nickname);
	  $infoId.text(data[i].id);
	}
    $(".real_chat_list").mCustomScrollbar({                  //滚动条插件
      theme:"minimal"
    });
  }

  function CreateSearchList(length,data) {                                       //创建搜索栏的联系人
	var i;
	for(i = 0;i < length; i++) {
	  var $searchItem = $("<div></div>");
	  var $img = $("<img />");
	  var $searchInfo = $("<div></div>");
	  var $h5 = $("<h5></h5>");
	  $searchItem.addClass("search_item");
	  $searchItem.attr("id","new" + data[i].id);
      $searchInfo.addClass("search_info");
	  $h5.appendTo($searchInfo);
	  $img.appendTo($searchItem);
	  $searchInfo.appendTo($searchItem);
	  $searchItem.appendTo($(".real_search_list").children("div"));
	  $h5.text(data[i].nickname);
	  $img.attr("src","img/" + i + ".jpg");
	}
    /*$(".real_search_list").mCustomScrollbar({
          theme:"minimal"
    });*/
  }

  $(".search_box").focus(function(){                            //焦点脱离搜索框时重置搜索文字
    if($(this).val() === this.defaultValue){
      $(this).val("");
    }
  }).blur(function(){
    $(this).val(this.defaultValue);
  });

  $(".search_box").keyup(function() {                                                      //搜索
	if($(this).val() === "") {
	  $(".search_list").hide();
	}else{
	  $(".search_list").show();
      $(".search_item").removeClass("jquery_nice").hide()
	  .filter(":contains('"+$(this).val()+"')").addClass("jquery_nice").show();
	}
	if($(".jquery_nice").length === 0) {
	  $(".contact_title").show();
	}else{
	  $(".contact_title").hide();
	}
  });

  $(".real_search_list").children("div").on("click",".search_item",function() {              //点击搜索结果跳到聊天框
	var $recentChat;
	$(".New_message_alert").hide();
	var $searchId = $(this).attr("id").substring(3);
	if($searchId != $titleId) {
	  var $editArea = $(".edit_area");
	  if($editArea.val().replace(/\s+/g,"") != "") {
		$("#昵称1").find("pre").text($editArea.val());
		$("#昵称1").find(".draft").show();
	  }else {
		if($(".real_content").children("div").children("div").length == 1) {
		  $("#昵称1").find(".draft").hide();
		  $("#昵称1").find("pre").text("");
		}else {
		  $("#昵称1").find(".draft").hide();
		  $("#昵称1").find("pre").text($(".real_content").children().children("div:last").find("pre").text());
		}
	  }
	  $editArea.val("");
	}
	$navView.eq(0).show().siblings(".nav_view").hide();
	$webWechatTabChat.addClass("web_wechat_tab_chat_hl");
	$webWechatTabPublic.removeClass("web_wechat_tab_public_hl");
	$webWechatTabFriends.removeClass("web_wechat_tab_friends_hl");
	$(".box").hide();
	$(".chat_area").show();
	CreateNewChat($searchId);
	$recentChat = $("#" + $searchId);
	$recentChat.children("i").text("0").hide();
	$recentChat.addClass("highlight").siblings().removeClass("highlight");
	$(".real_content").children().empty();
	$titleName = $recentChat.find("h4").text();
	$titleId = $recentChat.attr("id");
	$titleImg = $recentChat.find("img").attr("src");
	$(".title_name").text($titleName);
	GetChatRecord();
	$(".recent_chat_list").prepend($("#昵称1").detach());                //聊天跳到顶部
	$(".your_value").text($titleId);
	$(".your_details").children("img").attr("src",$titleImg);
	$(".nick_area").children().text($titleName);
	$(".search_list").hide();
  });

  var $boxBd = $(".box_bd");
  $(".real_chat_list").on("click",".contact_item",function() {             //点击联系人生成详情框
	$(this).addClass("highlight").siblings().removeClass("highlight");
	$boxBd.appendTo(".box");
	$boxBd.children().show();
	$contactId = $(this).find("span").text();
	$titleName = $(this).find("h4").text();
	$titleImg = $(this).find("img").attr("src");
	$boxBd.find("img").attr("src",$titleImg);
	$boxBd.find("h4").text($titleName);
	$(".value").text($contactId);
  });

  $(".action_area").children("a").on("click",function() {                         //点击发消息快速定位到指定聊天
	  var $editArea = $(".edit_area");
	  $editArea.val("");
	var $recentChat;
	$navView.eq(0).show().siblings(".nav_view").hide();
	$webWechatTabChat.addClass("web_wechat_tab_chat_hl");
	$webWechatTabPublic.removeClass("web_wechat_tab_public_hl");
	$webWechatTabFriends.removeClass("web_wechat_tab_friends_hl");
	$(".New_message_alert").hide();
	$(".box").hide();
	$(".chat_area").show();
	CreateNewChat($contactId);
	$recentChat = $("#昵称1");
	$recentChat.children("i").text("0").hide();
	$recentChat.addClass("highlight").siblings().removeClass("highlight");
	$(".real_content").children().empty();
	$titleName = $recentChat.find("h4").text();
	$titleId = $recentChat.attr("id");
	$titleImg = $recentChat.find("img").attr("src");
	$(".title_name").text($titleName);
	$(".web_wechat_friends_nickname").text($titleName);
	$(".web_wechat_friends_img").attr("src",$titleImg);
	GetChatRecord();
	$(".recent_chat_list").prepend($("#昵称1").detach());
	$(".your_value").text($titleId);
	$(".your_details").children("img").attr("src",$titleImg);
	$(".nick_area").children().text($titleName);
  });

  function CreateRecentList(data) {                                         //创建最近聊天框
	var sum = 1;
	if($("#昵称1").length <= 0) {
	  var $nickName = $("." + data.sender).find("h4");
	  var $recentItem = $("<div></div>");
	  var $ext = $("<div></div>");
	  var $p = $("<p></p>");
	  var $icon = $("<i></i>");
	  var $img = $("<img />");
	  var $info = $("<div></div>");
	  var $msg = $("<p></p>");
	  var $span = $("<span></span>");
	  var $infoNickName = $("<h4></h4>");
      var $i = $("<i></i>");
	  var $pre = $("<pre></pre>");
	  $recentItem.addClass("recent_item");
      $recentItem.attr("id",data.sender);
	  $ext.addClass("ext");
	  $img.attr("src","img/0.jpg");
	  $icon.addClass("icon");
	  $info.addClass("info");
	  $msg.addClass("msg");
	  $infoNickName.addClass("line_height");
	  $span.addClass("line_height");
	  $i.appendTo($span);
	  $pre.appendTo($span);
	  $span.appendTo($msg);
	  $infoNickName.appendTo($info);
	  $msg.appendTo($info);
	  $p.appendTo($ext);
	  $ext.appendTo($recentItem);
	  $img.appendTo($recentItem);
	  $icon.appendTo($recentItem);
	  $info.appendTo($recentItem);
	  $recentItem.appendTo(".recent_chat_list");
	  $icon.text(sum);
	  $infoNickName.text("昵称1");
	  $span.text(data.content);
	  $p.text(ShowTime(data.date));
	  $i.text("[草稿]");
	   //在右上角创建红点并标上1
	}else {
	  var $sender = $("#昵称1");
	  if(!$sender.hasClass("highlight")){
		if($sender.children("i").text() !== "99+") {
   	  	  sum =  parseInt($sender.children("i").text());
		  if(sum + 1 > 99) {
			$sender.children("i").text("99+");
		  }else {
			$sender.children("i").text(sum + 1);
		  }
		}
		$sender.children("i").show();
	  }
	  if($sender.find(".draft").is(":hidden")) {
		$sender.find("pre").text(data.content);
	  }
	  $sender.children(".ext").children().text(ShowTime(data.date));
	}
  }

  function CreateNewChat(sender) {                                     //创建一个新聊天
    if($("#昵称1").length <= 0) {
	 // var $src = $("." + sender).children("img");
	 // var $nickName = $("." + sender).find("h4");
	  var $recentItem = $("<div></div>");
	  var $ext = $("<div></div>");
	  var $p = $("<p></p>");
	  var $icon = $("<i></i>");
	  var $img = $("<img />");
	  var $info = $("<div></div>");
	  var $msg = $("<p></p>");
	  var $span = $("<span></span>");
	  var $infoNickName = $("<h4></h4>");
      var $i = $("<i></i>");
	  var $pre = $("<pre></pre>");
	  $i.addClass("draft");
	  $recentItem.addClass("recent_item");
      $recentItem.attr("id",sender);
	  $ext.addClass("ext");
	  $img.attr("src","img/0.jpg");
	  $icon.addClass("icon");
	  $info.addClass("info");
	  $msg.addClass("msg");
	  $infoNickName.addClass("line_height");
	  $span.addClass("line_height");
	  $i.appendTo($span);
	  $pre.appendTo($span);
	  $span.appendTo($msg);
	  $infoNickName.appendTo($info);
	  $msg.appendTo($info);
	  $p.appendTo($ext);
	  $ext.appendTo($recentItem);
	  $img.appendTo($recentItem);
	  $icon.appendTo($recentItem);
	  $info.appendTo($recentItem);
	  $recentItem.appendTo(".recent_chat_list");
	  $icon.text("0").hide();
	  $infoNickName.text("昵称1");
	  $i.text("[草稿]");
	  //$span.text(data.content);
	  //$p.text(ShowTime(data.date));
	   //在右上角创建红点并标上1
	}else {
	  var $sender = $("#昵称1");
	  $sender.children("i").text("0").hide();
	}
  }

  function GetRecentList() {                                            //获取未读消息
	  var data = [
		{
		"sender":"昵称1",//字符串，消息的发信人
		"receiver" :"群主",//字符串，消息的接收者
		"content" :"测试",//字符串，消息的内容
		"date" :"2018-09-29 23:48:45",//字符串，消息发送的时间
		}
		];
	  var i;
	  var $length = data.length;
	  if($length > 0) {
		if($(".web_wechat_tab_chat_hl").length == 0) {
		  $(".New_message_alert").show();
		  $(document).attr("title","(新消息)山寨信网页版");
		}
	    for(i = 0; i < $length; i++) {
		  CreateRecentList(data[i]);
		  CreateNewMessage(data[i]);
		  CreatNotification(data[i]);
	    }
		$('#chatAudio')[0].play();
	  }
  }

  /*function CreateNewMessage(data) {                                  //根据未读聊天消息创建气泡
	  CreatFriendsMessage(data.content,data.date);
	  $(".real_content").scrollTop($(".real_content")[0].scrollHeight);
  }*/

  /*setInterval(function () {                                           //每隔两秒获取一次未读消息
	if($(".login").is(":hidden")) {
	  GetRecentList();
	}
  },2000);*/

  var $contactId = "";
  var $titleName = "";
  var $titleId = "";
  var $titleImg = "";

  $(".recent_chat_list").on("click",".recent_item",function(){             //点击最近聊天好友生成聊天框
	var $editArea = $(".edit_area");
	if(!$(this).hasClass("highlight")) {
	  if($editArea.val().replace(/\s+/g,"") != "") {
		$("#昵称1").find("pre").text($editArea.val());
		$("#昵称1").find(".draft").show();
	  }else {
		if($(".real_content").children("div").children("div").length == 1) {
		  $("#昵称1").find(".draft").hide();
		  $("#昵称1").find("pre").text("");
		}else {
		  $("#昵称1").find(".draft").hide();
		  $("#昵称1").find("pre").text($(".real_content").children().children("div:last").find("pre").text());
		}
	  }
  	  $(this).children("i").text("0").hide();
	  $(this).addClass("highlight").siblings().removeClass("highlight");
	  $(".real_content").children("div").empty();
	  $titleName = $(this).find("h4").text();
	  $titleId = $(this).attr("id");
	  $titleImg = $(this).find("img").attr("src");
	  $(".title_name").text($titleName);
	  $editArea.val("");
	  if(!$("#昵称1").find(".draft").is(":hidden")) {
		$editArea.val($("#昵称1").find("pre").text());
		$("#昵称1").find(".draft").hide();
	  }
	  GetChatRecord();
	  $(".your_value").text($titleId);
	  $(".web_wechat_friends_nickname").text($titleName);
	  $(".web_wechat_friends_img").attr("src",$titleImg);
	  $(".your_details").children("img").attr("src",$titleImg);
	  $(".nick_area").children().text($titleName);
	}
  });

  var message = new Array([]);
  var $recordlength;

  function SaveRecord(data) {                          //创建一个数组储存聊天记录
	message.splice(0,message.length);
	$recordlength = data.length - 20;
	for(var i = 0;i < data.length; i++) {
	  message[i] = {
		sender: data[i].sender,
		content: data[i].content,
		date: data[i].date
	  };
	}
  }

  function AcquireMoreMessage(message) {                     //点击一次获取更多聊天记录显示数组中的二十条信息
	var i;
	var j = $recordlength;
	$(".acquire_more_message").remove();
	if(j < 20) {
	  for(i = j - 1; i >= 0; i--) {
		if(message[i].sender === $titleId) {
	      CreatFriendsRecord(message[i].content,message[i].date);
	    }else {
  	      CreatMyRecord(message[i].content,message[i].date);
		}
	  }
	  HaveNoMessage();
	}else {
	  $recordlength = $recordlength - 20;
	  for(i = j - 1; i >= j - 20; i--) {
		if(message[i].sender === $titleId) {
	      CreatFriendsRecord(message[i].content,message[i].date);
	    }else {
  	      CreatMyRecord(message[i].content,message[i].date);
		  //$(".real_content").children().children("div:first").find(".ico_loading").hide();
		}
	  }
      HaveMoreMessage();
	}
  }

  function HaveNoMessage() {                                //无更多记录
	var $div = $("<div></div>");
	var $span = $("<span></span>");
	$div.addClass("have_no_message");
	$span.appendTo($div);
	$(".real_content").children("div").prepend($div);
	$span.text("已经到底啦！");
  }

  function HaveMoreMessage() {
	var $div = $("<div></div>");
	var $span = $("<span></span>");
	$div.addClass("acquire_more_message");
	$span.appendTo($div);
	$(".real_content").children("div").prepend($div);
	$span.text("获取更多聊天记录");
  }

  $(".real_content").children("div").on("click",".acquire_more_message",function() {
	AcquireMoreMessage(message);
  });

  function GetChatRecord() {                              //获取与好友的聊天记录
	  var data = [
			{
			"sender":"昵称1",//字符串，消息的发信人
			"receiver" :"群主",//字符串，消息的接收者
			"content" :"测试",//字符串，消息的内容
			"date" :"2018-09-28 23:48:45",//字符串，消息发送的时间
			}
			];
	  var length = data.length;
	  var i;
	  if (length == 0) {
		HaveNoMessage();
		$("#昵称1").find("pre").text("");
		return false;
	  }else if (length < 20) {
		HaveNoMessage();
	    for (i = 0; i < length; i++) {
		  if(data[i].sender === "昵称1") {
		    CreatFriendsMessage(data[i].content,data[i].date);
		  }else {
		    CreatMyMessage(data[i].content,data[i].date);
			$(".real_content").children().children("div:last").find(".ico_loading").hide();
		  }
	    }
	  }else {
		SaveRecord(data);
		HaveMoreMessage();
		for(i = length - 20; i < length; i++) {
		  if (data[i].sender === $titleId) {
			CreatFriendsMessage(data[i].content,data[i].date);
		  }else {
			CreatMyMessage(data[i].content,data[i].date);
			$(".real_content").children().children("div:last").find(".ico_loading").hide();
		  }
		}
	  }
	  $(".real_content").scrollTop($(".real_content")[0].scrollHeight);         //滚到底端
	  $("#昵称1").find("pre").text($(".real_content").children().children("div:last").find("pre").text());
	  $("#昵称1").children(".ext").children().text($(".real_content").children().children("div:last").find("span").text());
  }

  $(".btn_send").click(function(){                                              //发送信息
	var $editArea = $(".edit_area");
	var $now = AcquireTime().substring(11,16);
	if($titleId === ""){
      PromptBox("未选择好友！");
	  return false;
	}else if($editArea.val() === "" || $editArea.val().replace(/\s+/g,"") === "") {
	  PromptBox("消息不能为纯空格或为空！");
	  return false;
	}else {
      CreatMyMessage($editArea.val(),$now);
		$(".real_content").children().children("div:last").find(".ico_loading").hide();
		$(".real_content").scrollTop($(".real_content")[0].scrollHeight);
		$editArea.val("");
		$("#昵称1").find(".msg").children().text($(".real_content").children().children("div:last").find("pre").text());
	    $("#昵称1").children(".ext").children().text($(".real_content").children().children("div:last").find("span").text());
		//$(".recent_chat_list").prepend($("#昵称1").detach());
	}
  });

  function AcquireTime() {                                  //获取当前时间
	var $time = new Date();
	var $year = $time.getFullYear();
	var $month = $time.getMonth()+1;
	var $day = $time.getDate();
	var $hour = $time.getHours();
	var $minute = $time.getMinutes();
	var $second = $time.getSeconds();
	$month = CheckTime($month);
	$day = CheckTime($day);
	$hour = CheckTime($hour);
	$minute = CheckTime($minute);
	$second = CheckTime($second);
	var $now = $year + "-" + $month + "-" + $day + " " + $hour + ":" + $minute + ":" + $second;
	return $now;
  }

  function CheckTime(i) {
	if(i < 10) {
	  i = "0" + i;
	}
	return i;
  }

  $(".edit_area").keydown(function(event){                      //enter发送  ctrl+enter换行
	 if(event.keyCode == "13" && !(event.ctrlKey)) {
	   $(".btn_send").click();
	   return false;
	 }
	 else if(event.ctrlKey && event.keyCode == "13") {
	   var pos = this.selectionEnd;
	   var $area;
	   $area = $(this).val().substring(0,pos) + "\n" + $(this).val().substring(pos);
	   $(this).val($area);
	   this.setSelectionRange(pos + 1, pos + 1);
	 }
  });

  function CreatMyMessage(content,date) {                          //创建实时发信气泡
	var $time = ShowTime(date);
	var $div1 = $("<div></div>");
	$div1.css("overflow","hidden");
	var $myMessage = $("<div></div>");
	$myMessage.addClass("my_message");
	var $systemTime = $("<div></div>");
	$systemTime.addClass("system_time");
	var $span = $("<span></span>");
	var $img = $("<img />");
	$img.attr("src","img/webwxgeticon.jpg");
	var $div2 = $("<div></div>");
	$div2.css("overflow","hidden");
	var $bubble = $("<div></div>");
	$bubble.addClass("bubble");
	var $bubbleCont = $("<div></div>");
	$bubbleCont.addClass("bubble_cont");
	var $plain = $("<div></div>");
	$plain.addClass("plain");
	var $pre = $("<pre></pre>");
	var $icoLoading = $("<img />");
	$icoLoading.addClass("ico_loading");
	$icoLoading.attr("src","img/loading.gif");
	$pre.appendTo($plain);
	$icoLoading.appendTo($plain);
	$plain.appendTo($bubbleCont);
	$bubbleCont.appendTo($bubble);
	$bubble.appendTo($div2);
	$span.appendTo($systemTime);
	$systemTime.appendTo($myMessage);
	$img.appendTo($myMessage);
	$div2.appendTo($myMessage);
	$myMessage.appendTo($div1);
	$div1.appendTo($(".real_content").children("div"));
	$span.text($time);
	$pre.text(content);
  }

  function CreatMyRecord(content,date) {                                    //创建聊天记录中的发信气泡
	var $time = ShowTime(date);
	var $div1 = $("<div></div>");
	$div1.css("overflow","hidden");
	var $myMessage = $("<div></div>");
	$myMessage.addClass("my_message");
	var $systemTime = $("<div></div>");
	$systemTime.addClass("system_time");
	var $span = $("<span></span>");
	var $img = $("<img />");
	$img.attr("src","img/webwxgeticon.jpg");
	var $div2 = $("<div></div>");
	$div2.css("overflow","hidden");
	var $bubble = $("<div></div>");
	$bubble.addClass("bubble");
	var $bubbleCont = $("<div></div>");
	$bubbleCont.addClass("bubble_cont");
	var $plain = $("<div></div>");
	$plain.addClass("plain");
	var $pre = $("<pre></pre>");
	$pre.appendTo($plain);
	$plain.appendTo($bubbleCont);
	$bubbleCont.appendTo($bubble);
	$bubble.appendTo($div2);
	$span.appendTo($systemTime);
	$systemTime.appendTo($myMessage);
	$img.appendTo($myMessage);
	$div2.appendTo($myMessage);
	$myMessage.appendTo($div1);
	$(".real_content").children("div").prepend($div1);
	$span.text($time);
	$pre.text(content);
  }

  function CreatFriendsMessage(content,date) {              //创建实时收信气泡
	var $time = ShowTime(date);
	var $div1 = $("<div></div>");
	$div1.css("overflow","hidden");
	var $yourMessage = $("<div></div>");
	$yourMessage.addClass("your_message");
	var $systemTime = $("<div></div>");
	$systemTime.addClass("system_time");
	var $span = $("<span></span>");
	var $img = $("<img />");
	$img.attr("src",$titleImg);
	var $div2 = $("<div></div>");
	$div2.css("overflow","hidden");
	var $h4 = $("<h4></h4>");
	var $yourBubble = $("<div></div>");
	$yourBubble.addClass("your_bubble");
	var $bubbleCont = $("<div></div>");
	$bubbleCont.addClass("bubble_cont");
	var $plain = $("<div></div>");
	$plain.addClass("plain");
	var $pre = $("<pre></pre>");
	$pre.appendTo($plain);
	$plain.appendTo($bubbleCont);
	$bubbleCont.appendTo($yourBubble);
	$h4.appendTo($div2);
	$yourBubble.appendTo($div2);
	$span.appendTo($systemTime);
	$systemTime.appendTo($yourMessage);
	$img.appendTo($yourMessage);
	$div2.appendTo($yourMessage);
	$yourMessage.appendTo($div1);
	$div1.appendTo($(".real_content").children("div"));
	$span.text($time);
	$pre.text(content);
	$h4.text($titleName);
  }

  function CreatFriendsRecord(content,date) {              //创建聊天记录中的收信气泡
	var $time = ShowTime(date);
	var $div1 = $("<div></div>");
	$div1.css("overflow","hidden");
	var $yourMessage = $("<div></div>");
	$yourMessage.addClass("your_message");
	var $systemTime = $("<div></div>");
	$systemTime.addClass("system_time");
	var $span = $("<span></span>");
	var $img = $("<img />");
	$img.attr("src",$titleImg);
	var $div2 = $("<div></div>");
	$div2.css("overflow","hidden");
	var $h4 = $("<h4></h4>");
	var $yourBubble = $("<div></div>");
	$yourBubble.addClass("your_bubble");
	var $bubbleCont = $("<div></div>");
	$bubbleCont.addClass("bubble_cont");
	var $plain = $("<div></div>");
	$plain.addClass("plain");
	var $pre = $("<pre></pre>");
	$pre.appendTo($plain);
	$plain.appendTo($bubbleCont);
	$bubbleCont.appendTo($yourBubble);
	$h4.appendTo($div2);
	$yourBubble.appendTo($div2);
	$span.appendTo($systemTime);
	$systemTime.appendTo($yourMessage);
	$img.appendTo($yourMessage);
	$div2.appendTo($yourMessage);
	$yourMessage.appendTo($div1);
	$(".real_content").children("div").prepend($div1);
	$span.text($time);
	$pre.text(content);
	$h4.text($titleName);
  }

  function ShowTime(date) {                                   //根据日期显示不同详细度的时间
	var $time;
	var acquireTime = AcquireTime();
	if (date.substring(0,4) != acquireTime.substring(0,4)) {
	  $time = date;
	}else if (date.substring(5,10) != acquireTime.substring(5,10)){
	  $time = date.substring(5,16);
	}else {
	  $time = date.substring(11,16);
	}
	return $time;
  }

  function AcquireCursorPage(event) {                     //获取鼠标点击的位置
    var page = {
	  "pageX": event.pageX,
	  "pageY": event.pageY
	};
	return page;
  }

  $(".real_content").children().on("click","div img",function(event) {               //点击好友头像展开信息面板
	var $page = AcquireCursorPage(event);
	$(".details").hide();
	$(".context_menu").hide();
	$(".your_details").hide();
	$(".emoji_panel").fadeOut();
	$(".room_members_wrap").slideUp(200);
	if($(this).attr("src") == "img/webwxgeticon.jpg") {
	  $(".details").css("left",$page.pageX);
	  $(".details").css("top",$page.pageY);
      $(".details").show(300);
	}else {
	  $(".your_details").css("left",$page.pageX);
	  $(".your_details").css("top",$page.pageY);
      $(".your_details").show(300);
	}
    event.stopPropagation();
	$(".set_menu").hide();
	$(".search_list").hide();
  });


  $(".recent_chat_list").on("contextmenu",function() {                         //阻止最近聊天框的右键菜单
	return false;
  });

  var $id = "";

  $(".recent_chat_list").on("contextmenu",".recent_item",function(event){             //右键弹出删除聊天按钮
	$(".context_menu").hide();
	$id = $(this).attr("id");
    var $page = AcquireCursorPage(event);
	$(".context_menu").css("left",$page.pageX);
	$(".context_menu").css("top",$page.pageY);
    $(".context_menu").show();
    return false;
  });

  $(".detail_the_chat a").click(function() {                                          //删除聊天
	if($("#" + $id).hasClass("highlight")) {
      $titleId = "";
      $(".real_content").children().empty();
	  $(".title_name").text("未选择聊天");
	}
	$("#" + $id).remove();
  });

  $(".web_wechat_face").click(function(event) {                                 //表情栏
	$(".emoji_panel").toggle();
	event.stopPropagation();
  });

  $(".title").click(function(event) {                                     //呼出聊天框上边昵称的菜单
	if($(".title_name").text() != "未选择聊天") {
	  event.stopPropagation();
	  $(".details").hide();
	  $(".context_menu").hide();
	  $(".your_details").hide();
	  $(".emoji_panel").fadeOut();
      $(".search_list").hide();
	  $(".set_menu").hide();
	  if($(".room_members_wrap").is(":hidden")) {
		$(this).children("i").removeClass("web_wechat_down_icon").addClass("web_wechat_up_icon");
		$(".room_members_wrap").slideDown(200);
	  }else {
		$(this).children("i").removeClass("web_wechat_up_icon").addClass("web_wechat_down_icon");
		$(".room_members_wrap").slideUp(200);
	  }
	}
  });

  Notification.requestPermission();                                   //桌面通知允许请求

  function CreatNotification(data) {                                  //桌面通知
	if($(".menuicon_push_on").length > 0) {
  	  var notice = new Notification($("." + data.sender).find("h4").text(),{
        body: data.content,
	    tag: data.sender,
	    icon: $("." + data.sender).find("img").attr("src"),
	    renotify: false,
	    timestamp: '',
	  });
	  setTimeout(function() {
	    notice.close();
	  },3000);
	}
  }

  $(".inform_control").click(function() {
	if($(this).children("i").hasClass("menuicon_push_on")) {
	  $(this).children("i").removeClass("menuicon_push_on").addClass("menuicon_push_off");
	  $(this).children("span").text("打开桌面通知");
	}else{
	  $(this).children("i").removeClass("menuicon_push_off").addClass("menuicon_push_on");
	  $(this).children("span").text("关闭桌面通知");
	}
  });


});
