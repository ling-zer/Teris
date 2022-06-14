/**
 * 预定义一些形状
 */

import { SquareGroup } from "./SquareGroup";
import { Point, Shape } from "./types";
import { getRandom } from "./util";

export class TShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 }
        ], _centerPoint, _color);
    }
}

// export const TShape: Shape = [
//     { x: -1, y: 0 },
//     { x: 0, y: 0 },
//     { x: 1, y: 0 },
//     { x: 0, y: -1 }
// ];

export class LShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: -2, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: -1 }
        ], _centerPoint, _color);
    }
}
// export const LShape: Shape = [
//     { x: -2, y: 0 },
//     { x: -1, y: 0 },
//     { x: 0, y: 0 },
//     { x: 0, y: -1 }
// ]
export class LMirrorShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
        ], _centerPoint, _color);
    }
}
// export const LMirrorShape: Shape = [
//     { x: 0, y: -1 },
//     { x: 0, y: 0 },
//     { x: 1, y: 0 },
//     { x: 2, y: 0 }
// ]
export class SShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 1 }
        ], _centerPoint, _color);
    }

    rotate(): void {
        super.rotate();
        this.isClock = !this.isClock;
    }
}
// export const SShape: Shape = [
//     { x: 0, y: 0 },
//     { x: 1, y: 0 },
//     { x: 0, y: 1 },
//     { x: -1, y: 1 }
// ]
export class SMirrorShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ], _centerPoint, _color);
    }
    rotate(): void {
        super.rotate();
        this.isClock = !this.isClock;
    }
}
// export const SMirrorShape: Shape = [
//     { x: 0, y: 0 },
//     { x: -1, y: 0 },
//     { x: 0, y: 1 },
//     { x: 1, y: 1 }
// ]
export class SquareShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ], _centerPoint, _color);
    }
    afterRotateShape(): Shape {
        return this.shape;
    }
}
// export const SquareShape: Shape = [
//     { x: 0, y: 0 },
//     { x: 1, y: 0 },
//     { x: 0, y: 1 },
//     { x: 1, y: 1 }
// ]
export class LineShape extends SquareGroup {
    constructor(
        _centerPoint: Point, // 中心点坐标的实际位置
        _color: string
    ) {
        super([
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
        ], _centerPoint, _color);
    }
    rotate(): void {
        super.rotate();
        this.isClock = !this.isClock;
    }
}
// export const LineShape: Shape = [
//     { x: 0, y: 0 },
//     { x: -1, y: 0 },
//     { x: 1, y: 0 },
//     { x: 2, y: 0 }
// ]

export const shapes = [
    TShape, LShape, LMirrorShape, SShape, SMirrorShape, SquareShape, LineShape
]

export const colors = [
    'red', 'yellow', 'green', 'blue', 'purple', 'orange', 'lawngreen', 'lightsalmon', 'lightseagreen', 'olivedrab'
]

/**
 * 随机产生一个俄罗斯方块(颜色随机、形状随机)
 * @param centerPoint 
 */
export function createTeris(centerPoint: Point): SquareGroup {
    const index = getRandom(0, shapes.length);
    const shape = shapes[index];
    const color = colors[getRandom(0, colors.length)];
    return new shape(centerPoint, color);
}