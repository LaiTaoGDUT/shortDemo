
/**
 * 函数描述：判断元素是否隐藏
 * 参数描述：element为元素对象，而非字符串，先获取对象再传入
 * 返回值：true为隐藏，false为未隐藏
 */
function isHidden(element) {
    if(element.style.display == 'none' || element.style.visibility == 'hidden') {
        return true;
    } else {
        return false;
    }
}
/**
 * 函数描述：判断元素是否含有某个特定的class
 * 参数描述：element为元素对象，而非字符串，先获取对象再传入, cla为class名字，字符串
 * 返回值：true为含有，false为不含有
 */
function hasClass(element, cla) {
    if(element.className.trim().length === 0){
        return false;
    }
    let allClass = element.className.trim().split(" ");
    return allClass.indexOf(cla) > -1;
}
/**
 * 函数描述：为元素添加一个class
 * 参数描述：element为元素对象，而非字符串，先获取对象再传入, cla为class名字，字符串
 * 返回值：无
 */
function addClass(element, cla){
    element.classList.add(cla);
}

/**
 * 函数描述：为元素移除一个class
 * 参数描述：element为元素对象，而非字符串，先获取对象再传入, cla为class名字，字符串
 * 返回值：无
 */
function removeClass(element, cla){
    element.classList.remove(cla);
}

/**
 * 函数描述：显示元素
 * 参数描述：element为元素对象，而非字符串，先获取对象再传入
 * 返回值：
 */
function show(element) {
    element.style.display = 'block';
}
/**
 * 函数描述：隐藏元素
 * 参数描述：element为元素对象，而非字符串，先获取对象再传入
 * 返回值：
 */
function hide(element) {
    element.style.display = 'none';
}
/**
 * 函数描述：设置标题栏右侧菜单的点击事件
 * 参数描述：无
 * 返回值：无
 */
function setHeaderMenuIconEvent() {
    const headerMenuIcon = document.querySelector(".header_menu_icon");
    const headerMenuSet =  document.querySelector(".header_menu_set");
    headerMenuIcon.addEventListener("click", function() {
        if(isHidden(headerMenuSet)) {
            show(headerMenuSet);
        } else {
            hide(headerMenuSet);
        }
    })
}

/**
 * 函数描述：两个内容区的切换
 * 参数描述：无
 * 返回值：无
 */
function switchContentEvent() {
    const leftContent = document.querySelector(".leftContent");
    const rightContent = document.querySelector(".rightContent");
    const footerOnlineQueue = document.querySelector(".footer_onlineQueue");
    const footerQueueProgress = document.querySelector(".footer_queueProgress");
    footerOnlineQueue.addEventListener("click", function() {
        if(isHidden(leftContent)) {
            addClass(footerOnlineQueue, 'orangeColor');
            removeClass(footerQueueProgress, 'orangeColor');
            hide(rightContent);
            show(leftContent);
        } else {
            //do nothing
        }
    });
    footerQueueProgress.addEventListener("click", function() {
        if(isHidden(rightContent)) {
            removeClass(footerOnlineQueue,'orangeColor');
            addClass(footerQueueProgress, 'orangeColor');
            hide(leftContent);
            show(rightContent);
        } else {
            //do nothing
        }
    })
}
/**
 * 函数描述：剩余桌数提醒的勾选框是否选中的切换
 * 参数描述：无
 * 返回值：无
 */
function switchRemainControlCheckbox() {
    let contentListItemRemainControl = document.querySelectorAll('.content_list_item_remain_control');
    contentListItemRemainControl.forEach(function(ele) {
        ele.addEventListener('click', function(eve) {
            if(hasClass(eve.target, 'content_list_item_remain_control_yes')) {
                removeClass(eve.target, 'content_list_item_remain_control_yes');
            } else {
                addClass(eve.target, 'content_list_item_remain_control_yes');
            }
        }); 
    });
}
/**
 * 函数描述：绑定手机端详情的展开或隐藏事件
 * 参数描述：无
 * 返回值：无
 */

function switchOrderDetailsEventInMobile() {
    const contentListItemOpenDetails = document.querySelector('.content_list_item_openDetails');
    const myNumberContentOpenDetails = document.querySelector('.my_number_content_openDetails');
    contentListItemOpenDetails.addEventListener("click", function() {
        if(isHidden(myNumberContentOpenDetails)) {
            show(myNumberContentOpenDetails);
            contentListItemOpenDetails.children[1].innerHTML = '收起';
            setElementHeight(".overdue_number_content", screenSize[1] - screenSize[1] / 12 - screenSize[1] / 400 - screenSize[1] / 14 - screenSize[1] / 400 - 2 * screenSize[1] / 28 - 2 * screenSize[1] / 800 - screenSize[1] / 11 - screenSize[1] / 25 - 3 * screenSize[1] / 50 - 6 * screenSize[1] / 50);

        } else {
            hide(myNumberContentOpenDetails);
            contentListItemOpenDetails.children[1].innerHTML = '详情';
            setElementHeight(".overdue_number_content", screenSize[1] - screenSize[1] / 12 - screenSize[1] / 400 - screenSize[1] / 14 - screenSize[1] / 400 - 2 * screenSize[1] / 28 - screenSize[1] / 800 - screenSize[1] / 11 - screenSize[1] / 25);
        }
    })
}

/**
 * 函数描述：绑定电脑端详情的展开或隐藏事件
 * 参数描述：无
 * 返回值：无
 */
function switchOrderDetailsEventInPC() {
    const contentListItemOpenDetails = document.querySelector('.content_list_item_openDetails');
    const myNumberContentOpenDetails = document.querySelector('.my_number_content_openDetails');
    contentListItemOpenDetails.addEventListener("click", function() {
        if(isHidden(myNumberContentOpenDetails)) {
            show(myNumberContentOpenDetails);
            contentListItemOpenDetails.children[1].innerHTML = '收起';
            setElementHeight(".overdue_number_content", screenSize[1] - screenSize[1] / 8 - screenSize[1] / 250 - screenSize[1] / 16 - screenSize[1] / 250 - 2 * screenSize[1] /28 - screenSize[1] /600 - screenSize[1] / 12 - 2 * screenSize[1] / 50 - 3 * screenSize[1] / 50 - 6 * screenSize[1] / 50);

        } else {
            hide(myNumberContentOpenDetails);
            contentListItemOpenDetails.children[1].innerHTML = '详情';
            setElementHeight(".overdue_number_content", screenSize[1] - screenSize[1] / 8 - screenSize[1] / 250 - screenSize[1] / 16 - screenSize[1] / 250 - 2 * screenSize[1] /28 - screenSize[1] /600 - screenSize[1] / 12 - 2 * screenSize[1] / 50);
        }
    })
}

/**
 * 函数描述：绑定点击抢号按钮弹出二次确认框事件
 * 参数描述：无
 * 返回值：无
 */
function clickQueueButtonEvent() {
    let contentListItemBotton = document.querySelectorAll('.content_list_item_botton');
    let maskFloorQueueButton = document.querySelector('.maskFloor_queueButton');
    contentListItemBotton.forEach(function(ele) {
        ele.addEventListener('click', function(eve) {
            show(maskFloorQueueButton);
        })
    })
}
/**
 * 函数描述：绑定点击二次确认框里面取消按钮的事件
 * 参数描述：无
 * 返回值：无
 */
function clickCancelEvent() {
    let contentListItemBotton = document.querySelectorAll('.maskFloor_secondConfirmBox_judge_cancel');
    let maskFloorQueueButton = document.querySelector('.maskFloor_queueButton');
    contentListItemBotton.forEach(function(ele) {
        ele.addEventListener('click', function() {
            hide(maskFloorQueueButton);
        })
    })
}

/**
 * 函数描述：初始化所有事件的绑定
 * 参数描述：无
 * 返回值：无
 */
function eventIninit() {
    setHeaderMenuIconEvent();
    switchRemainControlCheckbox();
    clickQueueButtonEvent();
    clickCancelEvent()
    if(browserRedirect() === 1) {   //手机端
        switchContentEvent();
        switchOrderDetailsEventInMobile();
    } else {
        show(document.querySelector('.rightContent'));
        switchOrderDetailsEventInPC();
    }
}

eventIninit();

