function JCB(name, state, stime, ntime, pro, srtime, finishedTime, priority, rtime, memoryNeed) {/* 定义作业控制块JCB */
	this.name = name;  //作业名 
	this.state = state;     //作业状态 等待（W）就绪（R）完成（F） 
	this.stime = stime;      //作业的提交时间 Submission time 指作业进入后备队列的时刻
	/*时间与资源需求*/ 
	this.ntime = ntime;      //作业所需的运行时间 
	this.pro = pro;        //作业所需的资源（在单道处理调度中此字段省略） 
	this.memoryNeed = memoryNeed;   //作业需要占用的内存
	/*调度信息*/ 
	this.srtime = srtime;     //作业开始运行的时间
	this.finishedTime = finishedTime;  //作业完成的时间
	this.priority = priority;      //作业优先级 
	this.rtime = rtime;    //已经运行了的时间

}

function RCB(name, unit, num) { /* 定义资源的数据结构 */
	this.name = name;  //资源名 
	this.unit = unit;      //资源单位 
	this.num = num;       //资源数目 
};

function mp(number, size, startAddress, state, belong) {   //内存分区表项的数据结构
	this.number = number;   //分区号
	this.size = size;       //分区大小
	this.startAddress = startAddress;   //分区始址
	this.state = state;     //分区状态
	this.belong = belong;   //属于哪个进程
}
