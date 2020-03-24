$(function () {

    /**
     * 获取登录名
     */
    function initUserName() {
        $(".user").text(sessionStorage.getItem('userName'));
    }
    /**
     * 获取所有订单
     */
    function acquireProducts() {
        $.post("/大众竞价购物网站/getOrderServlet", {
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
            }
            productReceipt();
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
                    <div class="wait-start">
                        <h4><a id=${order.productID}>待发货</a></h4>
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
                    <div class="add-cart">
                        <h4><a class="orderConfirm" id=${order.productID}>确认收货</a></h4>
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
                    <div class="add-cart">
                        <h4><a class="deleteOrder" id=${order.productID}>删除订单</a></h4>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>`;
            document.querySelector(".haveFinished").insertAdjacentHTML("beforeend", obj);
        }


    }

    function goToPreview() {
        let goToPreview = $(".goToPreview");
        goToPreview.on("click", function(event) {
            sessionStorage.setItem('productID', $(this).attr("id"));
            window.location.href="preview.html";
        });
        
    }

    /**
     * 获取购物车内的商品
     */
    function acquireCart() {
        $.post("/大众竞价购物网站/getCartProductionServlet", {
            //无
        }, function(result) {
            var totalNum = 0, totalPrice = 0;
            if(result.result == "failed") {
                alert(result.reason);
            } else {
                document.querySelector(".dropdown").innerHTML = null;
                for(let product of result.productList) {
                    var list = `<li>${product.pName} ￥${product.tail} 剩余3天 <a href="#" class="pay button" style="font-size:10px"><span class="paying" style="display:none">${product.productID}</span>支付尾款</a></li>`
                    totalPrice += parseFloat(product.tail);
                    totalNum++;
                    document.querySelector(".dropdown").insertAdjacentHTML("beforeend", list);
                }
                $(".totalNum").text(totalNum);
                $(".totalPrice").text(totalPrice);
                generateOrder();
            }
            
        })
    }

    function generateOrder() {
        $(".pay").on("click", function() {
            var productID = $(this).children(".paying").text();
            $.post("/大众竞价购物网站/generateOrderServlet", {
                productID: productID
            }, function(result) {
                if(result.result == "failed") {
                    alert(result.reason);
                }                
            });
        });
    }

        /**
     * 
     * @param {计算当前时间和date的差值} date 
     */
    function timeSub(date2, date1 = new Date()) {
        var date2 = new Date(date);
        var time;
        var s1 = date1.getTime(),s2 = date2.getTime();
        var total = (s2 - s1)/1000;
        var day = parseInt(total / (24*60*60));//计算整数天数
        var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
        var hour = parseInt(afterDay/(60*60));//计算整数小时数
        var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
        var min = parseInt(afterHour/60);//计算整数分
        var afterMin = Math.floor(total - day*24*60*60 - hour*60*60 - min*60, 0);//取得算出分后剩余的秒数
        if(day == 0) {
            if(hour != 0) {
                if(min < 10) {
                    time =  hour + ":0" + min + ":" + afterMin;
                } else {
                    time = min + ":" + afterMin;
                }
            } else if (min != 0){
                if(min < 10) {
                    time =  "0" + min + ":" + afterMin;
                } else {
                    time = min + ":" + afterMin;
                }
                
            } else {
                time = afterMin;
            }
        } else {
            if(min < 10) {
                time = day + "天" + hour + ":0" + min + ":" + afterMin;
            } else {
                time = day + "天" + hour + ":" + min + ":" + afterMin;
            }
            
        }
        return time;
    }


    function productReceipt() {
        $(".orderConfirm").on("click", function() {
            var productID = $(this).attr("id");
            $.post("/大众竞价购物网站/productReceiptServlet", {
                productID: productID,
            }, function(result) {
                if(result.result == "failed") {
                    alert(result.reason);
                }                
            });
        });
    }

    initUserName();
    acquireProducts();
    acquireCart();
    setInterval(function () {
        acquireProducts();
    }, 1000);
    setInterval(function () {
        acquireCart();
    }, 1000);
})

