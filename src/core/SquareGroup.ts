import { Square } from "./Square";
import { Point, Shape } from "./types";

/**
 * 小方块组合类
 */
export class SquareGroup {
    private _squares: readonly Square[]

    public get squares() {
        return this._squares;
    }
    public get centerPoint() {
        return this._centerPoint;
    }
    public get shape() {
        return this._shape;
    }
    public set centerPoint(v: Point) {
        this._centerPoint = v;
        // 同时设置其他所有小方块的坐标
        this.setSquarePoints();
    }
    /**
     * 根据中心点坐标设置每一个方块的坐标
     */
    private setSquarePoints() {
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: p.x + this._centerPoint.x,
                y: p.y + this._centerPoint.y
            }
        })
    }

    constructor(
        private _shape: Shape, // 一组方块中相对中心方块的坐标
        private _centerPoint: Point, // 中心点坐标的实际位置
        private _color: string)  {
        // 设置小方块数组
        const arr: Square[] = [];
        this._shape.forEach(p => {
            const square = new Square({
                x: p.x + this._centerPoint.x,
                y: p.y + this._centerPoint.y
            }, this._color);
            arr.push(square);
        })
        this._squares = arr;
    }

    /**
     * 旋转方向是否为顺时针
     */
    protected isClock = true;
    afterRotateShape(): Shape {
        // 顺时针旋转 (x, y) -> (-y, x)
        if(this.isClock) {
            return this._shape.map(p => {
                return {
                    x: - p.y,
                    y: p.x
                }
            })
        } else {
            return this._shape.map(p => {
                return {
                    x: p.y,
                    y: -p.x
                }
            })
        }
    }

    rotate() {
        const newShape = this.afterRotateShape();
        this._shape = newShape;
        this.setSquarePoints();
    }
}