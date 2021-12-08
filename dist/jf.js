/**
* version:1.0.0,
* name:jscanvas,
* author:jiasoft
* created:2021/12/7
* update:Wed Dec 08 2021 22:57:57 GMT+0800 (中国标准时间)
* */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MyBundle = {}));
})(this, (function (exports) { 'use strict';

    /* ----intro---- */

    class Sound {
        constructor(soundUrl){
           
            this.audio = document.createElement('audio');
    		document.body.appendChild(this.audio);
    		this.audio.src = soundUrl;
            this._log();
        }
        play(loop){
            if(loop)
                this.audio.loop = true;
            else
                this.audio.loop = false;
            this.audio.play();
        }
        pause(){
            this.audio.pause();
        }
        load(){
            this.audio.load();
        }
        canPlayType(){
            return this.audio.canPlayType();
        }
        getAudio(){
            return this.audio;
        }
        _log(){
            console.log("sound init.");
        }
    }

    const base = {};
    base.Stage = {width:800,height:700};
    base.c2d = null;
    let 	requestAnimFrame = (function(){
    	  return  window.requestAnimationFrame   ||
    			  window.webkitRequestAnimationFrame ||
    			  window.mozRequestAnimationFrame    ||
    			  function( callback ){
    					window.setTimeout(callback, 1000 / 60);
    			  };
    	})();
    function offset(elem){
        var box = elem.getBoundingClientRect();
        var docElem = document.documentElement;
        return {
            top: box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
                    left: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
            };
            
    }
    base.child = [];
    base.running = false;
    base.storeEvents = [];
      //_defJumpAttrVal = { x: 10, y: 10, alpha: 0.1, rotate: Math.PI / 180, scaleX: 0.1, scaleY: 0.1 },
    function callFrames(c2d) {
      	
      	var len = this.length;
      	if(!this[0].call)
      		console.log(this[0]);
        for (var i = 0; this[i] && i < len; i++)
            this[i].call(null,c2d);
      }
    function callEvent (spi) {
          if (this instanceof Array) {
          	var len = this.length;
          	
    	      for (var i = 0; i < len; i++) {
    	          this[i].call(base.Stage,spi);
    	      }
          }
      }
      /*鼠标事件*/
    function InitSysEvent(ele) {
          if (!ele.addEventListener)
              return;
          ele.addEventListener('mousedown', function (e) {

              var box = offset(e.target);
              var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
              var _spi = base.Stage.tipSpirit(_pos);
              callFrames.call(base.storeEvents, { type: 'mouse.down', pos: _pos, spirit: _spi });
          }, false);
          ele.addEventListener('mousemove', function (e) {
              var box = offset(e.target);
              var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
              var _spi = base.Stage.tipSpirit(_pos);
              callFrames.call(base.storeEvents, { type: 'mouse.move', pos: _pos, spirit: _spi });
          }, false);
          ele.addEventListener('mouseup', function (e) {
              var box = offset(e.target);
              var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
              var _spi = base.Stage.tipSpirit(_pos);
              callFrames.call(base.storeEvents, { type: 'mouse.up', pos: _pos, spirit: _spi });
          }, false);
          window.addEventListener('keydown', function (e) {
              callFrames.call(base.storeEvents, { type: 'key.down', keyCode: e.keyCode });
          }, false);
          window.addEventListener('keyup', function (e) {
              callFrames.call(base.storeEvents, { type: 'key.up', keyCode: e.keyCode });

          }, false);
          window.addEventListener('keypress', function (e) {
              callFrames.call(base.storeEvents, { type: 'key.press', keyCode: e.charCode });

          }, false);
          
          var _touches;
          var _toucheventfun = function (e, _type) {
              var poslist = [];
              //touches = _type == 'touch.end'?e.changedTouches:e.targetTouches;

              var box;

              _touches = e.changedTouches;
              var len = _touches.length;
              for (var i = 0; i < len; i++) {
                  box = offset(_touches[i].target);
                  poslist[i] = {
                      x: _touches[i].pageX - box.left,
                      y: _touches[i].pageY - box.top,
                      ide: _touches[i].identifier
                  };
              }

              var _spi = base.Stage.tipSpirit(poslist[0]);

              callFrames.call(base.storeEvents, { type: _type, touchPosList: poslist, spirit: _spi });
              e.preventDefault();
              e.stopPropagation();
          };
          ele.addEventListener('touchmove', function (e) {
              _toucheventfun(e, 'touch.move');
              return false;
          }, false);
          ele.addEventListener('touchstart', function (e) {
              _toucheventfun(e, 'touch.start');
              return false;
          }, false);
          ele.addEventListener('touchend', function (e) {

              _toucheventfun(e, 'touch.end');
              return false;
          }, false);
      }
      function runFrame() {
          if (!base.running)
              return;
          base.c2d.clearRect(0, 0, base.Stage.width, base.Stage.height);
    			var len = base.child.length;
          for (var i = 0; i < len && base.child[i]; i++) {
              if (base.child[i].hide)
                  continue;
                  
              if (base.child[i])
              base.child[i].callOwnFrame(base.c2d);
          }
          checkCollision();
      }
    /*添加碰撞*/
    function checkCollision() {
        var len = base.child.length;
        for (var i = 0; i < len - 1; i++) {
            if (base.child[i].hide || !base.child[i].canCollision)
                continue;
            for (var j = i + 1; j < len; j++) {
                if (base.child[j].hide || !base.child[j].canCollision)
                    continue;

                /*圆碰圆*/
                if (base.child[i].radius > 0 && base.child[j].radius > 0) {
                    var xw = Math.abs(base.child[j].centerX - base.child[i].centerX);
                    var hy = Math.abs(base.child[j].centerY - base.child[i].centerY);
                    var xy = Math.sqrt(Math.pow(xw, 2) + Math.pow(hy, 2));
                    if (xy <= (base.child[j].radius + base.child[i].radius))
                        callFrames.call(base.storeEvents, { type: 'collision.cc', colls: [base.child[i], base.child[j]] });
                    /*方碰方*/
                } else if (base.child[i].radius == 0 && base.child[j].radius == 0) {
                    if (Math.abs(base.child[j].x - base.child[i].x) <= (base.child[j].width + base.child[i].width) / 2 &&
                        Math.abs(base.child[j].y - base.child[i].y) <= (base.child[j].height + base.child[i].height) / 2) {
                        callFrames.call(base.storeEvents, { type: 'collision.ff', colls: [base.child[i], base.child[j]] });
                    }
                    /*圆碰方*/
                } else {
                    var CircleBox = base.child[i].radius > 0 ? base.child[i] : base.child[j];
                    var box = base.child[i].radius == 0 ? base.child[i] : base.child[j];

                    /*圆在方上下边*/
                    if (CircleBox.centerX >= box.centerX - box.width / 2 &&
                        CircleBox.centerX <= box.centerX + box.width / 2 &&
                        CircleBox.centerY >= (box.centerY - box.height / 2 - CircleBox.radius) &&
                        CircleBox.centerY <= (box.centerY + box.height / 2 + CircleBox.radius))
                        callFrames.call(base.storeEvents, { type: 'collision.cf', colls: [base.child[i], base.child[j]] });
                    /*圆在方的左右边*/
                    else if (CircleBox.centerY >= box.centerY - box.height / 2 &&
                        CircleBox.centerY <= box.centerY + box.height / 2 &&
                        CircleBox.centerX >= (box.centerX - box.width / 2 - CircleBox.radius) &&
                        CircleBox.centerX <= (box.centerX + box.width / 2 + CircleBox.radius))
                        callFrames.call(base.storeEvents, { type: 'collision.cf', colls: [base.child[i], base.child[j]] });
                    /*圆以方的左上角*/
                    else if (Math.sqrt(Math.pow(Math.abs(CircleBox.centerX - box.centerX + box.width / 2), 2) +
                                Math.pow(Math.abs(CircleBox.centerY - box.centerY + box.height / 2), 2)) <= CircleBox.radius)
                        callFrames.call(base.storeEvents, { type: 'collision.cf', colls: [base.child[i], base.child[j]] });
                    /*圆以方的右上角*/
                    else if (Math.sqrt(Math.pow(Math.abs(CircleBox.centerX - box.centerX - box.width / 2), 2) +
                                Math.pow(Math.abs(CircleBox.centerY - box.centerY + box.height / 2), 2)) <= CircleBox.radius)
                        this.callEvent.call(base.storeEvents, { type: 'collision.cf', colls: [base.child[i], base.child[j]] });
                    /*圆以方的右下角*/
                    else if (Math.sqrt(Math.pow(Math.abs(CircleBox.centerX - box.centerX - box.width / 2), 2) +
                                Math.pow(Math.abs(CircleBox.centerY - box.centerY - box.height / 2), 2)) <= CircleBox.radius)
                        this.callEvent.call(base.storeEvents, { type: 'collision.cf', colls: [base.child[i], base.child[j]] });
                    /*圆以方的左下角*/
                    else if (Math.sqrt(Math.pow(Math.abs(CircleBox.centerX - box.centerX + box.width / 2), 2) +
                                Math.pow(Math.abs(CircleBox.centerY - box.centerY - box.height / 2), 2)) <= CircleBox.radius)
                        callFrames.call(base.storeEvents, { type: 'collision.cf', colls: [base.child[i], base.child[j]] });
                    /*
                    if(CircleBox.x >= (box.x-box.width/2-CircleBox.radius) &&
                    CircleBox.x <= (box.x+box.width/2+CircleBox.radius) &&
                    CircleBox.y >= (box.y-box.height/2-CircleBox.radius) &&
                    CircleBox.y <= (box.y+box.height/2+CircleBox.radius))
                        
                        
                    callFrames.call(base.storeEvents,{type:'collision.cf',colls:[base.child[i],base.child[j]]});
                    */
                }
            }
        }
          
      }

    function Spirit(cx,cy,w,h,r){
        
        this.id = "spi_"+Math.floor(Math.random()*10000000);
        this.width= w||0;
        this.height=h||0;
        this.IsRund = r||false;
        this.rotate = 0;
        this.scaleX = 1;
        this.scaleY= 1;
        this.alpha = 1;
        this.hide = false;
        this.canCollision = false;
        this.loop = true;
        this.backgroundColor= "";
        this.borderWidth =0;
        this.borderColor = "";
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.shadowBlur = 0;
        this.shadowColor = "";
        this.name = "";
        
        var _this = this,
        _textureAtlas,
        _textureImage,
        _textureFramesLength = 0,
        _textureFrameIndex = 0,
        _textureFrameRate = 10,
        _tmpTextureFrameRate = 0,
        _centerX = cx,
        _centerY = cy,
        _frames = [],
        _child = [],
        _storeEvents = [],
        _movies = [],
        _movieIndex = 0,
        _movieFrameIndex = 0;
        
        var _initSpirit = function(c2d){
                c2d.save();
                c2d.beginPath();
                
                c2d.shadowOffsetX = this.shadowOffsetX;
                c2d.shadowOffsetY = this.shadowOffsetY;
                c2d.shadowBlur = this.shadowBlur;
                c2d.shadowColor =this.shadowColor;
                c2d.lineWidth = this.borderWidth;
                c2d.strokeStyle = this.borderColor;
                c2d.fillStyle = this.backgroundColor;
                
                
                if(this.IsRund){
                c2d.arc(0, 0, this.radius, 0, 2 * Math.PI);
                if(this.borderColor)
                        c2d.stroke();
                } else {
                    c2d.rect(-this.width/2, -this.height/2, this.width, this.height);
                    if(this.borderColor)
                        c2d.stroke();
                }
                
            
                
                if(this.backgroundColor)
                    c2d.fill();

                c2d.closePath();
                c2d.restore();
            //}
        },
        /*画Texture*/
        _drawTexture =function(c2d){
            
            if(_textureFramesLength <= 0)
                return;
            if(!_textureImage)
                return;
            c2d.save();
            c2d.beginPath();
            try{
            
            c2d.drawImage(_textureImage,
                                                _textureAtlas.frames[_textureFrameIndex].frame.x,
                                                _textureAtlas.frames[_textureFrameIndex].frame.y,
                                                _textureAtlas.frames[_textureFrameIndex].frame.w,
                                                _textureAtlas.frames[_textureFrameIndex].frame.h,
                                                _textureAtlas.frames[_textureFrameIndex].spriteSourceSize.x-this.width/2,
                                                _textureAtlas.frames[_textureFrameIndex].spriteSourceSize.y-this.height/2,
                                                _textureAtlas.frames[_textureFrameIndex].spriteSourceSize.w,
                                                _textureAtlas.frames[_textureFrameIndex].spriteSourceSize.h);
            }catch(e){console.log(e);}
            c2d.closePath();
            c2d.restore();
            
            if(_textureFrameIndex == 0 && _tmpTextureFrameRate == 0)
                callEvent.call(_storeEvents,{type:'drawtexture.start',spirit:this});
            
            if(_textureFrameIndex == (_textureFramesLength -1) && _textureFrameRate == _tmpTextureFrameRate)
                callEvent.call(_storeEvents,{type:'drawtexture.end',spirit:this});
                
                
            /*换帧 */
            _tmpTextureFrameRate = _tmpTextureFrameRate < _textureFrameRate ? _tmpTextureFrameRate+1:0;
            if(_tmpTextureFrameRate == _textureFrameRate){
                if(this.loop)
                    _textureFrameIndex = _textureFrameIndex >= (_textureFramesLength - 1)?0:_textureFrameIndex+1;
                else
                    _textureFrameIndex = _textureFrameIndex >= (_textureFramesLength - 1)?_textureFramesLength -1 : _textureFrameIndex+1;
            }
            
            
        },
        _drawMovie = function(c2d){
            var mlen = _movies.length;
            if(mlen <= 0)
                return;
            c2d.save();
            c2d.beginPath();
            
            _movies[_movieIndex].draw.call(_this,c2d);
            c2d.closePath();
            c2d.restore();
            
            
            /*换帧*/
            if(_movieIndex <= mlen-1 && _movieFrameIndex <= _movies[_movieIndex].frameRate)
                _movieFrameIndex++;
                
            if(_movieFrameIndex >= _movies[_movieIndex].frameRate){
                if(_movieIndex >= mlen-1 && _movieFrameIndex >= _movies[_movieIndex].frameRate && !_this.loop)
                    return;
                    
                _movieFrameIndex = 0;
                    
                if(_this.loop){
                    _movieIndex = _movieIndex < mlen-1 ? _movieIndex+1:0;
                }else
                    _movieIndex = _movieIndex < mlen-1 ? _movieIndex+1:mlen - 1;
            }
            
            if(_movieFrameIndex == 0 && _movieIndex == 0)
                callEvent.call(_storeEvents,{type:'drawmovie.start',spirit:this});
            
            if(_movieIndex == (mlen-1) && _movieFrameIndex == _movies[_movieIndex].frameRate-1){
                
                callEvent.call(_storeEvents,{type:'drawmovie.end',spirit:this});
            }
            
            if(_movieFrameIndex == 0)
                callEvent.call(_storeEvents,{type:'drawmovie.each',spirit:this});
                
        };
        
        this.loadTextureJson = function(url){
            _loadJson('get',url,'',function(data){
                _textureAtlas = data;
                _textureImage = new Image();
                _textureImage.src = data.meta.image;
                _textureFramesLength = data.frames.length;
            });
        };
        this.setTextureJson = function(json){
            _textureAtlas = json;
            _textureImage = new Image();
            _textureImage.src = json.meta.image;
            _textureFramesLength = json.frames.length;
        };
        this.addMovie = function(drawfun,frameRate){
            frameRate = frameRate||1;
            _movies.push({draw:drawfun,frameRate:frameRate});
        };
        this.addFrame = function(callback){
            if(typeof(callback) == 'function'){
                _frames.push(callback);
            }
        };
        this.removeFrame =function(callback){
            var len = _frames.length;
            for(var i = 0;i < len;i++){
                if(_frames[i] == callback){
                    _frames.splice(i,1);
                }
            }
        };
        this.add = function(spi){
            _child.push(spi);
        };
        this.remove =function(spi){
            var len = _child.length;
            for(var i = 0;i < len;i++){
                if(_child[i].id == spi.id)
                    _child.splice(i,1);
            }
        };
        this.indexOf =function(spi){
            if(_child.indexOf)
                return _child.indexOf(spi);
            var len = _child.length;
            for(var i =0;i < len;i++)
                if(this._child[i] === spi)
                    return i;
            return -1;
        };
        this.on =function(callback){
            _storeEvents.push(callback);
        };
        this.unOn=function(callback){
            var len = _storeEvents.length;
            for(var i = 0; i < len;i++)
                if(_storeEvents[i] == callback)
                    _storeEvents.splice(i,1);
                
        };
        //Object.defineProperty(this, "textureFrameRate", { get: function () { return _textureFrameRate; },set:function(v){_textureFrameRate=v;} });
        Object.defineProperty(this,"centerX",{get:function(){return _centerX;},set:function(v){_centerX = v;}});
        Object.defineProperty(this,"centerY",{get:function(){return _centerY;},set:function(v){_centerY = v;}});
        Object.defineProperty(this,"x",{
            get:function(){return _centerX - _this.width/2},
            set:function(v){_centerX = _this.width/2 + v;}
        });
        Object.defineProperty(this,"y",{
            get:function(){return _centerY - _this.height/2},
            set:function(v){_centerY  =  _this.height/2 + v;}
        });
        Object.defineProperty(this,"frames",{get:function(){return _frames}});
        Object.defineProperty(this,"child",{get:function(){return _child}});
        Object.defineProperty(this,"radius",{get:function(){return _this.width/2 }});
        
        
        /*执行*/
        this.addFrame(function(c2d){
            _initSpirit.call(_this,c2d);
            _drawTexture.call(_this,c2d);
            _drawMovie.call(_this,c2d);
        });
    }

    Spirit.prototype = {
        animates:function(obj,frameRate,callback){
            var clen = 0;
            for(var i in obj){
                clen ++;
                this.animate(i,obj[i],frameRate,function(){
                    clen --;
                    if(clen == 0 && typeof(callback) === "function")
                        callback.call();
                });
            }
        },
        animate:function(atr,value,frameRate,callback){
            frameRate = frameRate||20;
            var _frameIndex = 0;
            //var step = value >= this[atr]?_defJumpAttrVal[atr]:-_defJumpAttrVal[atr];
            var step = (value - this[atr])/frameRate;
            var _this = this;
            var _changatr = function(){
                _this[atr] +=step;
                _frameIndex++;
                if(_frameIndex >= frameRate){
                    
                        _this[atr] = value;
                        _this.removeFrame(_changatr);
                        if(typeof(callback) == 'function')
                            callback();
                        return;
                    
                }
            };
            this.addFrame(_changatr);
            
        },
        
        hideChild:function(index){
            var len = this.child.length;
            for(var i = 0;i < len;i++){
                this.child[i].hide = (i==index?true:false);
            }
        },
        callOwnFrame:function(c2d){
            
            c2d.save();
            c2d.beginPath();
            c2d.translate(this.centerX, this.centerY);
            c2d.rotate(this.rotate);
            c2d.scale(this.scaleX,this.scaleY);
            c2d.globalAlpha = this.alpha;
            callFrames.call(this.frames,c2d);
            var len = this.child.length;
            for (var i = 0; i < len && this.child[i]; i++) {
        if (this.child[i].hide)
            continue;
        if (this.child[i])
            this.child[i].callOwnFrame(c2d);
        }
        c2d.closePath();
            c2d.restore();
        }
    };

    //child,c2d,running,storeEvents,


    base.Stage.add = function (obj) {
        obj.index = 0;
        base.child.push(obj);
    };
    base.Stage.remove=function (spi) {
        var len = base.child.length;
        for (var i = 0; i < len; i++) {
                
            if (spi == base.child[i] || base.child[i].id == spi.id){
                base.child.splice(i, 1);
                return true;
            }

        }
        return false;
    };

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
    };
    base.Stage.pause = function () {

        if (!base.running)
            return;

        base.running = false;

    };
    base.Stage.indexOf = function (spi) {
        if (base.child.indexOf)
            return base.child.indexOf(spi);
        var len = base.child.length;
        for (var i = 0; i < len; i++)
            if (base.child[i] === spi)
                return i;
        return -1;
    };
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
    };
    base.Stage.moveToIndex = function (spi, index) {
          var i = this.indexOf(spi);
          base.child.splice(index, 0, spi);
          base.child.splice(i, 1);
      },
    base.Stage.moveTop = function (spi) {
        var i = this.indexOf(spi);
        base.child.splice(base.child.length, 0, spi);
        base.child.splice(i, 1);
    };
    base.Stage.createSpirit = function(x,y,w,h,r){
        var s = new Spirit(x,y,w,h,r);
        this.add(s);
        return s;
    };
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
        
    };

      /*系统事件*/
    base.Stage.on = function (callback) {
        base.storeEvents .push(callback);
    };
    base.Stage.unOn =  function (callback) {
              var len = base.storeEvents .length;
        for (var i = 0; i < len; i++)
            if (base.storeEvents [i] == callback)
                base.storeEvents .splice(i, 1);
    };
      /*上下左右控制器*/
    base.Stage.controller = {
        up: false,
        down: false,
        left: false,
        right: false
    };

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

    var JF = {
        Sound,Spirit,Stage:base.Stage
    };

    exports.JF = JF;

    Object.defineProperty(exports, '__esModule', { value: true });

    debugger;exports.JF.version = "1.0.0";window.JF = exports.JF

}));
/* ----footer---- */
//# sourceMappingURL=jf.js.map
