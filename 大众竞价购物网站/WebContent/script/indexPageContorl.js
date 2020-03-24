$(function () {

    /**
     * 获取登录名
     */
    function initUserName() {
        $(".user").text(sessionStorage.getItem('userName'));
    }
    /**
     * 获取所有商品
     */
    function acquireProducts() {
        $.post("/大众竞价购物网站/productsServlet", {
            //无
        }, function(result) {
            if(result.result == "failed") {
                alert(result.reason);
            } else {
                document.querySelector(".biding").innerHTML = null;
                document.querySelector(".notStart").innerHTML = null;
                for(let product of result.productList1) {
                    createProduct(product, 1);
                }
                for(let product of result.productList2) {
                    createProduct(product, 0);
                }
                goToPreview();
            }
            
        })
    }

    /**
     * 
     * @param {*} product 商品对象
     * @param {*} flag 正在进行的  1   还是尚未开始的   0
     */
    function createProduct(product, flag) {
        if(flag == 1) {
            product.imgLink = product.imgLink.split("webContent\\")[1].replace(/\s*/g, "");
            var obj = `
            <div class="grid_1_of_4 images_1_of_4">
                <a href="preview.html"><img src=${product.imgLink} alt="" style="width: 100%; height: 240px;"/></a>   
                <h2>${product.pName}</h2>
                <div class="price-details">
                    <div class="price-number">
                        <p>起拍价：<span class="rupees startprice-number">￥${product.startPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p>一口价：<span class="rupees maxprice-number">￥${product.maxPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p>结束时间：<span class="rupees restTime">${product.endTime}</span></p>
                    </div>
                    <div class="add-cart">
                        <h4><a class="goToPreview" id=${product.productID}>马上参与！</a></h4>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>`;
            document.querySelector(".biding").insertAdjacentHTML("beforeend", obj);
        } else {
            product.imgLink = product.imgLink.split("webContent\\")[1].replace(/\s*/g, "");
            var obj = `
            <div class="grid_1_of_4 images_1_of_4">
                <a href="preview.html"><img src=${product.imgLink} alt="" style="width: 100%; height: 240px;"/></a>
                <h2>${product.pName}</h2>
                <div class="price-details">
                    <div class="price-number">
                        <p>起拍价：<span class="rupees startprice-number">￥${product.startPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p>一口价：<span class="rupees maxprice-number">￥${product.maxPrice}</span></p>
                    </div>
                    <div class="price-number">
                        <p>开始时间：<span class="rupees restTime">${product.startTime}</span></p>
                    </div>
                    <div class="wait-start">
                        <h4><a id=${product.productID}>尚未开始</a></h4>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>`
            document.querySelector(".notStart").insertAdjacentHTML("beforeend", obj);
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

    function logout() {
        $(".logout").on("click", function() {
            $.post("/大众竞价购物网站/logoutServlet", {

            }, function(result) {
                if(result.result == "failed") {
                    console.log(result.result);
                } else {
                    window.location.href="login.html";
                }
            })
        })
    }

    initUserName();
    acquireProducts();
    acquireCart();
    logout();
    setInterval(function () {
        acquireProducts();
    }, 1000);
    setInterval(function () {
        acquireCart();
    }, 1000);
})

