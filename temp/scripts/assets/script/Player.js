"use strict";
cc._RFpush(module, 'ed8acE7QJhOcZVkMTY4nsBn', 'Player');
// script/Player.js

cc.Class({
    "extends": cc.Component,

    // Player.js
    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 跳跃音效资源
        jumpAudio: {
            "default": null,
            url: cc.AudioClip
        },
        game: {
            "default": null,
            type: cc.Node
        }
    },

    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    playJumpSound: function playJumpSound() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    moveRight: function moveRight(stop) {
        console.log("move moveRight");
        //向右移动
        if (stop) {
            this.accRight = false;
        } else {
            this.accLeft = false;
            this.accRight = true;
        }
    },
    moveLeft: function moveLeft(stop) {
        console.log("move moveLeft");
        //向左移动
        if (stop) {
            this.accLeft = false;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    },
    setInputControl: function setInputControl() {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.moveLeft(false);
                        break;
                    case cc.KEY.d:
                        self.moveRight(false);
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.moveLeft(true);
                        break;
                    case cc.KEY.d:
                        self.moveRight(true);
                        break;
                }
            }
        }, self.node);
        cc.eventManager.addListener({
            //单点触碰事件
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function onTouchBegan(touches, event) {
                console.log('touch start');
                var distance = self.node.getPosition().x + self.game.width / 2 - touches.getLocationX();
                console.log('touchstart player.getPosition().x:' + self.node.getPosition().x + " local x:" + touches.getLocationX());
                console.log(self.node.getPosition());
                if (distance >= 0) {
                    self.moveLeft(false);
                } else {
                    self.moveRight(false);
                }
                //必须返回true，否则不会执行下面的方法
                return true;
            },
            onTouchEnded: function onTouchEnded(touches, event) {
                console.log('touch end');
                var distance = self.node.getPosition().x + self.game.width / 2 - touches.getLocationX();
                console.log('end player.x:' + self.node.getPosition().x + " local x:" + touches.getLocationX());
                if (distance >= 0) {
                    self.moveLeft(true);
                } else {
                    self.moveRight(true);
                }
            }
        }, self.node);
    },
    // use this for initialization
    onLoad: function onLoad() {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // 初始化键盘输入监听
        this.setInputControl();
    },
    //每一帧
    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        //判断当前是否过界
    }

});

cc._RFpop();