/*
var TextureAtlasBG = {
		imagePath:"rs/a.jpg",
		SubTexture:[
			{name:'bg1',x:0,y:0,width:1040,height:700,frameX:0,frameY:0,frameWidth:1040,frameHeight:700}
		]
	};
	参数值
	参数 	描述
	imagePath 	规定要使用的图像、画布或视频。
	x 	可选。开始剪切的 x 坐标位置。
	y 	可选。开始剪切的 y 坐标位置。
	width 	可选。被剪切图像的宽度。
	height 	可选。被剪切图像的高度。
	frameX 	在画布上放置图像的 x 坐标位置。
	frameY 	在画布上放置图像的 y 坐标位置。
	frameWidth 	可选。要使用的图像的宽度。（伸展或缩小图像）
	frameHeight 	可选。要使用的图像的高度。（伸展或缩小图像）
*/


var JF = {version:1.0,creater:"邱土佳 |18665378372|jiasoft@163.com",name:'Canvas game lib',newDate:'20140529',updateDate:'20150624'};

(function (jf){
	
	/****舞台*****/
	var 
	_stage = jf.stage = {width:800,height:700,rtime: 13},
	_c2d,
	_requestAnimFrame = (function(){
	  return  window.requestAnimationFrame   ||
			  window.webkitRequestAnimationFrame ||
			  window.mozRequestAnimationFrame    ||
			  function( callback ){
				window.setTimeout(callback, 1000 / 60);
			  };
	})(),
	_offset = function(elem){
    var box = elem.getBoundingClientRect();
    var docElem = document.documentElement;
    return{
        top: box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
				left: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
            
	},
	_child: [],
  _running: false,
  _storeEvents: [],
  _callFrames = function () {
      for (var i = this.length - 1; i >= 0; i--)
          this[i].call(null,c2d);
  },
  _callEvent = function (obj) {
      if (this instanceof Array) {
          for (var i = 0; i < this.length; i++) {
              this[i](obj);
          }
      }
  },
  /*处得系统事件*/
  _InitSysEvent = function (ele) {

      /*attachEvent*/
     
      var box = {top:0,left:0}
      //var evt = {x:0,y:0,keyCode:0,touch:[]};
      if (!ele.addEventListener)
          return;
      /*
      ele.addEventListener('click', function (e) {
          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _dobj = _stage.tipDobject(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.click', pos: _pos, curObj: _dobj });
      }, false);
      */
      ele.addEventListener('mousedown', function (e) {

          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _dobj = _stage.tipDobject(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.down', pos: _pos, curObj: _dobj });
      }, false);
      ele.addEventListener('mousemove', function (e) {
          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _dobj = _stage.tipDobject(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.move', pos: _pos, curObj: _dobj });
      }, false);
      ele.addEventListener('mouseup', function (e) {
          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _dobj = _stage.tipDobject(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.up', pos: _pos, curObj: _dobj });
      }, false);
      window.addEventListener('keydown', function (e) {
          _callEvent.call(_storeEvents, { type: 'key.down', keyCode: e.keyCode });
      }, false);
      window.addEventListener('keyup', function (e) {
          _callEvent.call(_storeEvents, { type: 'key.up', keyCode: e.keyCode });

      }, false);
      window.addEventListener('keypress', function (e) {
          _callEvent.call(_storeEvents, { type: 'key.press', keyCode: e.charCode });

      }, false);
      
      var _touches;
      var _toucheventfun = function (e, _type) {
          var poslist = [];
          //touches = _type == 'touch.end'?e.changedTouches:e.targetTouches;

          var box;

          _touches = e.changedTouches;
          for (var i = 0; i < _touches.length; i++) {
              box = _offset(_touches[i].target);
              poslist[i] = {
                  x: _touches[i].pageX - box.left,
                  y: _touches[i].pageY - box.top,
                  ide: _touches[i].identifier
              };
          }

          var _dobj = _stage.tipDobject(poslist[0]);

          _callEvent.call(_storeEvents, { type: _type, touchPosList: poslist, curObj: _dobj });
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
  },
  _run=function () {
      if (!_running)
          return;
      _c2d.clearRect(0, 0, this.width, this.height);

      for (var i = 0; i < ._child.length; i++) {
          if (_child[i].hide)
              continue;
          if (_child[i])
              _callFrames.call(_child[i]._storeRuns, _c2d);
          //for(var j = 0;j < this._child[i]._storeRuns.length;j++)
          //	this._child[i]._storeRuns[j](_c2d);
      }
      _checkCollision();
  },
    /*添加碰撞*/
  _checkCollision = function () {
      var len = _child.length;
      for (var i = 0; i < len - 1; i++) {
          if (_child[i].hide || !_child[i].canCollision)
              continue;
          for (var j = i + 1; j < len; j++) {
              if (_child[j].hide || !_child[j].canCollision)
                  continue;

              /*圆碰圆*/
              if (_child[i].radius > 0 && _child[j].radius > 0) {
                  var xw = Math.abs(_child[j].getCX() - _child[i].getCX());
                  var hy = Math.abs(_child[j].getCY() - _child[i].getCY());
                  var xy = Math.sqrt(Math.pow(xw, 2) + Math.pow(hy, 2));
                  if (xy <= (_child[j].radius + _child[i].radius))
                      _callEvent.call(_storeEvents, { type: 'collision.cc', colls: [_child[i], _child[j]] });
                  /*方碰方*/
              } else if (_child[i].radius == 0 && _child[j].radius == 0) {
                  if (Math.abs(_child[j].x - _child[i].x) <= (_child[j].width + _child[i].width) / 2 &&
					 Math.abs(_child[j].y - _child[i].y) <= (_child[j].height + _child[i].height) / 2) {
                      _callEvent.call(_storeEvents, { type: 'collision.ff', colls: [_child[i], _child[j]] });
                  }
                  /*圆碰方*/
              } else {
                  var CircleBox = _child[i].radius > 0 ? _child[i] : _child[j];
                  var box = _child[i].radius == 0 ? _child[i] : _child[j];

                  /*圆在方上下边*/
                  if (CircleBox.getCX() >= box.getCX() - box.width / 2 &&
					 CircleBox.getCX() <= box.getCX() + box.width / 2 &&
					 CircleBox.getCY() >= (box.getCY() - box.height / 2 - CircleBox.radius) &&
					 CircleBox.getCY() <= (box.getCY() + box.height / 2 + CircleBox.radius))
                      _callEvent.call(_storeEvents, { type: 'collision.cf', colls: [_child[i], _child[j]] });
                  /*圆在方的左右边*/
                  else if (CircleBox.getCY() >= box.getCY() - box.height / 2 &&
					 CircleBox.getCY() <= box.getCY() + box.height / 2 &&
					 CircleBox.getCX() >= (box.getCX() - box.width / 2 - CircleBox.radius) &&
					 CircleBox.getCX() <= (box.getCX() + box.width / 2 + CircleBox.radius))
                      _callEvent.call(_storeEvents, { type: 'collision.cf', colls: [_child[i], _child[j]] });
                  /*圆以方的左上角*/
                  else if (Math.sqrt(Math.pow(Math.abs(CircleBox.getCX() - box.getCX() + box.width / 2), 2) +
								Math.pow(Math.abs(CircleBox.getCY() - box.getCY() + box.height / 2), 2)) <= CircleBox.radius)
                      _callEvent.call(_storeEvents, { type: 'collision.cf', colls: [_child[i], _child[j]] });
                  /*圆以方的右上角*/
                  else if (Math.sqrt(Math.pow(Math.abs(CircleBox.getCX() - box.getCX() - box.width / 2), 2) +
								Math.pow(Math.abs(CircleBox.getCY() - box.getCY() + box.height / 2), 2)) <= CircleBox.radius)
                      this.callEvent.call(_storeEvents, { type: 'collision.cf', colls: [_child[i], _child[j]] });
                  /*圆以方的右下角*/
                  else if (Math.sqrt(Math.pow(Math.abs(CircleBox.getCX() - box.getCX() - box.width / 2), 2) +
								Math.pow(Math.abs(CircleBox.getCY() - box.getCY() - box.height / 2), 2)) <= CircleBox.radius)
                      this.callEvent.call(_storeEvents, { type: 'collision.cf', colls: [_child[i], _child[j]] });
                  /*圆以方的左下角*/
                  else if (Math.sqrt(Math.pow(Math.abs(CircleBox.getCX() - box.getCX() + box.width / 2), 2) +
								Math.pow(Math.abs(CircleBox.getCY() - box.getCY() - box.height / 2), 2)) <= CircleBox.radius)
                      _callEvent.call(_storeEvents, { type: 'collision.cf', colls: [_child[i], _child[j]] });
                  /*
                  if(CircleBox.x >= (box.x-box.width/2-CircleBox.radius) &&
                  CircleBox.x <= (box.x+box.width/2+CircleBox.radius) &&
                  CircleBox.y >= (box.y-box.height/2-CircleBox.radius) &&
                  CircleBox.y <= (box.y+box.height/2+CircleBox.radius))
					 
					 
                  _callEvent.call(_storeEvents,{type:'collision.cf',colls:[_child[i],_child[j]]});
                  */
              }
          }
      }
  };
  
  _stage.add = function (obj) {
      obj.index = 0;
      _child.push(obj);
  };
  _stage.remove=function (obj) {
      for (var i = 0; i < _child.length; i++) {
          if (_child[i].id == obj.id)
              _child.splice(i, 1);
      }
  }
  
  _stage.play = function () {
      if (_running)
          return;
      _running = true;
      (function animloop() {
          _run();
          _requestAnimFrame(animloop);
      })();
  }
  _stage.pause = function () {

      if (!_running)
          return;

      _running = false;

  }
  _stage.indexOf = function (spi) {
      if (_child.indexOf)
          return _child.indexOf(spi);
      for (var i = 0; i < _child.length; i++)
          if (_child[i] === spi)
              return i;
      return -1;
  }
  _stage.moveUp = function (spi) {
      var index = this.indexOf(spi);
      _child.splice(index, 1);
      _child.splice(index + 1, 0, spi);
  },
  _stage.moveDown = function (spi) {
      var index = this.indexOf(spi);
      _child.splice(index, 1);
      var previndex = index - 1;
      previndex = previndex < 0 ? 0 : previndex;
      _child.splice(previndex, 0, spi);
  }
  _stage.moveToIndex = function (spi, index) {
        var i = this.indexOf(spi);
        _child.splice(index, 0, spi);
        _child.splice(i, 1);
    },
  _stage.moveTop = function (spi) {
      var i = this.indexOf(spi);
      _child.splice(_child.length, 0, spi);
      _child.splice(i, 1);
  }
  _stage.createSpirit = function(id,x,y,w,h,r){
  	var s = new _spirit(id,x,y,w,h,r);
  	this.add(s);
  	return s;
  }
  _stage.init = function (id) {
      var ele = document.getElementById(id);
      this.width = parseInt(ele.width);
      this.height = parseInt(ele.height);
      _c2d = ele.getContext("2d");
      _c2d.clearRect(0, 0, this.width, this.height);
      _c2d.save();
      _InitSysEvent(ele);
       /******健盘控制器******/
      this.addEvent(function (obj) {

          if (obj.type == "key.down") {

              switch (obj.keyCode) {
                  case 87:
                      _this.controller.up = true;
                      break;
                  case 83:
                      _this.controller.down = true;
                      break;
                  case 65:
                      _this.controller.left = true;
                      break;
                  case 68:
                      _this.controller.right = true;
                      break;
                  case 74:
                      //_this.controller.jump = true;
                      break;
              }
          } else if (obj.type == "key.up") {
              switch (obj.keyCode) {
                  case 87:
                      _this.controller.up = false;
                      break;
                  case 83:
                      _this.controller.down = false;
                      break;
                  case 65:
                      _this.controller.left = false;
                      break;
                  case 68:
                      _this.controller.right = false;
                      break;
                  case 74:
                      _this.callEvent.call(_this._storeEvents, { type: 'action.jump', keyCode: 74 });
                      break;
                  case 75:
                      _this.callEvent.call(_this._storeEvents, { type: 'action.kill', keyCode: 75 });
                      break;
              }
          }
      });
      
  }

    /*系统事件*/
  _stage.addEvent = function (callback) {
      _storeEvents.push(callback);
  }
  _stage.removeEvent =  function (callback) {

      for (var i = 0; i < _storeEvents.length; i++)
          if (_storeEvents[i] == callback)
              _storeEvents.splice(i, 1);
  }
    /*上下左右控制器*/
  _stage.controller = {
      up: false,
      down: false,
      left: false,
      right: false
  }
  _stage.defAttrVal = { x: 10, y: 10, alpha: 0.1, rotate: Math.PI / 180, scaleX: 0.1, scaleY: 0.1 };
  _stage.tipSpirit = function (pos) {
      var leng = _child.length;
      for (var i = leng - 1; i >= 0; i--) {
          if (pos.x >= this._child[i].x &&
			 pos.x <= _child[i].x + _child[i].width &&
			 pos.y >= _child[i].y &&
			 pos.y <= _child[i].y + _child[i].height) {
              return _child[i];
          }
      }
      return null;
  };
  
  
  /*精灵组件*/
  var _spirit = jf.Spirit = function(id,x,y,w,h,r){
  	this.id = id||Math.floor(Math.random()*10000000);
		this.x = x||0; 
		this.y = y||0; 
		this.width= w||0;
		this.height=h||0;
		this.radius = r||0;
		this.rotate = 0;
		this.scaleX = 1;
		this.scaleY= 1;
		this.alpha = 1;
		this.hide = false;
		this.canCollision = false;
		this.loop = -1;
		this.backgroundColor="";
		this.borderWidth =0;
		this.borderColor = "";
		
		this._frames = [];
		this._child = [];
		this._storeEvents = [];
		this._centerX = this.x+this.width/2;
		this._centerY = this.y+this.height/2;
		
		this.frameX = 0;
		this.frameY = 0;
		
		
		this.frameTime=15;
		this._frameTime=0;
		this.index=0;
		this.TextureAtlasLength = 0;
		this.TextureAtlas = null;
		
		this._framesLength = 0;
		this._frameIndex = 0;

		var _this = this;
	
		/*执行*/
		this.addFrame(function(c2d){
			_drawBGBorder.call(_this,c2d);
			_drawTexture.call(_this,c2d);
			
			_this._drawFrame(c2d);
			
			_this._frameTime = (_this._frameTime >= _this.frameTime)?0:_this._frameTime+1;
		});
		
		var _drawBGBorder = function(){
			if(_this.borderWidth > 0 && _this.borderColor && _this.borderColor != ''){
				c2d.save();
				c2d.beginPath();
				c2d.translate(this._centerx, this._centerY);
				c2d.rotate(this.rotate);
				c2d.scale(this.scaleX,this.scaleY);
				c2d.globalAlpha = this.alpha;
				c2d.shadowOffsetX = 0;
				c2d.shadowOffsetY = 0;
				c2d.shadowBlur = 3;
				c2d.shadowColor ='rgba(0,0,0,0.5)';
				c2d.lineWidth = this.borderWidth;
				c2d.strokeStyle = this.borderColor;
				c2d.fillStyle = this.backgroundColor;
				if(this.radius > 0){
				    c2d.arc(this._centerx, this._centerx, this.radius, 0, 2 * Math.PI);
				} else {
				    c2d.rect(-this.width/2, -this.height/2, this.width, this.height);
				}
				c2d.stroke();
				if(this.backgroundColor && this.backgroundColor != '')
					c2d.fill();
				c2d.closePath();
				c2d.restore();
			}
		},
		
		
		/*画Texture*/
		_drawTexture =function(c2d){
			if(this.TextureAtlasLength <= 0)
				return;
			c2d.save();
			c2d.beginPath();
			c2d.translate(this.getCX(), this.getCY());
			c2d.rotate(this.rotate);
			c2d.scale(this.scaleX,this.scaleY);
			c2d.globalAlpha = this.alpha;
			
			if(this.TextureAtlas){
				this.frameX = this.TextureAtlas.SubTexture[this.index].frameX;
				this.frameY = this.TextureAtlas.SubTexture[this.index].frameY;
				c2d.drawImage(this.TextureAtlas.image,
												this.TextureAtlas.SubTexture[this.index].x,
												this.TextureAtlas.SubTexture[this.index].y,
												this.TextureAtlas.SubTexture[this.index].width,
												this.TextureAtlas.SubTexture[this.index].height,
												this.TextureAtlas.SubTexture[this.index].frameX - this.width/2,
												this.TextureAtlas.SubTexture[this.index].frameY - this.height/2,
												this.TextureAtlas.SubTexture[this.index].frameWidth,
												this.TextureAtlas.SubTexture[this.index].frameHeight);
												
			}
			c2d.closePath();
			c2d.restore();
			
			if(!this.loop){
				return;
			}
			if(this.index == 0 && this._frameTime == 0)
				JF.stage.callEvent.call(this._storeEvents,{type:'run.start',curObj:this});
			
			if(this.index == (this.TextureAtlasLength -1) && this._frameTime == this.frameTime)
				JF.stage.callEvent.call(this._storeEvents,{type:'run.end',curObj:this});
			
			if(this._frameTime == 0)
				JF.stage.callEvent.call(this._storeEvents,{type:'run.each',curObj:this});
				
				
			if(this._frameTime == this.frameTime){
				this.index ++;
				if(this.index >= this.TextureAtlasLength){
					this.loop--;
					this.index = this.loop?0:this.TextureAtlasLength-1;
				}
			}
		},
  };
  
  _spirit.prototype = {
  	
		
		/*画frame
		_drawFrame:function(c2d){
			if(this._framesLength <= 0)
				return;
			c2d.save();
			c2d.beginPath();
			c2d.translate(this.x,this.y);
			c2d.rotate(this.rotate);
			c2d.scale(this.scaleX,this.scaleY);
			c2d.globalAlpha = this.alpha;
			
			this._frames[this._frameIndex](c2d);
			
			c2d.closePath();
			c2d.restore();
		
			if(this._frameIndex == 0 && this._frameTime == 0)
				JF.stage.callEvent.call(this._storeEvents,{type:'run.frame.start',curObj:this});
			
			if(this._frameIndex == (this._framesLength -1) && this._frameTime == this.frameTime)
				JF.stage.callEvent.call(this._storeEvents,{type:'run.frame.end',curObj:this});
			
			if(this._frameTime == 0)
				JF.stage.callEvent.call(this._storeEvents,{type:'run.frame.each',curObj:this});
				
			if(this._frameTime == this.frameTime){
				this._frameIndex++;
				if(this._frameIndex >= this._framesLength){
					this._frameIndex = this.loop?0:this._framesLength-1;
					
				}
			}
		},
		*/
		/*画孩子
		_drwawChild:function(c2d){
			var len = this._child.length;
			if(len <= 0)
				return;
			c2d.save();
			c2d.beginPath();
			c2d.translate(this.x,this.y);
			c2d.rotate(this.rotate);
			c2d.scale(this.scaleX,this.scaleY);
			c2d.globalAlpha = this.alpha;
			for(var i = 0;i < len;i++){
				if(this._child[i].hide)
					continue;
				if(this._child[i])	
					JF.stage.callRuns.call(this._child[i]._storeRuns,c2d);
				//var l = this._child[i]._storeRuns.length;
				//for(var j = 0;j < l;j++)
				//	this._child[i]._storeRuns[j](JF.stage.c2d);
			}
			c2d.closePath();
			c2d.restore();
		},
		*/
		get centerX(){
			return this._centerx;
		},
		set centerX(val){
			this._centerx = val;
		},
		get centerY(){
			return this._centery;
		},
		set centerY(val){
			this._centery = val;
		},
		add:function(spi){
			obj.index = 0;
			this._child.push(spi);
		},
		remove:function(spi){
			for(var i = 0;i < this._child.length;i++){
				if(this._child[i].id == spi.id)
					this._child.splice(i,1);
			}
		},
		addFrame:function(callback){
			if(typeof(callback) == 'function'){
				this._frames.push(callback);
				this._framesLength++;
			}
		},
		removeFrame:function(callback){
			for(var i = 0;i < this._frames.length;i++){
				if(this._frames[i] == callback){
					this._frames.splice(i,1);
					this._framesLength--;
				}
			}
		},
		setTexture:function(textureobj){
			textureobj.image = new Image();
			textureobj.image.src = textureobj.imagePath;
			this.TextureAtlas = textureobj;
			this.TextureAtlasLength = this.TextureAtlas.SubTexture.length;
			for(var i = 0;i < this.TextureAtlasLength;i++){
				if(this.TextureAtlas.SubTexture[i].frameX == undefined)
					this.TextureAtlas.SubTexture[i].frameX = 0;
				if(this.TextureAtlas.SubTexture[i].frameY == undefined)
					this.TextureAtlas.SubTexture[i].frameY = 0;
				if(this.TextureAtlas.SubTexture[i].frameWidth == undefined)
					this.TextureAtlas.SubTexture[i].frameWidth = this.TextureAtlas.SubTexture[i].width;
				if(this.TextureAtlas.SubTexture[i].frameHeight == undefined)
					this.TextureAtlas.SubTexture[i].frameHeight = this.TextureAtlas.SubTexture[i].height;
			}
			if(this.TextureAtlasLength > 0){
				this.width = this.width?this.width:this.TextureAtlas.SubTexture[0].frameWidth;
				this.height = this.height?this.height:this.TextureAtlas.SubTexture[0].frameHeight;
			}
		},
		getSubTexture:function(index){
				return this.TextureAtlas && this.TextureAtlas.SubTexture[index]?this.TextureAtlas.SubTexture[index]:null;
		},
		animates:function(obj,time,callback){
			
			for(var i in obj)
				this.animate(i,obj[i],time,callback);
		},
		animate:function(atr,value,time,callback){
	
			
			var length = 10;
			
			var step = value >= this[atr]?JF.stage.defAttrVal[atr]:-JF.stage.defAttrVal[atr];
	
			if(time){
				length = time/(JF.stage.rtime*2);
				step = (value - this[atr])/length;
			}
			
			if(step == 0)
				return;
			var _this = this;
			var _changatr = function(){
				_this[atr] +=step;
				if(step > 0){
					if(_this[atr] >=  value){
						_this[atr] = value;
						_this.unrun(_changatr);
						
						if(typeof(callback) == 'function')
							callback(atr);
						return;
					}
				}
				else{
					if(_this[atr] <=  value){
						_this[atr] = value;
						_this.unrun(_changatr);
						if(typeof(callback) == 'function')
							callback();
						return;
					}
				}
			};
			this.run(_changatr);
			return _changatr;
		},
		topLate:function(index){
			var len = this._child.length;
			for(var i = 0;i < len;i++){
				this._child[i].hide = (i==index?true:false);
			}
		},
		indexOf:function(spi){
			if(this._child.indexOf)
				return this._child.indexOf(spi);
			for(var i =0;i < this._child.length;i++)
				if(this._child[i] === spi)
					return i;
			return -1;
		},
		unanimate:function(animfun){
			this.unrun(animfun);
		},
		setBGBorder:function(borderWidth,borderColor,backgroundColor){
			this.backgroundColor = backgroundColor;
			this.borderWidth = borderWidth;
			this.borderColor = borderColor;
		},
		addEvent:function(callback){
			this._storeEvents.push(callback);
		},
		removeEvent:function(callback){
			
			for(var i = 0; i < this._storeEvents.length;i++)
				if(this._storeEvents[i] == callback)
					this._storeEvents.splice(i,1);
				
		}
  }   = _spirit;
  
  /*声音组件*/
  var _sound = jf.Sound = function(soundUrl){
  	this.audio = document.createElement('audio');
		document.body.appendChild(this.audio);
		this.audio.src = soundUrl;
	}
	_sound.prototype = {
		play:function(loop){
			if(loop)
				this.audio.loop = true;
			else
				this.audio.loop = false;
			this.audio.play();
		},
		pause:function(){
			this.audio.pause();
		},
		load:function(){
			this.audio.load();
		},
		canPlayType:function(){
			return this.audio.canPlayType();
		},
		getAudio:function(){
			return this.audio;
		}
	}

  
})(JF);
