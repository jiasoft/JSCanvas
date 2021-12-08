"use strict";
import {base,requestAnimFrame,InitSysEvent,runFrame} from "./base.js"
import {Spirit} from "./Spirit.js"
//child,c2d,running,storeEvents,


base.Stage.add = function (obj) {
    obj.index = 0;
    base.child.push(obj);
};
base.Stage.remove=function (spi) {
    var len = base.child.length
    for (var i = 0; i < len; i++) {
            
        if (spi == base.child[i] || base.child[i].id == spi.id){
            base.child.splice(i, 1);
            return true;
        }

    }
    return false;
}

base.Stage.play = function () {
    if (base.running)
        return;
    base.running = true;
    var fps = 0;
    var msg = document.createElement('span');
    msg.setAttribute('style','position:fixed;top:0px;left:0px;background:#fff;padding:0px 5px');
    document.body.appendChild(msg);
    (function animloop() {
        runFrame();
        fps++;
        requestAnimFrame(animloop);
    })();
    setInterval(function(){
        msg.innerHTML ="fps:"+fps;
        fps = 0;
    },1000);
}
base.Stage.pause = function () {

    if (!base.running)
        return;

    base.running = false;

}
base.Stage.indexOf = function (spi) {
    if (base.child.indexOf)
        return base.child.indexOf(spi);
    var len = base.child.length;
    for (var i = 0; i < len; i++)
        if (base.child[i] === spi)
            return i;
    return -1;
}
base.Stage.moveUp = function (spi) {
    var index = this.indexOf(spi);
    base.child.splice(index, 1);
    base.child.splice(index + 1, 0, spi);
},
base.Stage.moveDown = function (spi) {
    var index = this.indexOf(spi);
    base.child.splice(index, 1);
    var previndex = index - 1;
    previndex = previndex < 0 ? 0 : previndex;
    base.child.splice(previndex, 0, spi);
}
base.Stage.moveToIndex = function (spi, index) {
      var i = this.indexOf(spi);
      base.child.splice(index, 0, spi);
      base.child.splice(i, 1);
  },
base.Stage.moveTop = function (spi) {
    var i = this.indexOf(spi);
    base.child.splice(base.child.length, 0, spi);
    base.child.splice(i, 1);
}
base.Stage.createSpirit = function(x,y,w,h,r){
    var s = new Spirit(x,y,w,h,r);
    this.add(s);
    return s;
}
base.Stage.init = function (id) {
    var ele = document.getElementById(id);
    this.width = parseInt(ele.width);
    this.height = parseInt(ele.height);
    base.c2d = ele.getContext("2d");
    base.c2d.clearRect(0, 0, this.width, this.height);
    base.c2d.save();
    InitSysEvent(ele);
     /******健盘控制器******/
    this.on(function (obj) {

        if (obj.type == "key.down") {

            switch (obj.keyCode) {
                case 87:
                    base.Stage.controller.up = true;
                    break;
                case 83:
                    base.Stage.controller.down = true;
                    break;
                case 65:
                    base.Stage.controller.left = true;
                    break;
                case 68:
                    base.Stage.controller.right = true;
                    break;
                case 74:
                    //_this.controller.jump = true;
                    break;
            }
        } else if (obj.type == "key.up") {
            switch (obj.keyCode) {
                case 87:
                    base.Stage.controller.up = false;
                    break;
                case 83:
                    base.Stage.controller.down = false;
                    break;
                case 65:
                    base.Stage.controller.left = false;
                    break;
                case 68:
                    base.Stage.controller.right = false;
                    break;
                case 74:
                    base.Stage.callEvent.call(base.storeEvents , { type: 'action.jump', keyCode: 74 });
                    break;
                case 75:
                    base.Stage.callEvent.call(base.storeEvents , { type: 'action.kill', keyCode: 75 });
                    break;
            }
        }
    });
    
}

  /*系统事件*/
base.Stage.on = function (callback) {
    base.storeEvents .push(callback);
}
base.Stage.unOn =  function (callback) {
          var len = base.storeEvents .length
    for (var i = 0; i < len; i++)
        if (base.storeEvents [i] == callback)
            base.storeEvents .splice(i, 1);
}
  /*上下左右控制器*/
base.Stage.controller = {
    up: false,
    down: false,
    left: false,
    right: false
}

base.Stage.tipSpirit = function (pos) {
    var len = base.child.length;
    for (var i = len - 1; i >= 0; i--) {
        if (pos.x >= base.child[i].x &&
                   pos.x <= base.child[i].x + base.child[i].width &&
                   pos.y >= base.child[i].y &&
                   pos.y <= base.child[i].y + base.child[i].height) {
                    return base.child[i];
        }
    }
    return null;
};
Object.defineProperty(base.Stage, "child", { get: function () { return base.child; } });
export default base;