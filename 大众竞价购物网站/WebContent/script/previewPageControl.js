$(function () {

    /**
     * 获取商品ID
     */
    function initProductID() {
        return sessionStorage.getItem('productID');
    }
    /**
     * 获取登录名
     */
    function initUserName() {
        $(".user").text(sessionStorage.getItem('userName'));
    }
    var productID = initProductID();

    /**
     * 获取商品详情
     */
    var startMoney, maxMoney, myMoney;
    function acquireProducts() {
        $.post("/大众竞价购物网站/getProductSerlvet", {
            productID: productID
        }, function(result) {
            if(result.result == "failed") {
                if(result.reason == "after") {
                    alert("该商品的竞价已结束！");
                    window.location.href="index.html";
                } else {
                    alert(result.reason);
                    window.location.href="index.html"; 
                }
            } else {
                var product = result.product;
                auction();
                addAuction();
                product.imgLink = product.imgLink.split("webContent\\")[1];
                $(".pName").text(product.pName);
                $(".pExplain").text(product.pExplain);
                $(".imgLink").attr("src", product.imgLink);
                $(".startPrice").text("￥" + product.startPrice);
                startMoney = product.startPrice;
                $(".maxPrice").text("￥" + product.maxPrice);
                $(".pNum").text(product.pNum);
                maxMoney = product.maxPrice;
                if(product.myPrice == "") {
                    //
                } else {
                    $(".myPrice").text("￥" + product.myPrice);
                    myMoney = product.myPrice;
                    $(".auction_f").hide();
                    $(".maxAuction_f").show();
                    $(".addAuction_f").show();
                }
                setInterval(function() {
                    var time = timeSub(product.endTime);
                    if( time != 0) {
                        $(".restTime").text(time);
                    } else {
                        alert("该商品的竞价已结束！");
                        window.location.href="index.html";
                    }
                }, 1000);
                setInterval(function() {
                    $.post("/大众竞价购物网站/acquireRankingServlet", {
                        productID: productID
                    }, function(result) {
                        var count = 1;
                        document.querySelector(".ranking").innerHTML = null;
                        for(let a of result.productList1) {
                            var list;
                            if(a.customerID.replace(/\s*/g, "") == sessionStorage.getItem('userId')) {
                                $(".myRanking").text(count);
                                list = `<li><a href="#">${count++}  ${a.cName}(我)  ￥${a.bid}</a></li>`
                                document.querySelector(".ranking").insertAdjacentHTML("beforeend", list);
                            } else {
                                list = `<li><a href="#">${count++}  ${a.cName}  ￥${a.bid}</a></li>`
                                document.querySelector(".ranking").insertAdjacentHTML("beforeend", list);
                            }
                            
                            
                        }
                        
                    });
                }, 1000);
            }
            
        })
    }

    /**
     * 参与竞价
     */
    function auction() {
        $(".auction").on("click", function() {
            $.post("/大众竞价购物网站/auctionServlet", {
                productID: productID
            }, function(result) {
                $(".myPrice").text("￥" + result.myPrice);
                myMoney = result.myPrice;
                $(".auction_f").hide();
                $(".maxAuction_f").show();
                $(".addAuction_f").show();
            });
        })
    }

    /**
     * 加价
     */
    function addAuction() {
        $(".addAuction").on("click", function() {
            var addMoney = parseFloat(myMoney) + Math.floor(((parseFloat(maxMoney) - parseFloat(startMoney)) * 0.1), 0);
            if(addMoney > parseFloat(maxMoney)) {
                addMoney = parseFloat(maxMoney);
            }
            $.post("/大众竞价购物网站/addAuctionServlet", {
                productID: productID,
                addMoney: addMoney
            }, function(result) {
                myMoney = addMoney;
                $(".myPrice").text("￥" + myMoney);
            });
        })
        $(".maxAuction").on("click", function() {
            $.post("/大众竞价购物网站/addAuctionServlet", {
                productID: productID,
                addMoney: parseFloat(maxMoney)
            }, function(result) {
                myMoney = parseFloat(maxMoney);
                $(".myPrice").text("￥" + myMoney);
            });
        })
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
    function timeSub(date) {
        var date2 = new Date(date);
        var time;
        var date1 = new Date();
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
                    time = hour + ":" + min + ":" + afterMin;
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
    logout();
    acquireProducts();
    acquireCart();
    setInterval(function () {
        acquireCart();
    }, 1000);
});