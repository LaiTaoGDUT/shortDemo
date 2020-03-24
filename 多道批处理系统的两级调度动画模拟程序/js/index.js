// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//设定作业方块的移动速度
const jobMoveSpeed = 4; 
//设定进程方块的移动速度
const pcbMoveSpeed = 4; 
//设定时间流动的速度 表示每多少帧刷新一次时间
const timeSpeed = 40;
//设定内存的变化速度
const memoryMoveSpeed = 1;

//设定等待作业的位置
const waitStationX = new Array()
const waitStationY = 120;
const waitSize = 100;

//设定完成作业的位置
const finStationX = new Array()
const finStationY = 780;
const finSize = 100;

//设定处理机的位置
const cpuStationX = new Array();
cpuStationX.push(1700);
const cpuStationY = 400;
const cpuSize = 200;

//设定进程调度模块的位置
const RAMStationX = 1000;
const RAMStationY = 300;
const RAMSizeX = 600;
const RAMSizeY = 400;
const RAMBorderSize = 15;

//设定等待进程的位置
const pcbStationX = new Array()
const pcbStationY = new Array();
const pcbSize = 54;

//设定内存分区的起始位置， 长度，所有内存分区宽度和的最大值
const mPartitionStartPointX = 600;
const mPartitionStartPointY = 250;
const mPartitionSizeX = 200;
const mPartitionSizeYSum = 500;
//设定内存分区的颜色
const idleMemoryColor = '#66FFCC';
const busyMemoryColor = '#f4f4f4';

//设定运行进程的位置
var runProcessStationX = RAMStationX + RAMSizeX / 2 - pcbSize / 2;
var runProcessStationY = RAMStationY + RAMSizeY / 2 + pcbSize;

pcbStationY[0] = RAMStationY + RAMBorderSize + pcbSize / 2 ;
pcbStationY[1] = RAMStationY + RAMBorderSize + pcbSize * 2;

// 生成随机数的函数
function random(min,max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

//生成随机颜色
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

/**
 * 设置队列等待元素的位置
 */
function setwaitLocationX() {
  var a = RAMStationX + RAMSizeX / 2 - waitSize / 2 - waitSize - 50;
  for(let i = 0; i < 20; i++) {
    waitStationX.push(a - (waitSize + 50) * i);;
  }
} 

setwaitLocationX();

/**
 * 设置队列完成元素的位置
 */
function setFinLocationX() {
  var a = 0;
  for(let i = 0; i < 20; i++) {
    finStationX.push(a + (finSize + 50) * i);
  }
} 

setFinLocationX();

/**
 * 设置等待进程的位置
 */
function setPcbLocationX() {
  var a = RAMStationX + RAMBorderSize;
  var maxNum = Math.floor((RAMSizeX - 2 * RAMBorderSize) / (pcbSize + pcbSize / 2)) - 1;
  for(let i = maxNum - 1; i >= 0; i--) {
    pcbStationX.push(a + (pcbSize + pcbSize / 2) * i);
  }
} 

setPcbLocationX();

/**
 * 
 * @param {int} x 作业的x坐标
 * @param {int} y 作业的y坐标
 * @param {*} color 颜色
 * @param {*} size 大小
 * @param {*} jcb 作业控制块
 * @param {int} needIntoCpu 需要进入cpu 如果为-1表示不需要，否则这个参数的值就是在目标队列的位置
 * @param {int} needComeOutCpu 需要从cpu出来 同上
 * @param {boolean} moveCompleted 是否已经移动完毕
 */
function job(x, y, color, size, jcb, needIntoCpu, needComeOutCpu, moveCompleted) {
  this.x = x;
  this.y = y;
  this.velY = 0;
  this.color = color;
  this.size = size;
  this.jcb = jcb;
  this.needIntoCpu = needIntoCpu;
  this.needComeOutCpu = needComeOutCpu;
  this.moveCompleted = moveCompleted;
}

/**
 * @param {boolean}  fin 指示这个job是不是在完成队列里面
 */
job.prototype.draw = function (fin) {
  if (!fin) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.font = "24px serif";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(this.jcb.name, this.x + this.size / 2, this.y + 12, this.size);
    ctx.font = "12px serif";
    if (this.jcb.stime[1] < 10) {
      ctx.fillText("到达时间:" + this.jcb.stime[0] + ':' + '0' + this.jcb.stime[1], this.x + this.size / 2, this.y + 32, this.size);
    } else {
      ctx.fillText("到达时间:" + this.jcb.stime[0] + ':' + this.jcb.stime[1], this.x + this.size / 2, this.y + 32, this.size);
    }
    ctx.fillText("运行时间:" + this.jcb.ntime + "(分)", this.x + this.size / 2, this.y + 46, this.size);
    ctx.fillText("需要内存：" + this.jcb.memoryNeed + 'KB', this.x + this.size / 2, this.y + 60, this.size)
    for (let i = 0; i < resourceTypeTotalNum; i++) {
      ctx.fillText("需要" + this.jcb.pro[i].name + ":" + this.jcb.pro[i].num + this.jcb.pro[i].unit, this.x + this.size / 2, this.y + 74 + i * 14, this.size);
    }
  } else {
    ctx.beginPath();
    ctx.fillStyle = "#94ddfd";
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.font = "24px serif";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(this.jcb.name, this.x + this.size / 2, this.y + 12, this.size);
    ctx.font = "12px serif";
    if (this.jcb.srtime[1] < 10) {
      ctx.fillText("开始运行时间:" + this.jcb.srtime[0] + ':' + '0' + this.jcb.srtime[1], this.x + this.size / 2, this.y + 32, this.size);
    } else {
      ctx.fillText("开始运行时间:" + this.jcb.srtime[0] + ':' + this.jcb.srtime[1], this.x + this.size / 2, this.y + 32, this.size);
    }
    if (this.jcb.finishedTime[1] < 10) {
      ctx.fillText("结束运行时间:" + this.jcb.finishedTime[0] + ':' + '0' + this.jcb.finishedTime[1], this.x + this.size / 2, this.y + 46, this.size);
    } else {
      ctx.fillText("结束运行时间:" + this.jcb.finishedTime[0] + ':' + this.jcb.finishedTime[1], this.x + this.size / 2, this.y + 46, this.size);
    }
    ctx.fillText("周转时间:" + timeSub(this.jcb.finishedTime, this.jcb.stime) + "(分)", this.x + this.size / 2, this.y + 60, this.size);
    ctx.fillText("带权周转时间:" + (timeSub(this.jcb.finishedTime, this.jcb.stime) / this.jcb.ntime).toFixed(2), this.x + this.size / 2, this.y + 74, this.size);
  }
}

job.prototype.intoCpu = function () {
  if (this.needIntoCpu == -1) {
    return;
  } else {

    if (this.x < waitStationX[0] + waitSize + 50) {
      if (this.y > waitStationY - waitSize) {
        this.y -= jobMoveSpeed;
        this.moveCompleted = false;
      } else {
        this.x += jobMoveSpeed;
        this.moveCompleted = false;
      }
    } else if (this.y < cpuStationY) {
      this.y += jobMoveSpeed;
      this.moveCompleted = false;
    } else {
      this.moveCompleted = true;
      var a = bufferQueue.splice(bufferQueue.indexOf(this), 1)[0];
      runningQueue.push(a);
      // var pcbScheduling = document.getElementsByName("pSelect")[0];
      // if(pcbScheduling.checked == false) { 
      //   //多级反馈作业一开始一定在第一队列
      //   processQueue[0].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[0], 'orange', 'black', pcbSize, false, 0, null)); 
      //   Object.defineProperty(processQueue[0][processQueue[0].length - 1], 'jcb',{
      //     get: function() { return a.jcb; },
      //     set: function(v) { a.jcb = v; }
      //   });
      // } else {
      //   processQueue[1].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[1], 'orange', 'black', pcbSize, false, 1, null)); 
      //   Object.defineProperty(processQueue[1][processQueue[1].length - 1], 'jcb',{
      //     get: function() { return a.jcb; },
      //     set: function(v) { a.jcb = v; }
      //   }); 
      // }
      this.needIntoCpu = -1;
    }

  }
}

job.prototype.intoFinishedQueue = function () {
  if (this.needComeOutCpu == -1) {
    return;
  } else {

    if (this.y < finStationY) {
      if(finStationY - this.y > jobMoveSpeed) {
        this.y += jobMoveSpeed;
      } else {
        this.y = finStationY;
      }
      this.moveCompleted = false;
    } else if (this.x > finStationX[this.needComeOutCpu]) {
      if(this.x - finStationX[this.needComeOutCpu]> jobMoveSpeed) {
        this.x -= jobMoveSpeed;
      } else {
        this.x = finStationX[this.needComeOutCpu];
      }
      this.moveCompleted = false;
    } else if (this.x < finStationX[this.needComeOutCpu]) {
      if(finStationX[this.needComeOutCpu] - this.x > jobMoveSpeed) {
        this.x += jobMoveSpeed;
      } else {
        this.x = finStationX[this.needComeOutCpu];
      }
      this.moveCompleted = false;
    }
    else {
      this.moveCompleted = true;
      this.needComeOutCpu = -1;
      finishedQueue.push(bufferQueue2.splice(bufferQueue2.indexOf(this), 1)[0]);
    }

  }
}

job.prototype.update = function () {
  if (this.x < waitStationX[waitQueue.indexOf(this)]) {
    if(waitStationX[waitQueue.indexOf(this)] - this.x > jobMoveSpeed) {
      this.x += jobMoveSpeed;
    } else {
      this.x = waitStationX[waitQueue.indexOf(this)];
    }
    this.moveCompleted = false;
  } else {
    this.moveCompleted = true;
  }
}

var totalJobNum = 0;
function insertSimulationResults(job) {
  var td = `
  <tr onmouseover="this.style.backgroundColor='#ffff66';" onmouseout="this.style.backgroundColor='#d4e3e5';">
    <td>${job.jcb.name}</td><td>${timeChange(job.jcb.stime)}</td><td>${job.jcb.ntime}</td><td>${timeChange(job.jcb.srtime)}</td><td>${timeChange(job.jcb.finishedTime)}</td><td>${timeSub(job.jcb.finishedTime, job.jcb.stime) + '(分)'}</td><td>${(timeSub(job.jcb.finishedTime, job.jcb.stime) / job.jcb.ntime).toFixed(2)}</td>
  </tr>
  `
  totalJobNum++;
  var noResult = document.querySelector(".noResult");
  if(noResult) {
    noResult.parentNode.removeChild(noResult);
  }
  document.querySelector(".hovertable").insertAdjacentHTML('beforeend', td);
  var turnaroundTime = document.querySelector(".turnaroundTime");
  var totalTrunAround = document.querySelector(".totalTurnAround");
  turnaroundTime.textContent =  ((parseFloat(turnaroundTime.textContent) * (totalJobNum - 1)  + timeSub(job.jcb.finishedTime, job.jcb.stime)) / totalJobNum).toFixed(2);
  totalTrunAround.textContent =  ((parseFloat(totalTrunAround.textContent) * (totalJobNum - 1) + parseFloat((timeSub(job.jcb.finishedTime, job.jcb.stime)  / job.jcb.ntime).toFixed(2))) / totalJobNum).toFixed(2);
}

/**
 * 进程对象，为了不和关键字冲突，A无实际意义
 * @param {int} x 进程的x坐标
 * @param {int} y 进程的y坐标
 * @param {*} color 颜色
 * @param {*} fontColor 字体颜色
 * @param {*} size 大小
 * @param {boolean} moveCompleted 是否已经移动完毕
 * @param {*} queue 在哪条就绪队列
 * @param {*} finTime (只在多级反馈)标志它运行完当前时间片的时间
 */
function processA(x, y, color,fontColor, size, moveCompleted, queue, finTime) {
  this.x = x;
  this.y = y;
  this.velY = 0;
  this.color = color;
  this.fontColor = fontColor;
  this.size = size;
  this.moveCompleted = moveCompleted;
  this.queue = queue;
  this.finTime = finTime;
}

processA.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.size, this.size);
  ctx.font = "24px serif";
  ctx.fillStyle = this.fontColor;
  ctx.textAlign = 'center';
  ctx.fillText(this.jcb.name, this.x + this.size / 2, this.y + this.size / 2, this.size);
}

processA.prototype.update = function() {
  if (this.x < pcbStationX[processQueue[this.queue].indexOf(this)]) {
    if(pcbStationX[processQueue[this.queue].indexOf(this)] - this.x > pcbMoveSpeed) {
      this.x += pcbMoveSpeed;
      this.moveCompleted = false;
    } else {
      this.x = pcbStationX[processQueue[this.queue].indexOf(this)];
    }
    this.moveCompleted = false;
  } else {
    this.moveCompleted = true;
  }
}

processA.prototype.run = function () {
  var pcbScheduling = document.getElementsByName("pSelect")[0];
  if(pcbScheduling.checked == false) {   //多级反馈只在每个队列里面按顺序来选择进程
    if(this.y < runProcessStationY) {
      if (this.x < pcbStationX[0] + pcbSize * 3 / 2) {
        if(pcbStationX[0] + pcbSize * 3 / 2 - this.x > pcbMoveSpeed) {
          this.x += pcbMoveSpeed;
        } else {
          this.x = pcbStationX[0] + pcbSize * 3 / 2;
        }
        this.moveCompleted = false;
      } else {
        if(runProcessStationY - this.y > pcbMoveSpeed) {
          this.y += pcbMoveSpeed;
        } else {
          this.y = runProcessStationY;
        }
        this.moveCompleted = false;
      }
    } else if(this.x > runProcessStationX) {
      if(this.x - runProcessStationX > pcbMoveSpeed) {
        this.x -= pcbMoveSpeed;
      } else {
        this.x = runProcessStationX;
      }
      this.moveCompleted = false;
    } else {
      this.moveCompleted = true;

    }
  } else {
    if ((this.x < pcbStationX[0] + pcbSize * 3 / 2) && (this.y < runProcessStationY)) {
      if(this.x < pcbStationX[processQueue[1].length]) {
        if(pcbStationX[processQueue[1].length] - this.x > pcbMoveSpeed) {
          this.x += pcbMoveSpeed;
        } else {
          this.x = pcbStationX[processQueue[1].length];
        }
      } else if (this.y > pcbStationY[this.queue] - pcbSize * 3 / 2) {
        if(this.y - (pcbStationY[this.queue] - pcbSize * 3 / 2) > pcbMoveSpeed) {
          this.y -= pcbMoveSpeed;
        } else {
          this.y = pcbStationY[this.queue] - pcbSize * 3 / 2;
        }
        this.moveCompleted = false;
      } else {
        if(pcbStationX[0] + pcbSize * 3 / 2 - this.x > pcbMoveSpeed) {
          this.x += pcbMoveSpeed;
        } else {
          this.x = pcbStationX[0] + pcbSize * 3 / 2;
        }
        this.moveCompleted = false;
      }
    } else if (this.y < runProcessStationY) {
      if(runProcessStationY - this.y > pcbMoveSpeed) {
        this.y += pcbMoveSpeed;
      } else {
        this.y = runProcessStationY;
      }
      this.moveCompleted = false;
    } else if(this.x > runProcessStationX) {
      if(this.x - runProcessStationX > pcbMoveSpeed) {
        this.x -= pcbMoveSpeed;
      } else {
        this.x = runProcessStationX;
      }
      this.moveCompleted = false;
    } else {
      this.moveCompleted = true;

    }
  }
}

processA.prototype.back = function () {
  if (this.x < pcbStationX[processQueue[this.queue].indexOf(this)]) {
    if(pcbStationX[processQueue[this.queue].indexOf(this)] - this.x > pcbMoveSpeed) {
      this.x += pcbMoveSpeed;
      this.moveCompleted = false;
    } else {
      this.x = pcbStationX[processQueue[this.queue].indexOf(this)];
    }
    return false;
  } else if(this.x > pcbStationX[processQueue[this.queue].indexOf(this)]) {
    if(this.x - pcbStationX[processQueue[this.queue].indexOf(this)] < pcbMoveSpeed) {
      this.x -= pcbMoveSpeed;
      this.moveCompleted = false;
    } else {
      this.x = pcbStationX[processQueue[this.queue].indexOf(this)];
    }
    this.moveCompleted = false;
    return false;
  }else if (this.y > pcbStationY[this.queue]) {
    if(this.y - pcbStationY[this.queue] > pcbMoveSpeed) {
      this.y -= pcbMoveSpeed;
      this.moveCompleted = false;
    } else {
      this.y = pcbStationY[this.queue];
    }
    this.moveCompleted = false;
    return false;
  } else {
    this.moveCompleted = true;
    return true;

  }
}

/**
 * cpu的构造函数
 * @param {*} x x坐标 
 * @param {*} y y坐标
 * @param {*} size 大小
 * @param {*} color 颜色
 */
function cpu(x, y, size, color) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.color = color;
}

cpu.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.size, this.size);
  ctx.font = "32px serif";
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle'
  ctx.fillText('处理机', this.x + this.size / 2, this.y + this.size / 2, this.size);
  ctx.font = "16px serif";
  ctx.fillText('运行作业数：' + (trackNum - idleTrackNum), this.x + this.size / 2, this.y + this.size / 2 + 64, this.size);
  if(idleTrackNum == trackNum) {
    ctx.fillText('空闲中...', this.x + this.size / 2, this.y + this.size / 2 - 64, this.size);
  } else {
    ctx.fillText('工作中...', this.x + this.size / 2, this.y + this.size / 2 - 64, this.size);
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.strokeRect(RAMStationX + RAMSizeX - 4, this.y + this.size / 3, this.x - RAMStationX - RAMSizeX + 4, this.size / 3);
  ctx.lineWidth = 1;
}

cpuQueue.push(new cpu(cpuStationX[0], cpuStationY, cpuSize, 'black'));

/**
 * 内存区域的构造函数，进程调度动画的执行区域
 * @param {*} x x坐标 
 * @param {*} y y坐标
 * @param {*} sizeX 长度
 * @param {*} sizeY 宽度
 * @param {*} color 颜色
 * @param {*} borderColor 边框颜色
 * @param {*} borderSize 边框大小
 */
function memoryArea(x, y, sizeX, sizeY, color, borderColor, borderSize) {
  this.x = x;
  this.y = y;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.color = color;
  this.borderColor = borderColor;
  this.borderSize = borderSize;
}

memoryArea.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.borderColor;
  ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x + this.borderSize, this.y + this.borderSize, this.sizeX - 2 * this.borderSize, this.sizeY - 2 * this.borderSize);
  ctx.fillStyle = 'black';
  var pcbScheduling = document.getElementsByName("pSelect")[0];
  if(pcbScheduling.checked == false) {
    if(processQueueNum == 1) {
      ctx.fillRect(this.x + this.borderSize, pcbStationY[0] + pcbSize, pcbStationX[0] + pcbSize - this.x - this.borderSize, 5);
    } else {
      ctx.fillRect(this.x + this.borderSize, pcbStationY[1] + pcbSize, pcbStationX[0] + pcbSize - this.x - this.borderSize, 5);
      ctx.fillRect(this.x + this.borderSize, pcbStationY[0] + pcbSize, pcbStationX[0] + pcbSize - this.x - this.borderSize, 5);
    }
  } else {
    ctx.fillRect(this.x + this.borderSize, pcbStationY[1] + pcbSize, pcbStationX[0] + pcbSize - this.x - this.borderSize, 5);
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = "green";
  ctx.strokeRect(runProcessStationX - 4, runProcessStationY - 4, pcbSize + 8, pcbSize + 8);
  ctx.lineWidth = 1;
}

var RAM = new memoryArea(RAMStationX, RAMStationY, RAMSizeX, RAMSizeY, "white", "#4CAF50", RAMBorderSize);

/**
 * 画队列下面的线条
 */
function drawQueueBaseLine() {
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, waitStationY + waitSize, RAMStationX + RAMSizeX / 2 - waitSize / 2 - 50, 5);
  ctx.fillStyle = 'green';
  ctx.fillRect(0, finStationY + finSize, canvas.width, 5);
}

/**
 * 画系统资源的变动情况
 */
function drawtotalResource() {
  ctx.beginPath();
  ctx.font = "24px serif";
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle'
  var beginL = canvas.height / 3 + 16;
  ctx.fillText("系统总资源", 80, canvas.height / 3);
  ctx.font = "16px serif";
  for(let i = resourceTypeTotalNum - 1; i >= 0; i--) {
    ctx.fillText(totalRcb[i].name + "：" + totalRcb[i].num + " " + totalRcb[i].unit, 80, beginL + (resourceTypeTotalNum - i) * 32);
  }
}

function drawSimulationResults() {

}

/**
 * 内存分区对象
 * @param {int} x x坐标
 * @param {int} y y坐标
 * @param {int} sizeX 长度
 * @param {int} sizeY 宽度
 * @param {*} color 颜色
 * @param {mp} 分区表项
 * @param {*} moveCompleted 动画是否已经完成
 * 下面两个是分区对象的属性，aimY初始化时应该和y一致，aimSize初始化时应该和sizeY一致，无需手动设置
 * @param {*} aimY  该分区位置的目标最高点  （因为需要播放内存变化的动画，需要一个目标位置让它缩放）
 * @param {*} aimSize 该分区的目标大小      （最高点和大小唯一决定一个需要变化的位置目标）
 */
function memoryPartition(x, y, sizeX, sizeY, color, mp, moveCompleted) {
  this.x = x;
  this.y = y;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.color = color;
  this.aimY = y;
  this.aimSize = sizeY;
  this.mp = mp;
  this.moveCompleted = moveCompleted;
}

memoryPartition.prototype.draw = function() {
  if(this.sizeY == 0) {
    return ;
  }
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
  ctx.strokeStyle = 'black';
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x + this.sizeX, this.y);
  ctx.moveTo(this.x, this.y + this.sizeY);
  ctx.lineTo(this.x + this.sizeX, this.y + this.sizeY);
  ctx.stroke();  
  if(this.sizeY < 10) {   //如果分区已经太小了就不画文字了
    return;
  }
  ctx.font = "16px serif";
  ctx.fillStyle = 'black';
  if(this.mp.belong != null) {
    if(this.mp.belong == 'system') {
      ctx.fillText('操作系统使用中', this.x + this.sizeX / 2, this.y + this.sizeY / 2);
      if (this.y != this.aimY) {
        ctx.fillText(Math.floor(totalMemoryNum / mPartitionSizeYSum * (this.y - mPartitionStartPointY), 0), this.x - 20, this.y);
      } else {
        ctx.fillText(this.mp.startAddress, this.x - 20, this.y);
      }
      if (this.sizeY != this.aimSize) {
        ctx.fillText(Math.floor(totalMemoryNum / mPartitionSizeYSum * (this.y - mPartitionStartPointY + this.sizeY), 0), this.x - 20, this.y + this.sizeY);
      } else {
        ctx.fillText(this.mp.startAddress + this.mp.size, this.x - 20, this.y + this.sizeY);
      }
    } else {
      ctx.fillText(this.mp.belong + '使用中', this.x + this.sizeX / 2, this.y + this.sizeY / 2);
      if (this.sizeY != this.aimSize) {
        ctx.fillText(Math.floor(totalMemoryNum / mPartitionSizeYSum * (this.y - mPartitionStartPointY + this.sizeY), 0), this.x - 20, this.y + this.sizeY);
      } else {
        ctx.fillText(this.mp.startAddress + this.mp.size, this.x - 20, this.y + this.sizeY);
      }
    }
  } else {
    ctx.fillStyle = 'black';
    ctx.fillText('分区' + this.mp.number, this.x + this.sizeX / 2, this.y + this.sizeY / 2);
    if (this.sizeY != this.aimSize) {
      ctx.fillText(Math.floor(totalMemoryNum / mPartitionSizeYSum * (this.y - mPartitionStartPointY + this.sizeY), 0), this.x - 20, this.y + this.sizeY);
    } else {
      ctx.fillText(this.mp.startAddress + this.mp.size, this.x - 20, this.y + this.sizeY);
    }
  }
}

memoryPartition.prototype.update = function() {
  if(this.y < this.aimY) {   //内存分区的位置需要向下移动
    if(this.aimY - this.y > memoryMoveSpeed) {
      this.y += memoryMoveSpeed;
    } else {
      this.y = this.aimY;
    }
    this.moveCompleted = false;
  } else if(this.y > this.aimY) {  //内存分区的位置需要向上移动
    if(this.y - this.aimY > memoryMoveSpeed) {
      this.y -= memoryMoveSpeed;
    } else {
      this.y = this.aimY;
    }
    this.moveCompleted = false;
  }
  if(this.sizeY > this.aimSize) {  //分区大小需要减少
    if(this.sizeY - this.aimSize > memoryMoveSpeed) {
      this.sizeY -= memoryMoveSpeed;
    } else {
      this.sizeY = this.aimSize;
    }
    this.moveCompleted = false;
  } else if(this.sizeY < this.aimSize) {  //分区大小需要增加
    if(this.aimSize - this.sizeY > memoryMoveSpeed) {
      this.sizeY += memoryMoveSpeed;
    } else {
      this.sizeY = this.aimSize;
    }
    this.moveCompleted = false;
  } else {
    this.moveCompleted = true;
  }
}

/**
 * 初始化空闲内存分区
 */
function initMemoryPartition() {
  var totalmemoryCopy = totalMemoryNum - systemNeedMemory; //需要找到能用的分区
  var systemMemorySize = Math.floor((mPartitionSizeYSum / totalMemoryNum) * systemNeedMemory, 0);   //系统分区的高度
  minMemory = Math.floor(totalMemoryNum / 20, 0);
  idleMemoryQueue.length = 0;
  busyMemoryQueue.length = 0;
  busyMemoryQueue.push(new memoryPartition(    //系统分区永远是忙碌的
    mPartitionStartPointX, 
    mPartitionStartPointY, 
    mPartitionSizeX, 
    systemMemorySize, 
    busyMemoryColor,
    new mp(0, systemNeedMemory, 0, 1, 'system'),
    true));
  idleMemoryQueue.push(new memoryPartition(    //初始化一个空闲的大分区是否可行？先试试
    mPartitionStartPointX , 
    mPartitionStartPointY + systemMemorySize, 
    mPartitionSizeX, 
    mPartitionSizeYSum - systemMemorySize, 
    idleMemoryColor,
    new mp(1, totalmemoryCopy, systemNeedMemory, 0, null),
    true));
}

initMemoryPartition();

/**
 * 内存总区对象
 * @param {int} x x坐标
 * @param {int} y y坐标
 * @param {int} sizeX 长度
 * @param {int} sizeY 宽度
 * @param {*} color 颜色
 * @param {*} borderColor 边框颜色
 * @param {*} borderSize 边框厚度
 */
function TOTALMEMORY(x, y, sizeX, sizeY, color, borderColor, borderSize) {
  this.x = x;
  this.y = y;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.color = color;
  this.borderColor = borderColor;
  this.borderSize = borderSize;
}

TOTALMEMORY.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.strokeRect(this.x + this.sizeX - 4, this.y + this.sizeY / 3, RAMStationX - this.x - this.sizeX + 7, this.sizeY / 3);
  ctx.lineWidth = 1;
  ctx.fillStyle = this.borderColor;
  ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x + this.borderSize, this.y + this.borderSize, this.sizeX - 2 * this.borderSize, this.sizeY - 2 * this.borderSize);


}

var totalmemory = new TOTALMEMORY(mPartitionStartPointX - 5, mPartitionStartPointY - 5, mPartitionSizeX + 2 * 5, mPartitionSizeYSum + 2 * 5, '#f4f4f4', '#4CAF50', 5);





var contiune = false;   //判断所有块是不是已经移动完毕了，时间可以继续走了
var timeGo = timeSpeed - 1;   //每45帧走一分钟；
var sysRunFlag;
var flag = false;
var bufferQueue = new Array();
var bufferQueue2 = new Array();

function sysUpdate() {
  var pcbScheduling = document.getElementsByName("pSelect")[0];
  if(contiune == true && flag == true) {   //时间可以继续走了
    if(timeGo == 0) {
      runningCPU();
    }
  }
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  for(let i = 0; i < bufferQueue.length; i++) {
    bufferQueue[i].draw(false);
    bufferQueue[i].intoCpu();
  }
  for (let i = 0; i < waitQueue.length; i++) {
    waitQueue[i].draw(false);
    waitQueue[i].update();
  }
  for(let i = 0; i < bufferQueue2.length; i++) {
    if(bufferQueue2[i].needComeOutCpu != -1) {
      bufferQueue2[i].draw(true);
      bufferQueue2[i].intoFinishedQueue(i);
    } 
  }
  for(let i = 0; i < cpuQueue.length; i++) {
    cpuQueue[i].draw();
  }
  for(let i = 0; i < finishedQueue.length; i++) {
    finishedQueue[i].draw(true);
  }

  drawQueueBaseLine();
  drawtotalResource();
  totalmemory.draw();
  RAM.draw();

  for(let i = 0; i< idleMemoryQueue.length; i++) {
    idleMemoryQueue[i].draw();
    idleMemoryQueue[i].update();
  }
  for(let i = 0; i < busyMemoryQueue.length; i++) {
    busyMemoryQueue[i].draw();
    busyMemoryQueue[i].update();
  }
  if(pcbScheduling.checked == false) {
    for(let i = 0; i < processQueueNum; i++) {
      for(let j = 0; j < processQueue[i].length; j++) {
        processQueue[i][j].draw();
        processQueue[i][j].back()
        processQueue[i][j].update();
      }
    }
  } else {
    for(let i = 0; i < processQueue[1].length; i++) {
      processQueue[1][i].draw();
      processQueue[1][i].back();
      processQueue[1][i].update();
    }
  }
  if(runningProcess) {
    runningProcess.run();
    runningProcess.draw();
  }



  flag = true;
  for(let i = 0; i < waitQueue.length; i++) {
    if(!waitQueue[i].moveCompleted) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < bufferQueue.length; i++) {
    if(!bufferQueue[i].moveCompleted) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < bufferQueue2.length; i++) {
    if(!bufferQueue2[i].moveCompleted) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < processQueueNum; i++) {
    for(let j = 0; j < processQueue[i].length; j++) {
      if(!processQueue[i][j].moveCompleted) {
        flag = false;
        break;
      }
    }
  }
  for(let i = 0; i< idleMemoryQueue.length; i++) {
    if(!idleMemoryQueue[i].moveCompleted) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < busyMemoryQueue.length; i++) {
    if(!busyMemoryQueue[i].moveCompleted) {
      flag = false;
      break;
    }
  }
  if(runningProcess && !runningProcess.moveCompleted) {
    flag = false;
  }
  if(contiune == true && flag == true) {
    bufferCurrentTime[0] = currentTime[0];
    bufferCurrentTime[1] = currentTime[1];
  }
  if(contiune == true && flag == true) {   //时间可以继续走了
    if(timeGo == 0) {
      runningCPU2();
      currentTime = timeAdd(currentTime, 1);
      timeGo = timeSpeed;
    } else {
      timeGo -= 1;
    }
  }
  ctx.fillStyle = "black";
  ctx.font = "24px serif";
  ctx.textAlign = 'left';
  if(currentTime[1] < 10) {
    ctx.fillText("当前时间：" + bufferCurrentTime[0] + ":" + "0" + bufferCurrentTime[1], 10, waitStationY + waitSize + 40);
  } else {
    ctx.fillText("当前时间：" + bufferCurrentTime[0] + ":" + bufferCurrentTime[1], 10, waitStationY + waitSize + 40);
  }
  
  sysRunFlag = requestAnimationFrame(sysUpdate);
}

sysUpdate();

var play = false;
document.querySelector("#play").addEventListener("click", function(evt){
  var slide = document.querySelector(".silde");
  slide.classList.add("animated");
    if(!play) {
        sysUpdate();
        contiune = true;
        play = !play;
        evt.target.src = "images/pause.png";
        slide.classList.remove("slideInLeft");
        slide.classList.add("slideOutLeft");
    } else {
      cancelAnimationFrame(sysRunFlag);
      contiune = false;
      play = !play;
      evt.target.src = "images/play.png";
      slide.classList.remove("slideOutLeft");
      slide.classList.add("slideInLeft");
    }
});

/*************************************************************************************/

/**
 * 用FCFS选择符合条件的job
 * @return {*} 是否有选中的作业
 */
function selectJobWithFCFS() {
  if(idleTrackNum == 0) {
    return 0;
  }
  var selected = false;
  for(let i = 0; i < waitQueue.length; i++) {
    var job = waitQueue[i];
    selected = false;
    if(!timeCompare(currentTime, job.jcb.stime)) {   //作业还没来
      break;
    }
    for(let j = 0; j < idleMemoryQueue.length; j++) {   //看看有没有足够分配给这个作业的内存分区
      if(job.jcb.memoryNeed <= idleMemoryQueue[j].mp.size) {
        selected = true;
        break;
      }
    }
    for(let j = 0; j < resourceTypeTotalNum; j++) {   //看看系统其他资源够不够分配
      if(job.jcb.pro[j].num > totalRcb[resourceTypeTotalNum - j - 1].num) {
        selected = false;
        break;
      }
    }
    if(selected) {
      var mDistribution = document.getElementsByName("mDistribute")[0];
      //分配资源
      for(let j = 0; j < totalRcb.length; j++) {
        totalRcb[resourceTypeTotalNum - j - 1].num -= job.jcb.pro[j].num;
      }
      //分配内存
      if(mDistribution.checked == true) {
        distributeMemoryWithFF(job.jcb);
      } else {
        distributeMemoryWithNF(job.jcb);
      }
      job.needIntoCpu = bufferQueue.length;
      bufferQueue.push(waitQueue.splice(i, 1)[0]);
      return 1;
    }
  } 
  return 0; 
}

/**
 * 用SJF选择符合条件的job
 * @return {*} 是否有选中的作业
 */
function selectJobWithSJF() {
  if(idleTrackNum == 0) {
    return 0;
  }
  var selected = false;
  var haveMinJob = -1;  //存储找到的最小的job
  if(waitQueue.length <= 0) {
    return 0;
  } 
  var min = null;
  for(let i = 0; i < waitQueue.length; i++) {
    selected = false;
    var job = waitQueue[i];
    //如果到达时间大于当前时间，不满足,并且后面的job的时间肯定也不满足
    if(!timeCompare(currentTime, job.jcb.stime)) {
      break;
    }
    for(let j = 0; j < idleMemoryQueue.length; j++) {   //看看有没有足够分配给这个作业的内存分区
      if(job.jcb.memoryNeed <= idleMemoryQueue[j].mp.size) {
        selected = true;
        break;
      }
    }
    //判断资源是不是足够分配给它
    for(let j = 0; j < resourceTypeTotalNum; j++) {
      if(job.jcb.pro[j].num >= totalRcb[resourceTypeTotalNum - j - 1].num) {
        selected = false;
        break;
      }
    }
    if(selected) {   //资源足够分配
      if(min == null) {
        min = job;
        haveMinJob = i;
      } else if(waitQueue[i].jcb.ntime <= min.jcb.ntime) {  //如果它比当前最小的还小
        min = job;
        haveMinJob = i;
      }
    }
  }
  if(haveMinJob != -1) {
    var mDistribution = document.getElementsByName("mDistribute")[0];
    for(let j = 0; j < totalRcb.length; j++) {
      totalRcb[resourceTypeTotalNum - j - 1].num -= waitQueue[haveMinJob].jcb.pro[j].num;
    }
    //分配内存
    if (mDistribution.checked == true) {
      distributeMemoryWithFF(waitQueue[haveMinJob].jcb);
    } else {
      distributeMemoryWithNF(waitQueue[haveMinJob].jcb);
    }
    waitQueue[haveMinJob].needIntoCpu = bufferQueue.length;
    bufferQueue.push(waitQueue.splice(haveMinJob, 1)[0]);
    return 1;
  }
  return 0;
}

/**
 * @returns {boolean} 如果存在已经运行的进程，返回false，否则计算进程的各种时间，返回true
 */
function selectProcessWithMFQ() {
  var runningTime;    //此次运行的运行时间
  if(runningProcess == null) {  //如果没有运行中的进程，那么就可以直接取第一个进程运行
    for(let i = 0; i < processQueueNum; i++) {
      if(processQueue[i].length != 0) {  //第i个就绪队列有进程
        runningTime = timeSlice * Math.pow(2, i);
        runningProcess = processQueue[i].shift();    //获取该队列第一个元素
        var rtime = runningProcess.jcb.rtime;
        var ntime = runningProcess.jcb.ntime;
        if(rtime + runningTime >= ntime) {  //程序需要的运行时间已经小于这个此次运行的时间
          //此时已经可以计算出进程的结束时间了
          runningProcess.finTime = runningProcess.jcb.finishedTime = timeAdd(currentTime, ntime - rtime);
          runningProcess.jcb.rtime = ntime;
          return true;
        } else {
          runningProcess.jcb.rtime = rtime + runningTime;
          runningProcess.finTime = timeAdd(currentTime, runningTime);
          return true;
        }
      }
    }
  }
  return false;
}
/**
 * @return 如果替换了运行进程，返回true，什么都没干，返回false
 */
function selectProcessWithSJF() {
  var runningTime = 1;  //每分钟都有可能有新的进程抢占，所以每个进程运行一分钟后就要判断一次
  if(runningProcess == null) {   //如果没有运行中的进程，就取最短进程运行
    var minProcess = null;
    if(processQueue[1].length != 0) {   //就绪队列里有进程
      minProcess = 0;
      for(let i = 0; i < processQueue[1].length; i++) {
        if(processQueue[1][i].jcb.ntime < processQueue[1][minProcess].jcb.ntime) {
          minProcess = i;
        }
      }
    } else {
      return false;  //没有进程就没事了
    }
    runningProcess = processQueue[1].splice(minProcess, 1)[0];    //获取该队列第一个元素
    var rtime = runningProcess.jcb.rtime;
    var ntime = runningProcess.jcb.ntime;
    if(rtime + runningTime >= ntime) {  //程序需要的运行时间已经小于这个此次运行的时间
      //此时已经可以计算出进程的结束时间了
      runningProcess.finTime = runningProcess.jcb.finishedTime = timeAdd(currentTime, ntime - rtime);
      runningProcess.jcb.rtime = ntime;
      return true;
    } else {
      runningProcess.jcb.rtime = rtime + runningTime;
      runningProcess.finTime = timeAdd(currentTime, runningTime);
      return true;
    }
  }
  return false;
}

/**
 * 使用首次适应算法为作业分配分区
 * @param {*} jcb 需要分配内存的作业的JCB
 */
function distributeMemoryWithFF(jcb) {
  //在调用这个分配算法之前一定检查过了有足够大的分区可分配给该作业
  for(let i = 0; i < idleMemoryQueue.length; i++) {   //看看有没有足够分配给这个作业的内存分区
    if(jcb.memoryNeed <= idleMemoryQueue[i].mp.size && idleMemoryQueue[i].aimSize != 0) {
      var toBeAllocatedMemory = new memoryPartition(
        idleMemoryQueue[i].x,
        idleMemoryQueue[i].y,
        idleMemoryQueue[i].sizeX,
        idleMemoryQueue[i].sizeY,
        idleMemoryQueue[i].color,
        new mp(
          idleMemoryQueue[i].mp.number,
          idleMemoryQueue[i].mp.size,
          idleMemoryQueue[i].mp.startAddress,
          idleMemoryQueue[i].mp.state,
          idleMemoryQueue[i].mp.belong
        ),
        idleMemoryQueue[i].moveCompleted
      );
      if(toBeAllocatedMemory.mp.size - jcb.memoryNeed <= minMemory) {  //不能再划分了
        //为了便于分配动画演示，先将这个分区的大小设置为0，暂时不将它移除空闲队列，下次执行runningCPU函数时再移除
        idleMemoryQueue[i].aimY = idleMemoryQueue[i].y + idleMemoryQueue[i].sizeY;
        idleMemoryQueue[i].aimSize = 0;
        idleMemoryQueue[i].mp.startAddress = idleMemoryQueue[i].mp.startAddress + idleMemoryQueue[i].mp.size;
        idleMemoryQueue[i].mp.size = 0;
        for(let j = i + 1; j < idleMemoryQueue.length; j++) {   //后面的分区号都减一
          idleMemoryQueue[j].mp.number -= 1;
        }
        toBeAllocatedMemory.color = busyMemoryColor;
        toBeAllocatedMemory.aimSize = toBeAllocatedMemory.sizeY;
        toBeAllocatedMemory.sizeY = 0;
        toBeAllocatedMemory.mp.state = 1;
        toBeAllocatedMemory.mp.belong = jcb.name;
        busyMemoryQueue.push(toBeAllocatedMemory);
      } else {    //需要将内存分区划分，采用从头开始划分的方法吧！
        idleMemoryQueue[i].aimY = idleMemoryQueue[i].y + Math.floor((mPartitionSizeYSum / totalMemoryNum) * jcb.memoryNeed, 0);
        idleMemoryQueue[i].aimSize = idleMemoryQueue[i].y + idleMemoryQueue[i].sizeY - idleMemoryQueue[i].aimY;
        idleMemoryQueue[i].mp.startAddress = idleMemoryQueue[i].mp.startAddress + jcb.memoryNeed;
        idleMemoryQueue[i].mp.size = idleMemoryQueue[i].mp.size - jcb.memoryNeed;
        toBeAllocatedMemory.color = busyMemoryColor;
        toBeAllocatedMemory.aimSize = Math.floor((mPartitionSizeYSum / totalMemoryNum) * jcb.memoryNeed, 0);
        toBeAllocatedMemory.sizeY = 0;
        toBeAllocatedMemory.mp.state = 1;
        toBeAllocatedMemory.mp.belong = jcb.name;
        toBeAllocatedMemory.mp.size = jcb.memoryNeed;
        busyMemoryQueue.push(toBeAllocatedMemory);
      }
      break;
    }
  }
}

/**
 * 使用首次循环适应算法为作业分配分区
 * @param {*} jcb 需要分配内存的作业的JCB
 */
function distributeMemoryWithNF(jcb) {
  // if(lastSearchPartition >= idleMemoryQueue.length) {
  //   lastSearchPartition = 0;
  // }
  //在调用这个分配算法之前一定检查过了有足够大的分区可分配给该作业
  for(let i = lastSearchPartition; i < idleMemoryQueue.length; i++) {   //看看从当前查询位置到队尾有没有足够分配给这个作业的内存分区
    if(jcb.memoryNeed <= idleMemoryQueue[i].mp.size && idleMemoryQueue[i].aimSize != 0) {
      var toBeAllocatedMemory = new memoryPartition(
        idleMemoryQueue[i].x,
        idleMemoryQueue[i].y,
        idleMemoryQueue[i].sizeX,
        idleMemoryQueue[i].sizeY,
        idleMemoryQueue[i].color,
        new mp(
          idleMemoryQueue[i].mp.number,
          idleMemoryQueue[i].mp.size,
          idleMemoryQueue[i].mp.startAddress,
          idleMemoryQueue[i].mp.state,
          idleMemoryQueue[i].mp.belong
        ),
        idleMemoryQueue[i].moveCompleted
      );
      if(toBeAllocatedMemory.mp.size - jcb.memoryNeed <= minMemory) {  //不能再划分了
        //为了便于分配动画演示，先将这个分区的大小设置为0，暂时不将它移除空闲队列，下次执行runningCPU函数时再移除
        idleMemoryQueue[i].aimY = idleMemoryQueue[i].y + idleMemoryQueue[i].sizeY;
        idleMemoryQueue[i].aimSize = 0;
        idleMemoryQueue[i].mp.startAddress = idleMemoryQueue[i].mp.startAddress + idleMemoryQueue[i].mp.size;
        idleMemoryQueue[i].mp.size = 0;
        for(let j = i + 1; j < idleMemoryQueue.length; j++) {   //后面的分区号都减一
          idleMemoryQueue[j].mp.number -= 1;
        }
        toBeAllocatedMemory.color = busyMemoryColor;
        toBeAllocatedMemory.aimSize = toBeAllocatedMemory.sizeY;
        toBeAllocatedMemory.sizeY = 0;
        toBeAllocatedMemory.mp.state = 1;
        toBeAllocatedMemory.mp.belong = jcb.name;
        busyMemoryQueue.push(toBeAllocatedMemory);
      } else { //需要将内存分区划分，采用从头开始划分的方法吧！
        idleMemoryQueue[i].aimY = idleMemoryQueue[i].y + Math.floor((mPartitionSizeYSum / totalMemoryNum) * jcb.memoryNeed, 0);
        idleMemoryQueue[i].aimSize = idleMemoryQueue[i].y + idleMemoryQueue[i].sizeY - idleMemoryQueue[i].aimY;
        idleMemoryQueue[i].mp.startAddress = idleMemoryQueue[i].mp.startAddress + jcb.memoryNeed;
        idleMemoryQueue[i].mp.size = idleMemoryQueue[i].mp.size - jcb.memoryNeed;
        toBeAllocatedMemory.color = busyMemoryColor;
        toBeAllocatedMemory.aimSize = Math.floor((mPartitionSizeYSum / totalMemoryNum) * jcb.memoryNeed, 0);
        toBeAllocatedMemory.sizeY = 0;
        toBeAllocatedMemory.mp.state = 1;
        toBeAllocatedMemory.mp.belong = jcb.name;
        toBeAllocatedMemory.mp.size = jcb.memoryNeed;
        busyMemoryQueue.push(toBeAllocatedMemory);
      }
      lastSearchPartition = i + 1;
      return ;
    }
  }
  //暂时找不到，从队头开始找
  for(let i = 0; i < lastSearchPartition && i < idleMemoryQueue.length; i++) {
    if(jcb.memoryNeed <= idleMemoryQueue[i].mp.size && idleMemoryQueue[i].aimSize != 0) {
      var toBeAllocatedMemory = new memoryPartition(
        idleMemoryQueue[i].x,
        idleMemoryQueue[i].y,
        idleMemoryQueue[i].sizeX,
        idleMemoryQueue[i].sizeY,
        idleMemoryQueue[i].color,
        new mp(
          idleMemoryQueue[i].mp.number,
          idleMemoryQueue[i].mp.size,
          idleMemoryQueue[i].mp.startAddress,
          idleMemoryQueue[i].mp.state,
          idleMemoryQueue[i].mp.belong
        ),
        idleMemoryQueue[i].moveCompleted
      );
      if(toBeAllocatedMemory.mp.size - jcb.memoryNeed <= minMemory) {  //不能再划分了
        //为了便于分配动画演示，先将这个分区的大小设置为0，暂时不将它移除空闲队列，下次执行runningCPU函数时再移除
        idleMemoryQueue[i].aimY = idleMemoryQueue[i].y + idleMemoryQueue[i].sizeY;
        idleMemoryQueue[i].aimSize = 0;
        idleMemoryQueue[i].mp.size = 0;
        for(let j = i + 1; j < idleMemoryQueue.length; j++) {   //后面的分区号都减一
          idleMemoryQueue[j].mp.number -= 1;
        }
        toBeAllocatedMemory.color = busyMemoryColor;
        toBeAllocatedMemory.aimSize = toBeAllocatedMemory.sizeY;
        toBeAllocatedMemory.sizeY = 0;
        toBeAllocatedMemory.mp.state = 1;
        toBeAllocatedMemory.mp.belong = jcb.name;
        busyMemoryQueue.push(toBeAllocatedMemory);
      } else { //需要将内存分区划分，采用从头开始划分的方法吧！
        idleMemoryQueue[i].aimY = idleMemoryQueue[i].y + Math.floor((mPartitionSizeYSum / totalMemoryNum) * jcb.memoryNeed, 0);
        idleMemoryQueue[i].aimSize = idleMemoryQueue[i].y + idleMemoryQueue[i].sizeY - idleMemoryQueue[i].aimY;
        idleMemoryQueue[i].mp.startAddress = idleMemoryQueue[i].mp.startAddress + jcb.memoryNeed;
        idleMemoryQueue[i].mp.size = idleMemoryQueue[i].mp.size - jcb.memoryNeed;
        toBeAllocatedMemory.color = busyMemoryColor;
        toBeAllocatedMemory.aimSize = Math.floor((mPartitionSizeYSum / totalMemoryNum) * jcb.memoryNeed, 0);
        toBeAllocatedMemory.sizeY = 0;
        toBeAllocatedMemory.mp.state = 1;
        toBeAllocatedMemory.mp.belong = jcb.name;
        toBeAllocatedMemory.mp.size = jcb.memoryNeed;
        busyMemoryQueue.push(toBeAllocatedMemory);
      }
      lastSearchPartition = i + 1;
      return ;
    }
  }
}

/**
 * 
 * @param {*} jobName 作业名字
 */
function recycleMemory(jobName) {
  var toBeRecycleMemory = null;
  var stamp = -1;
  for(let i = 0; i < busyMemoryQueue.length; i++) {
    if(busyMemoryQueue[i].mp.belong == jobName) {  //找到分配给这个作业的内存分区了
       //为了便于分配动画演示，先将这个分区的大小设置为0，暂时不将它移除忙碌队列，下次执行runningCPU函数时再移除
       toBeRecycleMemory = new memoryPartition(
        busyMemoryQueue[i].x,
        busyMemoryQueue[i].y,
        busyMemoryQueue[i].sizeX,
        busyMemoryQueue[i].sizeY,
        busyMemoryQueue[i].color,
        new mp(
          busyMemoryQueue[i].mp.number,
          busyMemoryQueue[i].mp.size,
          busyMemoryQueue[i].mp.startAddress,
          busyMemoryQueue[i].mp.state,
          busyMemoryQueue[i].mp.belong
        ),
        busyMemoryQueue[i].moveCompleted
      );
      busyMemoryQueue[i].aimY = busyMemoryQueue[i].y + busyMemoryQueue[i].sizeY;
      busyMemoryQueue[i].aimSize = 0;
      busyMemoryQueue[i].mp.size = 0;
    }
  }
  if(idleMemoryQueue.length == 0) {  //没有空闲分区的情况怎么办
    toBeRecycleMemory.mp.number = 1;
    toBeRecycleMemory.mp.state = 0;
    toBeRecycleMemory.mp.belong = null;
    toBeRecycleMemory.color = idleMemoryColor;
    toBeRecycleMemory.aimSize = toBeRecycleMemory.size;
    toBeRecycleMemory.size = 0;
    idleMemoryQueue.splice(0, 0, toBeRecycleMemory);
    return;
  }
  for(let i = 0; i < idleMemoryQueue.length; i++) {
    if(idleMemoryQueue[i].aimSize != 0) {  //先排除那些即将从空闲队列移除的分区
      //回收区同时和上下两个空闲区邻接吗？
      if(i + 1 < idleMemoryQueue.length && idleMemoryQueue[i].mp.startAddress + idleMemoryQueue[i].mp.size == toBeRecycleMemory.mp.startAddress && toBeRecycleMemory.mp.startAddress + toBeRecycleMemory.mp.size == idleMemoryQueue[i + 1].mp.startAddress) {
        idleMemoryQueue[i].mp.size = idleMemoryQueue[i].mp.size + toBeRecycleMemory.mp.size + idleMemoryQueue[i + 1].mp.size;
        idleMemoryQueue[i].aimSize = idleMemoryQueue[i].sizeY + toBeRecycleMemory.sizeY + idleMemoryQueue[i + 1].sizeY;
        idleMemoryQueue[i + 1].aimY = idleMemoryQueue[i + 1].y + idleMemoryQueue[i + 1].sizeY;
        idleMemoryQueue[i + 1].aimSize = 0;
        idleMemoryQueue[i + 1].mp.startAddress = idleMemoryQueue[i + 1].mp.startAddress + idleMemoryQueue[i + 1].mp.size;
        idleMemoryQueue[i + 1].mp.size = 0;
        for(let j = i + 1 + 1; j < idleMemoryQueue.length; j++) {   //后面的分区号都减一
          idleMemoryQueue[j].mp.number -= 1;
        }
        return ;
      }
      //回收区和上一个空闲区邻接吗？ 
      else if(idleMemoryQueue[i].mp.startAddress + idleMemoryQueue[i].mp.size == toBeRecycleMemory.mp.startAddress) {
        idleMemoryQueue[i].mp.size = idleMemoryQueue[i].mp.size + toBeRecycleMemory.mp.size;
        idleMemoryQueue[i].aimSize = idleMemoryQueue[i].sizeY + toBeRecycleMemory.sizeY;
        return ;
      } 
      //回收区和下一个空闲区邻接吗？ 
      else if(toBeRecycleMemory.mp.startAddress + toBeRecycleMemory.mp.size == idleMemoryQueue[i].mp.startAddress) {
        idleMemoryQueue[i].mp.startAddress = toBeRecycleMemory.mp.startAddress;
        idleMemoryQueue[i].mp.size = idleMemoryQueue[i].mp.size + toBeRecycleMemory.mp.size;
        idleMemoryQueue[i].aimSize = idleMemoryQueue[i].sizeY + toBeRecycleMemory.sizeY;
        idleMemoryQueue[i].aimY = toBeRecycleMemory.y;
        return ;
      } 
      //既不和上一个邻接也不和下一个邻接
      else if(i + 1 < idleMemoryQueue.length && idleMemoryQueue[i].mp.startAddress + idleMemoryQueue[i].mp.size < toBeRecycleMemory.mp.startAddress && toBeRecycleMemory.mp.startAddress + toBeRecycleMemory.mp.size > idleMemoryQueue[i + 1].mp.startAddress) {

        stamp = i;
      }
    }
  }
  if(stamp != -1) {
    toBeRecycleMemory.mp.number = idleMemoryQueue[stamp].mp.number + 1;
    toBeRecycleMemory.mp.state = 0;
    toBeRecycleMemory.mp.belong = null;
    toBeRecycleMemory.color = idleMemoryColor;
    toBeRecycleMemory.aimSize = toBeRecycleMemory.sizeY;
    toBeRecycleMemory.sizeY = 0;
    for(let j = stamp + 1; j < idleMemoryQueue.length; j++) {   //后面的分区号都减一
      idleMemoryQueue[j].mp.number += 1;
    }
    idleMemoryQueue.splice(stamp + 1, 0, toBeRecycleMemory);
  }
  if(stamp == -1) {
    //还有两种情况需要处理，在队头不和下一个分区邻接，在队尾不和上一个分区邻接
    if (toBeRecycleMemory.mp.startAddress + toBeRecycleMemory.mp.size < idleMemoryQueue[0].mp.startAddress) {
      toBeRecycleMemory.mp.number = 1;
      toBeRecycleMemory.mp.state = 0;
      toBeRecycleMemory.mp.belong = null;
      toBeRecycleMemory.color = idleMemoryColor;
      toBeRecycleMemory.aimSize = toBeRecycleMemory.sizeY;
      toBeRecycleMemory.sizeY = 0;
      for (let i = 0; i < idleMemoryQueue.length; i++) {   //后面的分区号都减一
        idleMemoryQueue[i].mp.number += 1;
      }
      idleMemoryQueue.splice(0, 0, toBeRecycleMemory);
      return;
    } else if (idleMemoryQueue[idleMemoryQueue.length - 1].mp.startAddress + idleMemoryQueue[idleMemoryQueue.length - 1].mp.size < toBeRecycleMemory.mp.startAddress) {
      toBeRecycleMemory.mp.number = idleMemoryQueue[idleMemoryQueue.length - 1].mp.number + 1;
      toBeRecycleMemory.mp.state = 0;
      toBeRecycleMemory.mp.belong = null;
      toBeRecycleMemory.color = idleMemoryColor;
      toBeRecycleMemory.aimSize = toBeRecycleMemory.sizeY;
      toBeRecycleMemory.sizeY = 0;
      idleMemoryQueue.push(toBeRecycleMemory);
      return;
    }
  }


}

/**
 * 移除两个分区队列中大小为0的分区 
 */
function removeZeroSizeMemory() {
  for(let i = 0; i < idleMemoryQueue.length; i++) {
    if(idleMemoryQueue[i].sizeY == 0) {
      idleMemoryQueue.splice(i, 1);
    }
  }
  for(let i = 0; i < busyMemoryQueue.length; i++) {
    if(busyMemoryQueue[i].sizeY == 0) {
      busyMemoryQueue.splice(i, 1);
    }
  }
}


var runningProcess = null;   //正在运行的进程
function runningCPU() {
  var pcbScheduling = document.getElementsByName("pSelect")[0];
  var FCFS = document.getElementsByName("aSelect")[0];

  removeZeroSizeMemory();

  //先从就绪队列取作业进入处理机
  if(FCFS.checked == true) {
    while(idleTrackNum > 0) {
      if(selectJobWithFCFS() == 1) {
        idleTrackNum--;
        var a = bufferQueue[bufferQueue.length - 1];
        if(pcbScheduling.checked == false) { 
          //多级反馈作业一开始一定在第一队列
          processQueue[0].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[0], 'orange', 'black', pcbSize, false, 0, null)); 
          Object.defineProperty(processQueue[0][processQueue[0].length - 1], 'jcb',{
            get: function() { return a.jcb; },
            set: function(v) { a.jcb = v; }
          });
        } else {
          processQueue[1].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[1], 'orange', 'black', pcbSize, false, 1, null)); 
          Object.defineProperty(processQueue[1][processQueue[1].length - 1], 'jcb',{
            get: function() { return a.jcb; },
            set: function(v) { a.jcb = v; }
          }); 
        }
      } else {
        break;
      }
    }
  } else {
    while(idleTrackNum > 0) {
      if(selectJobWithSJF() == 1) {
        idleTrackNum--;
        var a = bufferQueue[bufferQueue.length - 1];
        if(pcbScheduling.checked == false) { 
          //多级反馈作业一开始一定在第一队列
          processQueue[0].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[0], 'orange', 'black', pcbSize, false, 0, null)); 
          Object.defineProperty(processQueue[0][processQueue[0].length - 1], 'jcb',{
            get: function() { return a.jcb; },
            set: function(v) { a.jcb = v; }
          });
        } else {
          processQueue[1].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[1], 'orange', 'black', pcbSize, false, 1, null)); 
          Object.defineProperty(processQueue[1][processQueue[1].length - 1], 'jcb',{
            get: function() { return a.jcb; },
            set: function(v) { a.jcb = v; }
          }); 
        }
      } else {
        break;
      }
    }
  }

  if(pcbScheduling.checked == false) {  //进程调度
    selectProcessWithMFQ();
  } else {
    selectProcessWithSJF();
  }

  //先看有没有已经处理完成的job
  var runningQueueB = new Array();
  for(let i = 0; i < runningQueue.length; i++) {
    if(runningQueue[i].jcb.finishedTime != null && timeCompare(currentTime, runningQueue[i].jcb.finishedTime)) {
      idleTrackNum++;
      //归还资源
      for(let j = 0; j < totalRcb.length; j++) {
        totalRcb[resourceTypeTotalNum - j - 1].num += runningQueue[i].jcb.pro[j].num;
      }
      //归还内存
      recycleMemory(runningQueue[i].jcb.name);
      bufferQueue2.push(runningQueue[i]);
      bufferQueue2[bufferQueue2.length - 1].needComeOutCpu = finshedJobNum++;  
      insertSimulationResults(runningQueue[i]);
    } else {
      runningQueueB.push(runningQueue[i]);
    }
  }
  runningQueue = runningQueueB;
  //如果没有找到作业，可能是因为 就绪队列为空 处理机忙没有空闲 没有合适资源分配
  if(bufferQueue.length == 0) {
    return;
  }
  //找到作业，进入动画缓冲队列，作业进入cpu动画播完后即可变成就绪进程
  var p;
  for(let i = 0; i < bufferQueue.length; i++) {
    p = bufferQueue[i];
    p.jcb.srtime = currentTime;
    //p.jcb.finishedTime = timeAdd(currentTime, p.jcb.ntime);
  }

}

function runningCPU2() {
  var pcbScheduling = document.getElementsByName("pSelect")[0];
  var FCFS = document.getElementsByName("aSelect")[0];

  removeZeroSizeMemory();
   //然后再从就绪队列取作业进入处理机
 if(FCFS.checked == true) {
  while(idleTrackNum > 0) {
    if(selectJobWithFCFS() == 1) {
      idleTrackNum--;
      var a = bufferQueue[bufferQueue.length - 1];
      if(pcbScheduling.checked == false) { 
        //多级反馈作业一开始一定在第一队列
        processQueue[0].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[0], 'orange', 'black', pcbSize, false, 0, null)); 
        Object.defineProperty(processQueue[0][processQueue[0].length - 1], 'jcb',{
          get: function() { return a.jcb; },
          set: function(v) { a.jcb = v; }
        });
      } else {
        processQueue[1].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[1], 'orange', 'black', pcbSize, false, 1, null)); 
        Object.defineProperty(processQueue[1][processQueue[1].length - 1], 'jcb',{
          get: function() { return a.jcb; },
          set: function(v) { a.jcb = v; }
        }); 
      }
    } else {
      break;
    }
  }
} else {
  while(idleTrackNum > 0) {
    if(selectJobWithSJF() == 1) {
      idleTrackNum--;
      var a = bufferQueue[bufferQueue.length - 1];
      if(pcbScheduling.checked == false) { 
        //多级反馈作业一开始一定在第一队列
        processQueue[0].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[0], 'orange', 'black', pcbSize, false, 0, null)); 
        Object.defineProperty(processQueue[0][processQueue[0].length - 1], 'jcb',{
          get: function() { return a.jcb; },
          set: function(v) { a.jcb = v; }
        });
      } else {
        processQueue[1].push(new processA(pcbStationX[pcbStationX.length - 1], pcbStationY[1], 'orange', 'black', pcbSize, false, 1, null)); 
        Object.defineProperty(processQueue[1][processQueue[1].length - 1], 'jcb',{
          get: function() { return a.jcb; },
          set: function(v) { a.jcb = v; }
        }); 
      }
    } else {
      break;
    }
  }
}

  //看当前的运行进程是不是已经完成了
  if(runningProcess != null) {
    if(runningProcess.jcb.finishedTime != null && timeCompare(currentTime, runningProcess.jcb.finishedTime)) {
      runningProcess = null;  //完成就清空
      if(pcbScheduling.checked == false) {  //多级反馈
        selectProcessWithMFQ();
      } else {
        selectProcessWithSJF();
      }
    } else {
      if(!timeCompare(currentTime, runningProcess.finTime)) {  //当前时间小于进程运行完时间片需要的时间
      } else {
        if(pcbScheduling.checked == false) {  //多级反馈
          if(processQueueNum - 1 >= runningProcess.queue + 1) {
            //调到下一个队列
            runningProcess.queue += 1;
            processQueue[runningProcess.queue].push(runningProcess);
            runningProcess = null;
            selectProcessWithMFQ();
          } else {
            //调到当前队列
            processQueue[runningProcess.queue].push(runningProcess);
            runningProcess = null;
            selectProcessWithMFQ();
          }
        } else {   //SJF
          processQueue[runningProcess.queue].push(runningProcess);
          runningProcess = null;
          selectProcessWithSJF();
        }
      }
    }
  }



  //如果没有找到作业，可能是因为 就绪队列为空 处理机忙没有空闲 没有合适资源分配
  if(bufferQueue.length == 0) {
    return;
  }
  //找到作业，进入动画缓冲队列，作业进入cpu动画播完后即可变成就绪进程
  var p;
  for(let i = 0; i < bufferQueue.length; i++) {
    p = bufferQueue[i];
    p.jcb.srtime = currentTime;
    //p.jcb.finishedTime = timeAdd(currentTime, p.jcb.ntime);
  }
}

