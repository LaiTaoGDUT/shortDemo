/**
*用于设置布局的js代码
*/

/**
 * 函数描述：以数组的形式返回屏幕的宽和高
 * 参数描述：无参数
 * 返回值：一个长度为2的Array，第一个元素为宽，第二个元素为高
 */
function getScreenSize() {
    let screenX = window.innerWidth;
    let screenY = window.innerHeight;
    console.log('屏幕宽高：' + screenX + 'x' + screenY);
    return [screenX, screenY];
}

/**
 * 函数描述：设置页面元素的宽度
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，width为需要设置的宽度
 * 返回值：无
 */
function setElementWidth(elementName, width) {
    document.querySelector(elementName).style.width = width + 'px';
}

/**
 * 函数描述：设置页面元素的高度
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，height为需要设置的高度
 * 返回值：无
 */
function setElementHeight(elementName, height) {
    document.querySelector(elementName).style.height = height + 'px';
}

/**
 * 函数描述：设置页面所有匹配元素的宽度
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，width为需要设置的宽度
 * 返回值：无
 */
function setElementWidthAll(elementName, width) {
    document.querySelectorAll(elementName).forEach(function(item) {
        item.style.width = width + 'px';
    })
}

/**
 * 函数描述：设置页面所有匹配元素的高度
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，height为需要设置的高度
 * 返回值：无
 */
function setElementHeightAll(elementName, height) {
    document.querySelectorAll(elementName).forEach(function(item) {
        item.style.height = height + 'px';
    })
}

/**
 * 函数描述：设置元素字体的大小
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，fontSize为需要设置的大小
 * 返回值：无
 */
function setElementFontSize(elementName, fontSize) {
    document.querySelector(elementName).style.fontSize = fontSize + 'px';
}

/**
 * 函数描述：设置所有匹配元素字体的大小
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，fontSize为需要设置的大小
 * 返回值：无
 */
function setElementFontSizeAll(elementName, fontSize) {
    document.querySelectorAll(elementName).forEach(function(item) {
        item.style.fontSize = fontSize + 'px';
    })
}

/**
 * 函数描述：设置边框底部的厚度，样式和颜色
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          width为需要设置的厚度，style为样式，默认值为solid，color为颜色，默认值为black
 * 返回值：无
 */
function setElementBorderBottom(elementName, width, style = "solid", color = "black") {
    let ele = document.querySelector(elementName);
    ele.style.borderBottomWidth = width + 'px';
    ele.style.borderBottomStyle = style;
    ele.style.borderBottomColor = color;
}

/**
 * 函数描述：设置所有匹配元素边框底部的厚度，样式和颜色
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          width为需要设置的厚度，style为样式，默认值为solid，color为颜色，默认值为black
 * 返回值：无
 */
function setElementBorderBottomAll(elementName, width, style = "solid", color = "black") {
    document.querySelectorAll(elementName).forEach(function(ele) {
        ele.style.borderBottomWidth = width + 'px';
        ele.style.borderBottomStyle = style;
        ele.style.borderBottomColor = color;
    })
}

/**
 * 函数描述：设置边框顶部的厚度，样式和颜色
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          width为需要设置的厚度，style为样式，默认值为solid，color为颜色，默认值为black
 * 返回值：无
 */
function setElementBorderTop(elementName, width, style = "solid", color = "black") {
    let ele = document.querySelector(elementName);
    ele.style.borderTopWidth = width + 'px';
    ele.style.borderTopStyle = style;
    ele.style.borderTopColor = color;
}

/**
 * 函数描述：设置所有匹配元素边框顶部的厚度，样式和颜色
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          width为需要设置的厚度，style为样式，默认值为solid，color为颜色，默认值为black
 * 返回值：无
 */
function setElementBorderTopAll(elementName, width, style = "solid", color = "black") {
    document.querySelectorAll(elementName).forEach(function(ele) {
        ele.style.borderTopWidth = width + 'px';
        ele.style.borderTopStyle = style;
        ele.style.borderTopColor = color;
    })
}

/**
 * 函数描述：设置边框左边的厚度，样式和颜色
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          width为需要设置的厚度，style为样式，默认值为solid，color为颜色，默认值为black
 * 返回值：无
 */
function setElementBorderLeft(elementName, width, style = "solid", color = "black") {
    let ele = document.querySelector(elementName);
    ele.style.borderLeftWidth = width + 'px';
    ele.style.borderLeftStyle = style;
    ele.style.borderLeftColor = color;
}

/**
 * 函数描述：设置边框右边的厚度，样式和颜色
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          width为需要设置的厚度，style为样式，默认值为solid，color为颜色，默认值为black
 * 返回值：无
 */
function setElementBorderRight(elementName, width, style = "solid", color = "black") {
    let ele = document.querySelector(elementName);
    ele.style.borderRightWidth = width + 'px';
    ele.style.borderRightStyle = style;
    ele.style.borderRightColor = color;
}

/**
 * 函数描述：设置元素的绝对定位
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          top，right，bottom，left分别为到顶部，右侧，底部，左侧的距离,默认值均为0
 * 返回值：无
 */
function setElementPosition(elementName, top = 0, right = 0, bottom = 0, left = 0) {
    let ele = document.querySelector(elementName);
    ele.style.top = top + 'px';
    ele.style.right = right + 'px';
    ele.style.bottom = bottom + 'px';
    ele.style.left = left + 'px';
}

/**
 * 函数描述：设置所有匹配元素的绝对定位
 * 参数描述：elementName为元素的标识，如：'.element','#element','element'，
 *          top，right，bottom，left分别为到顶部，右侧，底部，左侧的距离,默认值均为0
 * 返回值：无
 */
function setElementPositionAll(elementName, top = 0, right = 0, bottom = 0, left = 0) {
    document.querySelectorAll(elementName).forEach(function(ele) {
        ele.style.top = top + 'px';
        ele.style.right = right + 'px';
        ele.style.bottom = bottom + 'px';
        ele.style.left = left + 'px';
    })
}


/**
 * 函数描述：检查当前为PC端还是手机端
 * 参数描述：无参数
 * 返回值：0为PC端，1为手机端
 */
function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return 1;
    } else {
        return 0;
    }
}
var screenSize = getScreenSize();     //获取一下屏幕宽高
/**
 * 函数描述：设置布局的主函数
 * 参数描述：无参数
 * 返回值：无
 */
function layoutSet() {
    let redirect = browserRedirect();   //获取当前设备
    if(redirect == 1) {     //手机端
        /*标题栏的布局设置*/
        setElementHeight("#header", screenSize[1] / 12);    //把  标题栏  的高度设置成固定的1/12屏幕高度
        setElementBorderBottom("#header", screenSize[1] / 400);    //把  标题栏的边框底部厚度  设置为固定的1/400屏幕高度大小
        setElementFontSize(".header_titleBar_title", screenSize[1] / 40);    //把  标题的字体大小  设置为固定的1/40屏幕高度大小
        setElementHeight(".header_menu_icon", screenSize[1] / 23);    //把 菜单图标的高度 设置为固定的1/18屏幕高度大小
        setElementWidth(".header_menu_icon", screenSize[1] / 23);    //把  菜单图标的宽度  设置为固定的1/18屏幕高度大小
        setElementWidth(".header_menu_set", screenSize[1] / 5);    //把  标题栏右侧菜单的宽度  设置为固定的1/4屏幕高度大小
        setElementPosition(".header_menu_set", screenSize[1] / 14.5, 0, 0, -screenSize[1] / 9 - 15);   //把  标题栏右侧菜单  的position  设置为固定的屏幕高度大小
        setElementHeightAll(".header_menu_dropdown_menu i", screenSize[1] / 26);    //把 菜单项里面的图标的高度 设置为固定的1/26屏幕高度大小
        setElementWidthAll(".header_menu_dropdown_menu i", screenSize[1] / 26);    //把  菜单项里面的图标的宽度  设置为固定的1/26屏幕高度大小
        /*底部选择菜单的布局设置*/
        setElementHeight("#footer", screenSize[1] / 14);    //把  底部菜单  的高度设置成固定的1/16屏幕高度
        setElementBorderTop("#footer", screenSize[1] / 400);    //把  底部菜单的边框顶部厚度  设置为固定的1/400屏幕高度大小
        setElementBorderRight(".footer_onlineQueue", screenSize[1] / 600);    //把  底部菜单左选项的边框右边厚度  设置为固定的1/600屏幕高度大小
        setElementFontSize("#footer", screenSize[1] / 50);    //把 底部菜单的字体大小 设置成固定的1/55屏幕高度大小
        /*中间内容区的布局设置*/
        setElementBorderBottomAll(".content_title", screenSize[1] / 800);//把  小标题的边框底部厚度  设置为固定的1/600屏幕高度大小
        setElementBorderTopAll(".content_title", screenSize[1] / 800);//把  小标题的边框顶部厚度  设置为固定的1/600屏幕高度大小
        setElementHeightAll(".content_title_icon", screenSize[1] / 28);    //把 下指图标的高度 设置为固定的1/32屏幕高度大小
        setElementWidthAll(".content_title_icon", screenSize[1] / 28);    //把  下指图标的宽度  设置为固定的1/18屏幕高度大小
        setElementFontSizeAll(".content_title_detail", screenSize[1] / 50);    //把 ‘附近的餐厅’的字体大小 设置成固定的1/40屏幕高度大小
        setElementHeightAll(".content_list", screenSize[1] - screenSize[1] / 12 - screenSize[1] / 400 - screenSize[1] / 14 - screenSize[1] / 400 - screenSize[1] / 28 - screenSize[1] / 800); //设置 内容区 的高度
        // setElementHeight(".my_number_content", screenSize[1] - screenSize[1] / 12 - screenSize[1] / 400 - screenSize[1] / 14 - screenSize[1] / 400 - 2 * screenSize[1] / 28 - screenSize[1] / 800); //设置 内容区 的高度
        setElementHeight(".overdue_number_content", screenSize[1] - screenSize[1] / 12 - screenSize[1] / 400 - screenSize[1] / 14 - screenSize[1] / 400 - 2 * screenSize[1] / 28 - screenSize[1] / 800 - screenSize[1] / 11 - screenSize[1] / 25); //设置 内容区 的高度
        /*店铺卡片的布局设置*/
        setElementHeightAll(".content_list_item_avatar", screenSize[1] / 11);    //设置店铺头像的高度
        setElementWidthAll(".content_list_item_avatar", screenSize[1] / 11);     //设置店铺头像的宽度
        setElementFontSizeAll(".content_list_item_detail_shopName", screenSize[1] / 40);  //设置店铺名字的字体大小
        setElementHeightAll(".content_list_item_detail_score i", screenSize[1] /60);    //设置评分星星的高度
        setElementWidthAll(".content_list_item_detail_score i", screenSize[1] / 60);     //设置评分星星的宽度
        setElementFontSizeAll(".content_list_item_detail_teamLength", screenSize[1] / 60);  //设置店铺等待人数的字体大小
        // setElementPositionAll(".content_list_item_botton", 0,  screenSize[1] / 50, 0, 0);   //设置排队按钮的位置
        setElementHeightAll(".content_list_item_botton", screenSize[1] /24);    //设置排队按钮的高度
        setElementWidthAll(".content_list_item_botton", screenSize[1] / 10);     //设置排队按钮的宽度
        setElementFontSizeAll(".content_list_item_botton", screenSize[1] / 60);  //设置排队按钮的字体大小
        setElementFontSizeAll(".content_list_item_detail_spend", screenSize[1] / 62);  //设置店铺人均消费的字体大小
        /*订单卡片的布局设置*/
        setElementFontSizeAll(".content_list_item_detail_remain", screenSize[1] / 60);  //设置剩余订单的字体大小
        setElementFontSizeAll(".content_list_item_detail_remain_number", screenSize[1] / 50);  //设置剩余订单内数字的字体大小
        setElementFontSizeAll(".content_list_item_detail_expectWaitTime", screenSize[1] / 60);  //设置预计等待时间的字体大小
        setElementFontSizeAll(".content_list_item_detail_expectWaitTime_number", screenSize[1] / 50);  //设置预计等待时间的数字的字体大小
        setElementFontSizeAll(".content_list_item_remain", screenSize[1] / 60);  //设置提醒的字体大小
        setElementWidthAll(".content_list_item_remain_control", screenSize[1] / 50);  //设置提醒勾选框的宽度
        setElementHeightAll(".content_list_item_remain_control", screenSize[1] / 50);  //设置提醒勾选框的高度
        setElementBorderTop(".my_number_content_openDetails", screenSize[1] / 800); //设置详情的边框顶部厚度
        setElementFontSizeAll(".my_number_content_openDetails", screenSize[1] / 50); //设置详情的字体大小
        /*历史订单卡片的布局设置*/
        setElementFontSizeAll(".overdue_nmuber_content_state", screenSize[1] / 60);  //设置订单状态的字体大小
        setElementFontSizeAll(".overdue_nmuber_content_time", screenSize[1] / 60);  //设置订单时间的字体大小
        setElementHeightAll(".overdue_nmuber_content_again", screenSize[1] /30);    //设置再来一单按钮的高度
        setElementWidthAll(".overdue_nmuber_content_again", screenSize[1] / 12);     //设置再来一单按钮的宽度
        setElementFontSizeAll(".overdue_nmuber_content_again", screenSize[1] / 60);  //设置再来一单的字体大小
        setElementFontSizeAll(".overdue_nmuber_content_comment", screenSize[1] / 60);  //设置去评价的字体大小
        
    } else {   //PC端
        /*标题栏的布局设置*/
        setElementHeight("#header", screenSize[1] / 8);    //把标题栏的高度设置成固定的1/8屏幕高度
        setElementBorderBottom("#header", screenSize[1] / 250);    //把标题栏的边框底部厚度设置为固定的1/250屏幕高度大小
        setElementFontSize(".header_titleBar_title", screenSize[1] / 28);    //把标题的字体大小设置成固定的1/28屏幕高度大小
        setElementFontSize(".header_menu_list_login a", screenSize[1] / 36);    //把“登陆”的字体大小设置为固定的1/36屏幕高度大小
        setElementWidthAll(".header_menu_list li", screenSize[1] / 9);    //设置顶部右边菜单的宽度
        setElementHeightAll(".header_menu_list li", screenSize[1] / 19);    //设置顶部右边菜单的高度
        setElementWidthAll(".header_menu_list li a", screenSize[1] / 9);    //把“登陆”的按钮宽度设置为固定的1/9屏幕高度大小
        setElementHeightAll(".header_menu_list li a", screenSize[1] / 19);    //把“登陆”的按钮高度设置为固定的1/19屏幕高度大小
        setElementFontSize(".header_menu_list_register", screenSize[1] / 42);    //把“注册”的字体大小设置为固定的1/42屏幕高度大小
        setElementFontSize(".header_menu_list_about", screenSize[1] / 42);    //把“关于我们”的字体大小设置为固定的1/42屏幕高度大小
        setElementFontSize(".header_menu_list_help", screenSize[1] / 42);    //把“帮助”的字体大小设置为固定的1/42屏幕高度大小
        /*底部选择菜单的布局设置*/
        setElementHeight("#footer", screenSize[1] / 16);    //把  底部菜单的高度  设置成固定的1/15屏幕高度
        setElementBorderTop("#footer", screenSize[1] / 250);    //把  底部菜单的边框顶部厚度  设置为固定的1/250屏幕高度大小
        setElementBorderRight(".footer_onlineQueue", screenSize[1] / 400);    //把  底部菜单左选项的边框右边厚度  设置为固定的1/400屏幕高度大小
        setElementFontSize("#footer", screenSize[1] / 50);    //把 底部菜单的字体大小 设置成固定的1/40屏幕高度大小
        /*中间内容区的布局设置*/
        setElementBorderBottomAll(".content_title", screenSize[1] / 600);//把  小标题的边框底部厚度  设置为固定的1/600屏幕高度大小
        setElementBorderTopAll(".content_title", screenSize[1] / 800);//把  小标题的边框顶部厚度  设置为固定的1/600屏幕高度大小
        setElementHeightAll(".content_title_icon", screenSize[1] / 28);    //把 下指图标的高度 设置为固定的1/屏幕高度大小
        setElementWidthAll(".content_title_icon", screenSize[1] / 28);    //把  下指图标的宽度  设置为固定的1/18屏幕高度大小
        setElementFontSizeAll(".content_title_detail", screenSize[1] / 55);    //把 ‘附近的菜单’的字体大小 设置成固定的1/40屏幕高度大小
        setElementHeightAll(".content_list", screenSize[1] - screenSize[1] / 8 - screenSize[1] / 16 - screenSize[1] / 250 - screenSize[1] / 250 - screenSize[1] /28 - screenSize[1] /600); //设置 内容区 的高度
        // setElementHeight(".my_number_content", screenSize[1] - screenSize[1] / 8 - screenSize[1] / 16 - screenSize[1] / 250 - screenSize[1] / 250 - 2 * screenSize[1] /28 - screenSize[1] /600); //设置 内容区 的高度
        setElementHeight(".overdue_number_content", screenSize[1] - screenSize[1] / 8 - screenSize[1] / 250 - screenSize[1] / 16 - screenSize[1] / 250 - 2 * screenSize[1] /28 - screenSize[1] /600 - screenSize[1] / 12 - 2 * screenSize[1] / 50); //设置 内容区 的高度
        /*店铺卡片的布局设置*/
        setElementHeightAll(".content_list_item_avatar", screenSize[1] / 12);    //设置店铺头像的高度
        setElementWidthAll(".content_list_item_avatar", screenSize[1] / 12);     //设置店铺头像的宽度
        setElementFontSizeAll(".content_list_item_detail_shopName", screenSize[1] / 40);  //设置店铺名字的字体大小
        setElementHeightAll(".content_list_item_detail_score i", screenSize[1] /60);    //设置评分星星的高度
        setElementWidthAll(".content_list_item_detail_score i", screenSize[1] / 60);     //设置评分星星的宽度
        setElementFontSizeAll(".content_list_item_detail_teamLength", screenSize[1] / 60);  //设置店铺等待人数的字体大小
        // setElementPositionAll(".content_list_item_botton", 0,  screenSize[1] / 50, 0, 0);   //设置排队按钮的位置
        setElementHeightAll(".content_list_item_botton", screenSize[1] /24);    //设置排队按钮的高度
        setElementWidthAll(".content_list_item_botton", screenSize[1] / 10);     //设置排队按钮的宽度
        setElementFontSizeAll(".content_list_item_botton", screenSize[1] / 64);  //设置排队按钮的字体大小
        setElementFontSizeAll(".content_list_item_detail_spend", screenSize[1] / 60);  //设置店铺人均消费的字体大小
        /*订单卡片的布局设置*/
        setElementFontSizeAll(".content_list_item_detail_remain", screenSize[1] / 60);  //设置剩余订单的字体大小
        setElementFontSizeAll(".content_list_item_detail_remain_number", screenSize[1] / 53);  //设置剩余订单内数字的字体大小
        setElementFontSizeAll(".content_list_item_detail_expectWaitTime", screenSize[1] / 60);  //设置预计等待时间的字体大小
        setElementFontSizeAll(".content_list_item_detail_expectWaitTime_number", screenSize[1] / 53);  //设置预计等待时间的数字的字体大小
        setElementFontSizeAll(".content_list_item_remain", screenSize[1] / 60);  //设置提醒的字体大小
        setElementWidthAll(".content_list_item_remain_control", screenSize[1] / 50);  //设置提醒勾选框的宽度
        setElementHeightAll(".content_list_item_remain_control", screenSize[1] / 50);  //设置提醒勾选框的高度
        setElementBorderTop(".my_number_content_openDetails", screenSize[1] / 800);//设置详情的边框顶部厚度
        setElementFontSizeAll(".my_number_content_openDetails", screenSize[1] / 50); //设置详情的字体大小
        /*历史订单卡片的布局设置*/
        setElementFontSizeAll(".overdue_nmuber_content_state", screenSize[1] / 60);  //设置订单状态的字体大小
        setElementFontSizeAll(".overdue_nmuber_content_time", screenSize[1] / 60);  //设置订单时间的字体大小
        setElementHeightAll(".overdue_nmuber_content_again", screenSize[1] /30);    //设置再来一单按钮的高度
        setElementWidthAll(".overdue_nmuber_content_again", screenSize[1] / 12);     //设置再来一单按钮的宽度
        setElementFontSizeAll(".overdue_nmuber_content_again", screenSize[1] / 64);  //设置再来一单的字体大小
        setElementFontSizeAll(".overdue_nmuber_content_comment", screenSize[1] / 64);  //设置去评价的字体大小
    }  
}

window.onload=function () {
    layoutSet();
}

window.onresize=function () {
    screenSize = getScreenSize();
    layoutSet();
    
}
