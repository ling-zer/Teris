import { Square } from "../Square";
import $ from "jquery"
import { IViewer } from "../types";
import PageConfig from "./PageConfig";

/**
 * 显示小方块到页面上
 */
export class SquarePageViewer implements IViewer {
    private dom?: JQuery<HTMLElement>
    private isRemoved:  boolean = false // 是否已经移除过了
    
    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) {}

    show(): void {
        if(this.isRemoved) {
            return ;
        }
        if(!this.dom) {
            this.dom = $("<div>").css({
                position: 'absolute',
                width: PageConfig.SquareSize.width,
                height: PageConfig.SquareSize.height,
                border: '1px solid #ccc',
                boxSizing: 'border-box'
            }).appendTo(this.container);
        }

        this.dom.css({
            left: this.square.point.x * PageConfig.SquareSize.width,
            top: this.square.point.y * PageConfig.SquareSize.height,
            backgroundColor: this.square.color
        })
    }
    remove(): void {
        if(this.dom && !this.isRemoved) {
            this.dom.remove();
        }
    }
}