$(function() {

    
    /**
     * 函数描述：登录事件
     * 参数描述：无
     * 返回值：无
     */
    function login() {
        let loginBtn = $(".login_btn");
        loginBtn.on("click", function(event) {
            let sellerId = $("#login_user_id").val();
            let sellerPassword = $("#login_user_password").val();
            let user = $(".user");
            event.preventDefault();
            if(loginInformationValidation(sellerId, sellerPassword)) {
                $.post("/大众竞价购物网站/sellerLoginServlet", {
                    sellerId: sellerId,
                    sellerPassword: sellerPassword
                }, function(result) {
                    if(result.result == "success") {
                        user.text(result.sellerName);
                        switchLoginToMain();
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
     * 函数描述：登出事件
     * 参数描述：无
     * 返回值：无
     */
    function logout() {
        let logoutBtn = $(".logout");
        logoutBtn.click(function() {
            $.post("/大众竞价购物网站/sellerLogoutServlet", {
                    //no parameter
            }, function(result) {
                if(result.result == "failed") {
                    alert(result.reason)
                } else {
                    switchMainToLogin();
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
        $("#main_order").hide();
        $("#main_content").show();
    }

    function switchMainToOrder() {
        $(".without_login").hide();
        $(".login_btn_container").hide();
        $(".welcome").show();
        $(".menu_container_top").show();
        $("#main_login").hide();
        $("#main_content").hide();
        $("#main_order").show();
    }

    /**
    * 函数描述：发布商品
    * 参数描述：无
    *  返回值：无
    */
    function release() {
        let release = $(".submit");
        release.click(function () {
            let productImage = document.getElementById('pImg').files[0];
            let reader = new FileReader();  
            reader.readAsDataURL(productImage);
            reader.onload = function(e) {
                let imgNum = this.result.split("base64,")[1];
                console.log(imgNum);
                $.post("/大众竞价购物网站/releaseProductServlet", {
                    productName: $(".pName").val(),
                    productNum: $(".pNum").val(),
                    productImage: imgNum,
                    beginTime: $(".beginTime").val(),
                    endTime: $(".endTime").val(),
                    startPrice: $(".startPrice").val(),
                    maxPrice: $(".maxPrice").val(),
                    productExplain: $(".pIntroduction").val()
                }, function (result) {
                    if (result.result == "failed") {
                        alert(result.reason)
                    } else {
                        alert("发布成功");
                    }
                })
            }            
        })
    }

    /**
     * 获取所有订单
     */
    function acquireOrders() {
        if($(".main_order").is(":hidden")) {
            return ;
        }
        $.post("/大众竞价购物网站/getSellerOrderServlet", {
            //无
        }, function(result) {
            if(result.result == "failed") {
                alert(result.reason);
            } else {
                document.querySelector(".biding").innerHTML = null;
                document.querySelector(".notStart").innerHTML = null;
                document.querySelector(".haveFinished").innerHTML = null;
                for(let order of result.productList) {
                    if(order.oState.replace(/\s*/g, "") == "待处理") {
                        createProduct(order, 1);
                    } else if(order.oState.replace(/\s*/g, "") == "待收货") {
                        createProduct(order, 0);
                    } else {
                        createProduct(order, 2);
                    }
                    
                }
                productShip();
            }
            
        })
    }

    function clickOrder() {
        $(".check_product").on("click", function() {
            switchMainToOrder();
        })
    }

    function clickRelease() {
        $(".release_product").on("click", function() {
            switchLoginToMain();
        })
    }
    /**
     * 
     * @param {*} product 订单对象
     * @param {*} flag 正在进行的  1   还是待收货   0  还是已完成 2  
     */
    function createProduct(order, flag) {
        if(flag == 1) {
            order.pImgLink = order.pImgLink.split("webContent\\")[1].replace(/\s*/g, "");
            var obj = `
            <div class="grid_1_of_4 images_1_of_4">
                <a href="preview.html"><img src=${order.pImgLink} alt="" /></a>   
                <h2>${order.pName}</h2>
                <div class="price-details">
                    <div class="price-number">
                        <p>付款：<span class="rupees">￥${order.oPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p><span class="rupees" style="font-size: 12px;color:#9C9C9C">下单时间：${order.aSubmitTime}</span></p>
                    </div>
                    <div class="add-cart">
                        <h4><a id=${order.productID} class="ship">立即发货<span class="shoppingCartID" style="display:none">${order.shoppingCartID}</span></a></h4>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>`;
            document.querySelector(".biding").insertAdjacentHTML("beforeend", obj);
        } else if(flag == 0) {
            order.pImgLink = order.pImgLink.split("webContent\\")[1].replace(/\s*/g, "");
            var obj = `
            <div class="grid_1_of_4 images_1_of_4">
                <a href="preview.html"><img src=${order.pImgLink} alt="" /></a>   
                <h2>${order.pName}</h2>
                <div class="price-details">
                    <div class="price-number">
                        <p>付款：<span class="rupees">￥${order.oPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p><span class="rupees" style="font-size: 12px;color:#9C9C9C">下单时间：${order.aSubmitTime}</span></p>
                    </div>
                    <div class="wait-start">
                        <h4><a class="orderConfirm" id=${order.productID}>等待确认</a></h4>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>`;
            document.querySelector(".notStart").insertAdjacentHTML("beforeend", obj);
        } else {
            order.pImgLink = order.pImgLink.split("webContent\\")[1].replace(/\s*/g, "");
            var obj = `
            <div class="grid_1_of_4 images_1_of_4">
                <a href="preview.html"><img src=${order.pImgLink} alt="" /></a>   
                <h2>${order.pName}</h2>
                <div class="price-details">
                    <div class="price-number">
                        <p>付款：<span class="rupees">￥${order.oPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p><span class="rupees" style="font-size: 12px;color:#9C9C9C">下单时间：${order.aSubmitTime}</span></p>
                    </div>
                    <div class="wait-start">
                        <h4><a class="deleteOrder" id=${order.productID}>已完成</a></h4>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>`;
            document.querySelector(".haveFinished").insertAdjacentHTML("beforeend", obj);
        }


    }

    function productShip() {
        $(".ship").on("click", function() {
            var productID = $(this).attr("id");
            var shoppingCartID = $(this).children(".shoppingCartID").text();
            $.post("/大众竞价购物网站/productShipServlet", {
                productID: productID,
                shoppingCartID: shoppingCartID
            }, function(result) {
                if(result.result == "failed") {
                    alert(result.reason);
                }                
            });
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
     * 函数描述：初始化所有事件的绑定
     * 参数描述：无
     * 返回值：无
     */
    function mobileEventIninit() {
        switchMainToLogin();
        login();
        clearEventDefault();
        logout();
        release();
        clickRelease();
        clickOrder();
    }
    mobileEventIninit();

    acquireOrders();
    setInterval(function () {
        acquireOrders();
    }, 1000);
})