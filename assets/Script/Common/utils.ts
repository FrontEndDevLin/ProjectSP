import { _decorator, Component, Node, v2, v3, Vec2, Vec3 } from 'cc';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './Namespace';
const { ccclass, property } = _decorator;

// 计算两点距离
export const getDistance = function (start: Vec2 | Vec3, end: Vec2 | Vec3): number {
  let pos = v2(start.x - end.x, start.y - end.y);
  let dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
  return dis;
}

// 我们知道一个角度，求这个角度的向量
// 1：先把角度转成弧度，原因同上。弧度 = 角度*PI/180.0f
// 2：用刚才的弧度  x = cos(弧度)  y = sin(弧度)
export const getVectorByAngle = function (angle: number) {
  let arc: number = angle * Math.PI / 180;
  return getVectorByArc(arc);
}

export const getVectorByArc = function (arc: number) {
  return v3(Math.cos(arc), Math.sin(arc));
}

export const getRandomNumber = function(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomNumbers = function(min: number, max: number, numbers: number): number[] {
  let numArr: number[] = [];

  function getUnRepeatNumber(arr: number[]) {
    let randomNum: number = getRandomNumber(min, max);
    if (arr.indexOf(randomNum) !== -1) {
      return randomNum;
    } else {
      return getUnRepeatNumber(arr);
    }
  }

  for (let i = 0; i < numbers; i++) {
    numArr.push(getUnRepeatNumber(numArr));
  }

  return numArr;
}

export const getFloatNumber = function (number: number, n: number = 2): number {
  return parseFloat(number.toFixed(n));
}

// 将某个世界坐标转化为符合本程序的世界坐标
export const transportWorldPosition = function (postion: Vec3): Vec3 {
  return v3(postion.x - SCREEN_WIDTH / 2, postion.y - SCREEN_HEIGHT / 2, 0);
}

// 打乱数组
export const shuffleArray = function (ary: any[]): any[] {
  let len: number = ary.length;
  while (len > 0) {
    let randomIdx: number = Math.floor(Math.random() * len);
    [ary[len - 1], ary[randomIdx]] = [ary[randomIdx], ary[len - 1]];
    len--;
  }
  return ary;
}

export const copyObject = function (object: any): any {
  return JSON.parse(JSON.stringify(object));
}

export const COLOR = {
  NORMAL: "#F5F5F5",
  SUCCESS: "#67C23A",
  DANGER: "#F56C6C"
}
