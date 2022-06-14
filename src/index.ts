import {Game} from './core/Game'
import { GamePageViewer } from './core/viewer/GamePageViewer';
import $ from 'jquery'

const g = new Game(new GamePageViewer());


$("#start").on('click', function() {
    g.start();
})

$("#pause").on('click', function() {
    g.pause();
})

$("#toDown").on('click', function() {
    g.controlDown();
})
$("#toLeft").on('click', function() {
    g.controlLeft();
    
})
$("#toRight").on('click', function() {
    g.controlRight();
})

$("#rotateClock").on('click', function() {
    g.controlRotate();
})