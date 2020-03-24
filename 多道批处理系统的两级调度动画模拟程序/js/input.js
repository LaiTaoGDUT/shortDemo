var resourceTypeTotalNum = 1;
var totalRcb = new Array({name: '磁带机', unit: '台', num: 4});
var trackNum = 2;
var idleTrackNum = trackNum;  //空闲道数
var waitQueue = new Array();
var cpuQueue = new Array(); //cpu队列
var runningQueue = new Array();
var finishedQueue = new Array();
var processQueue = new Array(new Array(), new Array());   //就绪队列数组，每个元素都用到一个就绪队列，SFJ算法用到第二个就绪队列
var processQueueNum = 2;   //多级反馈下就绪队列的长度
var finshedJobNum = 0;
var currentTime = new Array(10, 0);  //设置当前时间  时钟 和 秒钟
var bufferCurrentTime = new Array(10, 0);   //用来缓存当前时间，动画播完后才能更新缓存时间
var timeSlice = 1;   //时间片长度默认为1
var idleMemoryQueue = new Array();   //空闲分区队列
var busyMemoryQueue = new Array();   //忙碌分区队列
var totalMemoryNum = 120;   //设置系统总内存
var systemNeedMemory = 20;  //操作系统需要的内存
var minMemory = 5;    //最小可切割分区长度
var lastSearchPartition = 0;   //在循环首次适应算法中用来标识上次查询到的分区的下一个分区

function inputResource() {
    var resourceTypeTotalNum1 = prompt("系统有多少种资源？(除内存外）");
    if(resourceTypeTotalNum1 == null) {
        return;
    }
    resourceTypeTotalNum = Number(resourceTypeTotalNum1);
    document.querySelector(".hide_three").style.display = 'block';
    for(let i = 0; i < resourceTypeTotalNum; i++) {
        var a = `<div>
            资源<span>${i + 1}</span><br>
            资源名字：<input type="value" ><br>
            资源单位：<input type="value" ><br>
            资源数量：<input type="value" ><br>            
        </div>`
        document.querySelector(".resouceInput").innerHTML += a;
    }
}

function setTrackNum() {
    var trackNum1 = prompt("系统有多少道？(不大于6)");
    if(trackNum1 == null) {
        return;
    }
    trackNum = Number(trackNum1);
    idleTrackNum = trackNum;
    console.log(trackNum + "道");
}

function addNewJob() {
    var a = document.querySelector(".jobInput");
    a.querySelectorAll("div")[1].innerHTML = "";
    for(let i = totalRcb.length - 1; i >= 0 ; i--) {
        document.querySelector(".jobInput").querySelectorAll("div")[1].innerHTML += `需要${totalRcb[i].name}<input type="value" >(${totalRcb[i].unit})<br>`;
    }
    document.querySelector(".hide_two").style.display = 'block';
    var b = a.querySelectorAll("div")[0].querySelectorAll("input");
        b[0].value = "";
        b[1].value = currentTime[0]
        if(currentTime[1] < 10) {
            b[2].value = '0' + currentTime[1];
        } else {
            b[2].value = currentTime[1];
        }
        b[3].value = '';
}

document.querySelector(".revise2").addEventListener("click", function() {
    document.querySelector(".hide_three").style.display = 'none';
    totalRcb = new Array();
    var a = document.querySelector(".resouceInput").childNodes;
    var rcb = new RCB();
    for(let i = resourceTypeTotalNum; i > 0; i--) {
        rcb = new RCB(
            a[i].querySelectorAll("input")[0].value,  
            a[i].querySelectorAll("input")[1].value,
            parseInt(a[i].querySelectorAll("input")[2].value), 
        );
        console.log(rcb.name, rcb.num, rcb.unit);
        totalRcb.push(rcb);
    }
});

document.querySelector(".revise1").addEventListener("click", function() {
    document.querySelector(".hide_two").style.display = 'none';
    var a = document.querySelector(".jobInput").querySelectorAll("div");
    var pro = new Array();
    for(let i = totalRcb.length - 1; i >= 0 ; i--) {
        pro.push(new RCB(totalRcb[i].name, totalRcb[i].unit, Number(a[1].querySelectorAll("input")[totalRcb.length - 1 - i].value)));
    }
    var jcb = new JCB(
        a[0].querySelectorAll("input")[0].value, 
        'w', 
        new Array(parseInt(a[0].querySelectorAll("input")[1].value), parseInt(a[0].querySelectorAll("input")[2].value)), 
        parseInt(a[0].querySelectorAll("input")[3].value), 
        pro,
        null,
        null,
        null,
        0,
        parseInt(a[0].querySelectorAll("input")[4].value),
        
    );
    waitQueue.push(new job(waitStationX[waitQueue.length], waitStationY, '#e1e1e1',waitSize, jcb, -1, -1, false));
});

function setCurrentTime() {
    document.querySelector(".hide_one").style.display = 'block';
    var a = document.querySelector(".timeInput").querySelector("div");
    a.querySelectorAll("input")[0].value = currentTime[0];
    if(currentTime[1] < 10) {
        a.querySelectorAll("input")[1].value = '0' + currentTime[1];
    } else {
        a.querySelectorAll("input")[1].value = currentTime[1];
    }
}

function setTimeSlice() {
    var timeSlice1 = prompt("时间片长度是多少分钟？");
    if(timeSlice1 == null) {
        return;
    }
    timeSlice = Number(timeSlice1);
    console.log("时间片变更为" + timeSlice1 + "分");
}

function setQueueNum() {
    var processQueueNum1 = prompt("几级反馈？（1或2)");
    if(processQueueNum1 == null) {
        return;
    }
    processQueueNum = Number(processQueueNum1);
    console.log("反馈队列数变更为" + processQueueNum1 + "条");
}

function setTotalMemory() {
    var totalMemoryNum1 = prompt("系统总内存有多少KB？");
    if(totalMemoryNum1 == null) {
        return;
    }
    totalMemoryNum = Number(totalMemoryNum1);
    console.log("系统内存变更为" + totalMemoryNum1 + "KB");
    initMemoryPartition();
}

function changeProcessNumToOne() {
    processQueueNum = 1;
    console.log('就绪队列变更为' + processQueueNum + '条');
}

function changeProcessNumToTwo() {
    processQueueNum = 2;
    console.log('就绪队列变更为' + processQueueNum + '条');
}

document.querySelector(".revise3").addEventListener("click", function() {
    document.querySelector(".hide_one").style.display = 'none';
    var a = document.querySelector(".timeInput").querySelector("div");
    currentTime[0] = parseInt(a.querySelectorAll("input")[0].value);
    currentTime[1] = parseInt(a.querySelectorAll("input")[1].value);
    if(currentTime[1] < 10) {
        console.log("设置时间为：" + currentTime[0] + ':' + '0' + currentTime[1]);
    } else {
        console.log("设置时间为：" + currentTime[0] + ':' + currentTime[1]);
    }
});

document.querySelectorAll(".cancel").forEach(function(ele) {
    ele.addEventListener("click", function() {
        document.querySelector(".hide_one").style.display = 'none';
        document.querySelector(".hide_two").style.display = 'none';
        document.querySelector(".hide_three").style.display = 'none';
    });
})

function addDefaultJob() {
    var pro1 = new Array();
    pro1.push(new RCB(totalRcb[0].name, totalRcb[0].unit,2));
    var jcb1 = new JCB(
        'JOB1', 
        'w', 
        new Array(10, 0), 
        25, 
        pro1,
        null,
        null,
        null,
        0,
        15
    );
    waitQueue.push(new job(waitStationX[waitQueue.length], waitStationY, '#e1e1e1',waitSize, jcb1, -1, -1, false));
    var pro2 = new Array();
    pro2.push(new RCB(totalRcb[0].name, totalRcb[0].unit,1));
    var jcb2 = new JCB(
        'JOB2', 
        'w', 
        new Array(10, 20), 
        30, 
        pro2,
        null,
        null,
        null,
        0,
        60
    );
    waitQueue.push(new job(waitStationX[waitQueue.length], waitStationY, '#e1e1e1',waitSize, jcb2, -1, -1, false));
    var pro3 = new Array();
    pro3.push(new RCB(totalRcb[0].name, totalRcb[0].unit,3));
    var jcb3 = new JCB(
        'JOB3', 
        'w', 
        new Array(10, 30), 
        10, 
        pro3,
        null,
        null,
        null,
        0,
        50
    );
    waitQueue.push(new job(waitStationX[waitQueue.length], waitStationY, '#e1e1e1',waitSize, jcb3, -1, -1, false));
    var pro4 = new Array();
    pro4.push(new RCB(totalRcb[0].name, totalRcb[0].unit,3));
    var jcb4 = new JCB(
        'JOB4', 
        'w', 
        new Array(10, 35), 
        20, 
        pro4,
        null,
        null,
        null,
        0,
        10
    );
    waitQueue.push(new job(waitStationX[waitQueue.length], waitStationY, '#e1e1e1',waitSize, jcb4, -1, -1, false));
    var pro5 = new Array();
    pro5.push(new RCB(totalRcb[0].name, totalRcb[0].unit,2));
    var jcb5 = new JCB(
        'JOB5', 
        'w', 
        new Array(10, 40), 
        15, 
        pro5,
        null,
        null,
        null,
        0,
        30
    );
    waitQueue.push(new job(waitStationX[waitQueue.length], waitStationY, '#e1e1e1',waitSize, jcb5, -1, -1, false));
}

/**
 * 重置
 */
var rotateCircle = 1;
function refresh() {
    runningProcess = null;
    resourceTypeTotalNum = 1;
    totalRcb = new Array({name: '磁带机', unit: '台', num: 4});
    trackNum = 2;
    idleTrackNum = trackNum;  //空闲道数
    waitQueue = new Array();
    runningQueue = new Array();
    finishedQueue = new Array();
    processQueue = new Array(new Array(), new Array());   //就绪队列数组，每个元素都用到一个就绪队列，SFJ算法用到第二个就绪队列
    processQueueNum = 2;   //多级反馈下就绪队列的长度
    finshedJobNum = 0;
    currentTime = new Array(10, 0);  //设置当前时间  时钟 和 秒钟
    bufferCurrentTime = new Array(10, 0);   //用来缓存当前时间，动画播完后才能更新缓存时间
    timeSlice = 1;   //时间片长度默认为1
    idleMemoryQueue = new Array();   //空闲分区队列
    busyMemoryQueue = new Array();   //忙碌分区队列
    totalMemoryNum = 120;   //设置系统总内存
    systemNeedMemory = 20;  //操作系统需要的内存
    minMemory = 5;    //最小可切割分区长度
    lastSearchPartition = 0;   //在循环首次适应算法中用来标识上次查询到的分区的下一个分区
    initMemoryPartition();
    var refresh = document.querySelector(".refresh");
    curren_rorate = 360 * rotateCircle++;
    refresh.style.transform = 'rotate('+curren_rorate+'deg)';
    refresh.style.webkitTransform = 'rotate('+curren_rorate +'deg)';
    refresh.style.mozTransform = 'rotate('+ curren_rorate +'deg)';
    refresh.style.msTransform = 'rotate('+ curren_rorate + 180 +'deg)';
    refresh.style.oTransform = 'rotate('+ curren_rorate + 180 +'deg)';
    var resultTable = `
    <table class="hovertable">
    <tr onmouseover="this.style.backgroundColor='#ffff66';" onmouseout="this.style.backgroundColor='#d4e3e5';">
        <td>总周转时间</td><td colspan="6" style="text-align: center;"><span class="turnaroundTime">0</span>(分)</td>
    </tr>
    <tr onmouseover="this.style.backgroundColor='#ffff66';" onmouseout="this.style.backgroundColor='#d4e3e5';">
        <td>总带权周转</td><td colspan="6" style="text-align: center;" class="totalTurnAround">0</td>
    </tr>
    <tr>
        <th>作业名</th><th>到达时间</th><th>要求服务</th><th>开始运行</th><th>完成时间</th><th>周转时间</th><th>带权周转</th>
    </tr>
    <tr onmouseover="this.style.backgroundColor='#ffff66';" onmouseout="this.style.backgroundColor='#d4e3e5';" class="noResult">
        <td colspan="7" style="text-align: center;">暂无作业</td>
    </tr>
    </table>
    `
    document.querySelector(".resultTable").innerHTML = "";
    document.querySelector(".resultTable").insertAdjacentHTML('beforeend', resultTable);
}

function switchTableShow() {
    var resultTable = document.querySelector(".resultTable");
    if(resultTable.style.visibility != "visible") {
        resultTable.style.visibility = "visible";
    } else {
        resultTable.style.visibility = "hidden";
    }
}