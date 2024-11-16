import './style.css';
import Phaser from 'phaser';
import {BALL_KEY, BALL_SPEED, BAT_KEY, BAT_SPEED, CANVAS_SIZE, GAME_SCENE_KEY} from './constants.js';

const gameStartDiv = document.querySelector('#startScene');
const gameEndDiv = document.querySelector('#endScene');
const gameStartButton = document.querySelector('#start-button');
const gameScene = document.querySelector('#gameCanvas');
const scoreText = document.querySelector('#score-text');
const replayButton = document.querySelector('#replay-button');

class GameScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENE_KEY);
        this.player;
        this.target;
        this.cursor;
        this.points = 0;
        this.score;
        this.timeEvent;
        this.timeText;
    }

    preload() {
        this.load.image(BALL_KEY,'assets/ball.jpg');
        this.load.image(BAT_KEY,'assets/bat.jpg');
    }

    create() {
        //initially pause game
        this.scene.pause(GAME_SCENE_KEY)

        //create player and target
        this.createPlayer();
        this.createTarget();

        //create cursor
        this.cursor = this.input.keyboard.createCursorKeys();

        //handle collision
        this.physics.add.overlap(this.player, this.target,this.handleCollision);

        //time event to end game
        this.timeEvent = this.time.delayedCall(30000,this.gameOver);

        // UI stuffs
        this.score = this.add.text(0,0,"Score : 0");
        this.timeText = this.add.text(CANVAS_SIZE.width-150,0,"Time : 0");
    }

    update() {
        this.updateTime();
        this.respawnBall();
        this.controlPlayer();
    }

    updateTime() {
        this.timeText.setText(`Time : ${Math.floor(this.timeEvent.getRemainingSeconds())}`);
    }

    createTarget() {
        this.target = this.physics.add.image(0, 0, BALL_KEY);
        this.target.setMaxVelocity(0, BALL_SPEED);
        this.target.setSize(100, 100);
    }

    createPlayer() {
        this.player = this.physics.add.image(0, 250, BAT_KEY).setOrigin(0, 0);
        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);
        this.player.setSize(100, 100);
    }

    controlPlayer() {
        const {left, right} = this.cursor;

        if (left.isDown) {
            this.player.setVelocityX(-BAT_SPEED);
        } else if (right.isDown) {
            this.player.setVelocityX(BAT_SPEED);
        } else {
            this.player.setVelocityX(0);
        }
    }

    respawnBall() {
        if (this.target.y >= CANVAS_SIZE.height) {
            this.target.setX(this.getRandomX());
            this.target.setY(0);
        }
    }

    getRandomX = ()=>{
        return Math.floor(Math.random() * CANVAS_SIZE.width);
    }

    handleCollision = () => {
        this.target.setX(this.getRandomX());
        this.target.setY(0);
        this.points++;
        this.score.setText(`Score : ${this.points}`);
    }

    gameOver = () => {
        this.sys.game.destroy(true);
        gameEndDiv.style.display = 'block';
        scoreText.textContent = `Your Score : ${this.points}`
    }
}

export const config = {
    type : Phaser.WEBGL,
    width : CANVAS_SIZE.width,
    height : CANVAS_SIZE.height,

    // this "gameCanvas" is the id we give to the game canvas
    canvas : gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y : 220
            },
            debug: true
        }
    },
    scene: [GameScene]
}

const game = new Phaser.Game(config);

function startGame() {
    // this.scene.star(GAME_SCENE_KEY)
    gameStartDiv.style.display = 'none';
    gameScene.style.display = 'block';
    game.scene.resume(GAME_SCENE_KEY);
}

gameStartButton.addEventListener('click', ()=>{
    startGame();
})

replayButton.addEventListener('click',()=>{
    startGame();
})