import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import { GameStatus, GameViewer, MoveDirection } from "./types";

export class Game {
    // 游戏状态
    private _gameStatus: GameStatus = GameStatus.init;
    // 当前玩家操作的方块
    private _curTeris?: SquareGroup;
    // 下一个方块
    private _nextTeris: SquareGroup;
    // 计时器
    private _timer?: number;
    // 自动下落的间隔时间
    private _duration: number;
    // 当前游戏中已存在的小方块, 触底后方块组直接看成是多个小方块
    protected _exists: Square[] = [];
    // 积分
    private _score: number = 0;

    public get gameStatus() {
        return this._gameStatus;
    }

    public get score() {
        return this._score;
    }

    public set score(val: number) {
        this._score = val;
        this._viewer.showScore(val);
        const level = GameConfig.levels.filter(it => it.score < val).pop(); 
        if(level && level.duration !== this._duration) {
            this._duration = level.duration;
            if(this._timer) {
                clearInterval(this._timer);
                this._timer = undefined;
                this.autoDrop();
            }
        }
        console.log(this._duration)
    }

    constructor(private _viewer: GameViewer) {
        this._duration = GameConfig.levels[0].duration;
        this._nextTeris = createTeris({x: 0, y: 0});
        this.createNext();
        this._viewer.init(this);
        this._viewer.showScore(this.score);
    }

    private createNext() {
        this._nextTeris = createTeris({x: 0, y: 0});
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.showNext(this._nextTeris);
    }

    private init() {
        this._exists.forEach(sq => {
            sq.viewer?.remove();
        })
        this._exists = [];
        this.createNext();
        this._curTeris = undefined;
        this._duration = GameConfig.levels[0].duration;
        this.score = 0;

    }
    /**
     * 游戏开始
     */
    start() {
        // 改变游戏状态
        if(this._gameStatus === GameStatus.playing) {
            return;
        }
        // 从游戏结束到重新开始
        if(this._gameStatus === GameStatus.over) {
            this.init();
        }
        this._gameStatus = GameStatus.playing;
        this._viewer.onGameStart();
        // 给当前方块赋值，同时改变下一个方块
        if(!this._curTeris) {
            this.switchTeris();
        }
        // 控制当前方块自由下落
        this.autoDrop();
        
    }

    /**
     * 游戏暂停 
     */
    pause() {
        if(this._gameStatus === GameStatus.playing) {
            this._gameStatus = GameStatus.pause;
            clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGamePause();
        }
    }

    controlLeft() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.left, this._exists);
        }
    }
    controlRight() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.right, this._exists);
        }
    }
    controlDown() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            // TerisRule.move(this._curTeris, MoveDirection.down);
            if(!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
                // 触底
                this.hitBottom();
            }
        }
    }
    controlRotate() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.rotate(this._curTeris, this._exists);
        }
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        if(this._timer || this._gameStatus !== GameStatus.playing) {
            return;
        }
        this._timer = setInterval(() => {
            if(this._curTeris) {
                if(!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
                    // 触底
                    this.hitBottom();
                }
            }
        }, this._duration);
    }

    /**
     * 切换方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris;
        this._curTeris.squares.forEach(sq => {
            sq.viewer?.remove();
        })
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris);
        // 当前方块出现时，就已经和之前的方块重叠了，则游戏结束
        if(!TerisRule.canIMove(this._curTeris.shape, this._curTeris.centerPoint, this._exists)) {
            // 游戏结束
            this._gameStatus = GameStatus.over;
            clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGameOver();
            return;
        }
        this.createNext();
        this._viewer.switch(this._curTeris);

    }

    /**
     * 设置中心点坐标，以达到该方块出现在中上方
     * @param width 
     * @param teris 
     */
    private resetCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.floor(width / 2) - 1;
        const y = 0;
        teris.centerPoint = {x, y};
        while(teris.squares.some(it => it.point.y < 0)) {
            teris.centerPoint = {
                x: teris.centerPoint.x,
                y: teris.centerPoint.y + 1
            }
        }
    }
    /**
     * 触底之后的操作
     */
    private hitBottom() {
        // 将当前的俄罗斯方块包含的小方块，加入到已存在的方块数组中
        this._exists.push(...this._curTeris!.squares);
        // 消除方块
        const num = TerisRule.deleteSquares(this._exists);
        // 增加积分
        this.addScore(num);
        // 切换方块
        this.switchTeris();

    }

    private addScore(lineNum: number) {
        if(lineNum === 0) return ;
        else if(lineNum === 1) {
            this.score += 10;
        } else if(lineNum === 2) {
            this.score += 30;
        } else if(lineNum === 3) {
            this.score += 50;
        } else {
            this.score += 100;
        }
        
    }
}