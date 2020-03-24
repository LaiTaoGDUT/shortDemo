/**
 * 
 * @param {Array} time 待增加的时间 xx:xx
 * @param {INT} timeIncrement  时间增量
 */
function timeAdd(time, timeIncrement) {
    var time1 = new Array(2);
    time1[0] = time[0];
    time1[1] = time[1];
    time1[1] += timeIncrement;
    if(time1[1] >= 60) {
      time1[1] -= 60;
      time1[0] += 1;
      if(time1[0] >= 24) {
        alert("当天的任务当天完成，不要拖到下一天啦！");
        throw "当天的任务当天完成，不要拖到下一天啦！";
      }
    }
    return time1;
  }
  /**
   * 时间比较
   * @param {Array} time1  第一个时间
   * @param {Array} time2  第二个时间
   * @return {boolean} 返回第一个时间是否大于等于第二个时间的结果
   */
  function timeCompare(time1, time2) {
    if(time1[0] > time2[0]) {
      return true;
    } else if(time1[0] == time2[0]) {
      if(time1[1] >= time2[1]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
 * 计算两个时间的差值
 * @param {Array} time 等待被减去的时间 xx:xx
 * @param {Array} time2  减数 xx:xx
 */
function timeSub(time, time2) {
    var timeDecrement;
    if(time[0] > time2[0]) {
      if(time[1] < time2[1]) {
        timeDecrement = (time[0] - 1 - time2[0]) * 60 + time[1] + 60 - time2[1];
      } else {
        timeDecrement = (time[0] - time2[0]) * 60 + time[1] - time2[1];
      }
    } else if(time[0] == time2[0]) {
      if(time[1] >= time2[1]) {
        timeDecrement = time[1] - time2[1];
      } else {
        throw "时间差为负值！";
      }
    } else {
      throw "时间差为负值！";
    }
    return timeDecrement;
  }
  
  /**
   * 将时间数组转换为xx：xx格式的字符串
   * @param {时间数组} timeArray 
   */
  function timeChange(timeArray) {
    if(timeArray[1] < 10) {
      return timeArray[0] + ":0" + timeArray[1];
    } else {
      return timeArray[0] + ":" + timeArray[1];
    }
  }