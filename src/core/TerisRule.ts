import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";

function isPoint(obj: any): obj is Point {
    if (typeof obj.x === 'undefined') {
        return false;
    }
    return true;
}

/**
 * 该类中提供各类函数，根据游戏规则判断各种情况
 */
export class TerisRule {
    /**
     * 判断某个形状的方块是否可以移动到目标位置
     */
    static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
        // 假设中心点已经移动到了目标位置，计算出每个小方块的坐标
        const targetSquarePoints: Point[] = shape.map(p => {
            return {
                x: p.x + targetPoint.x,
                y: p.y + targetPoint.y
            }
        })
        // 边界判断
        if (targetSquarePoints.some(p => {
            // 是否超出了边界
            return (p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1)
        })) {
            return false;
        }
        // 判断是否与已有的方块有重叠
        let result;
        result = targetSquarePoints.some(p =>
            exists.some(sq => sq.point.x === p.x && sq.point.y === p.y)
        )
        if (result) {
            return false;
        }
        return true;
    }
    static move(teris: SquareGroup, targetPoint: Point, exists: Square[]): boolean;
    static move(teris: SquareGroup, direction: MoveDirection, exists: Square[]): boolean;
    static move(teris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exists: Square[]): boolean {
        if (isPoint(targetPointOrDirection)) {
            if (this.canIMove(teris.shape, targetPointOrDirection, exists)) {
                teris.centerPoint = targetPointOrDirection;
                return true;
            }
            return false;
        } else {
            const direction = targetPointOrDirection;
            let targetPoint: Point;
            if (direction === MoveDirection.down) {
                targetPoint = {
                    x: teris.centerPoint.x,
                    y: teris.centerPoint.y + 1
                }
            } else if (direction === MoveDirection.left) {
                targetPoint = {
                    x: teris.centerPoint.x - 1,
                    y: teris.centerPoint.y
                }
            } else if (direction === MoveDirection.right) {
                targetPoint = {
                    x: teris.centerPoint.x + 1,
                    y: teris.centerPoint.y
                }
            } else {
                targetPoint = teris.centerPoint;
            }
            return this.move(teris, targetPoint, exists);
        }
    }

    /**
     * 一步移动到位
     * @param teris 
     * @param direction 
     */
    static moveDirectly(teris: SquareGroup, direction: MoveDirection, exists: Square[]) {
        while (this.move(teris, direction, exists));
    }

    static rotate(teris: SquareGroup, exists: Square[]): boolean {
        const newShape = teris.afterRotateShape();
        if (this.canIMove(newShape, teris.centerPoint, exists)) {
            teris.rotate();
            return true;
        } else {
            return false;
        }
    }

    /**
     * 从已存在的方块中进行消除，并返回消除的方块的行数
     * @param exists 
     */
    static deleteSquares(exists: Square[]): number {
        // 获得y坐标数组
        const ys = exists.map(sq => sq.point.y);
        // 获取最大和最小的的y坐标
        const maxY = Math.max(...ys);
        const minY = Math.min(...ys);
        // 循环判断 每一行是否可以消除
        let num = 0;
        for (let y = minY; y <= maxY; y++) {
            if (this.deleteLine(exists, y)) {
                num++;
            }
        }
        return num;
    }

    /**
     * 根据y，消除一行
     * @param exists 
     * @param y 
     */
    private static deleteLine(exists: Square[], y: number): boolean {
        const squares = exists.filter(sq => sq.point.y === y);
        if (squares.length === GameConfig.panelSize.width) {
            // 这一行可以消除
            squares.forEach(sq => {
                // 1. 从界面上移除
                sq.viewer?.remove();
                // 2. 从已存在的方块中把消除的方块移除
                const index = exists.indexOf(sq);
                exists.splice(index, 1);
            })
            // 3. 剩下的y坐标如果比移除的y坐标小，则y+1
            exists.filter(sq => sq.point.y < y).forEach(sq => {
                sq.point = {
                    x: sq.point.x,
                    y: sq.point.y + 1
                }
            })
            return true;
        }
        return false;
    }
}