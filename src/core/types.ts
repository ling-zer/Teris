import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

export interface Point {
    readonly x: number,
    readonly y: number
}

export interface IViewer {
    /**
     * 显示
     */
    show(): void;
    /**
     * 移除、不再显示
     */
    remove(): void;
}

/**
 * 形状
 */
export type Shape = Point[]

export enum MoveDirection {
    left,
    right,
    down
}

export enum GameStatus {
    init, // 未开始
    playing, // 进行中
    pause, // 暂停
    over // 结束
}

export interface GameViewer {
    /**
     * 
     * @param teris 下一个方块对象
     */
    showNext(teris: SquareGroup):void;
    /**
     * 
     * @param teris 切换的方块对象
     */
    switch(teris: SquareGroup): void

    /**
     * 完成界面初始化
     */
    init(game: Game): void;
    /**
     * 显示分数
     * @param score 
     */
    showScore(score: number): void;

    /**
     * 游戏暂定的时候
     */
    onGamePause(): void;
    /**
     * 当游戏开始后
     */
    onGameStart(): void;
    /**
     * 当游戏结束后
     */
    onGameOver(): void;
}