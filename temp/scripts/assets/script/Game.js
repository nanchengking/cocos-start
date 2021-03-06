"use strict";
cc._RFpush(module, '7eb70bRrcxBArB/+qL9gEc3', 'Game');
// script/Game.js

cc.Class({
    'extends': cc.Component,

    // Game.js
    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            'default': null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            'default': null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            'default': null,
            type: cc.Node
        },
        // ...
        // score label 的引用
        scoreDisplay: {
            'default': null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            'default': null,
            url: cc.AudioClip
        }
    },
    onLoad: function onLoad() {
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 生成一个新的星星
        this.spawnNewStar();
        // ...
        // 初始化计分
        this.score = 0;
        this.doAct = false;
        this.setTouchController();
    },

    spawnNewStar: function spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        cc.log("new start: ");
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    gainScore: function gainScore() {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    setTouchController: function setTouchController() {
        // this.node.on('touchstart', function (event) {
        //     var distance=this.player.x+this.node.width/2-event.getLocationX();
        //     console.log(this.player);
        //     console.log(this.player.getComponent('Player'));
        //     console.log('touchstart player.x:'+this.player.x+" local x:"+event.getLocationX());
        //     if(distance>=0){
        //       this.player.getComponent('Player').moveLeft(false);
        //     }else{
        //         this.player.getComponent('Player').moveRight(false);
        //     }
        // }, this);
        // this.node.on('touchend', function (event) {
        //     var distance=this.player.x+this.node.width/2-event.getLocationX();
        //     console.log('touchEnd player.x:'+this.player.x+" local x:"+event.getLocationX());
        //     if(distance>=0){
        //         this.player.getComponent('Player').moveLeft(true);
        //     }else{
        //         this.player.getComponent('Player').moveRight(true);
        //     }
        // }, this);  
    },
    touchBorder: function touchBorder() {
        //碰到边缘的时候
        console.log("反转x");
        var targetX = this.player.x;
        if (targetX >= 0) {
            targetX = this.node.width / 2 - 100;
        } else {
            targetX = 100 - this.node.width / 2;
        }
        console.log("move to:" + targetX);
        var action = cc.moveTo(2, cc.p(targetX, this.player.y));
        this.player.runAction(action);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
        var width = this.node.width;
        var x = this.player.x;
        if (Math.abs(x * 2) - width >= 0) {
            this.doAct = true;
            console.log("x=" + x + ";width=" + width + "result=" + (Math.abs(x * 2) - width));
            this.touchBorder();
        }
    },
    gameOver: function gameOver() {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }
});

cc._RFpop();