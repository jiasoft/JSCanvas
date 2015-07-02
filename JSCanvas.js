/* 用 texturepacker 生成下面的json
_textureAtlas=	
{"frames": [

{
	"filename": "bao_01.png",
	"frame": {"x":191,"y":2,"w":50,"h":73},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":50,"h":73},
	"sourceSize": {"w":50,"h":73}
},
{
	"filename": "bao_02.png",
	"frame": {"x":66,"y":184,"w":51,"h":70},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":51,"h":70},
	"sourceSize": {"w":51,"h":70}
}],
"meta": {
	"app": "http://www.texturepacker.com",
	"version": "1.0",
	"image": "texture.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":256},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:1e608a9fb785c2b5f181a834f3aec80e$"
}
}
*/


var JF = JF||{version:1.0,creater:"邱土佳 |18665378372|jiasoft@163.com",name:'Canvas game lib',newDate:'20140529',updateDate:'20150624'};

(function (jf){
	
	/****舞台*****/
	var 
	_stage = jf.stage = {width:800,height:700},
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
	_child = [],
  _running = false,
  _storeEvents = [],
  //_defJumpAttrVal = { x: 10, y: 10, alpha: 0.1, rotate: Math.PI / 180, scaleX: 0.1, scaleY: 0.1 },
  _callFrames = function (c2d) {
  	
  	var len = this.length;
  	if(!this[0].call)
  		console.log(this[0]);
    for (var i = 0; this[i] && i < len; i++)
        this[i].call(null,c2d);
  },
  _callEvent = function (obj) {
      if (this instanceof Array) {
      	var len = this.length;
	      for (var i = 0; i < len; i++) {
	          this[i].call(null,obj);
	      }
      }
  },
  /*鼠标事件*/
  _InitSysEvent = function (ele) {
      var box = {top:0,left:0}
      if (!ele.addEventListener)
          return;
      ele.addEventListener('mousedown', function (e) {

          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _spi = _stage.tipSpirit(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.down', pos: _pos, spirit: _spi });
      }, false);
      ele.addEventListener('mousemove', function (e) {
          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _spi = _stage.tipSpirit(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.move', pos: _pos, spirit: _spi });
      }, false);
      ele.addEventListener('mouseup', function (e) {
          var box = _offset(e.target);
          var _pos = { x: e.pageX - box.left, y: e.pageY - box.top };
          var _spi = _stage.tipSpirit(_pos);
          _callEvent.call(_storeEvents, { type: 'mouse.up', pos: _pos, spirit: _spi });
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
          var len = _touches.length;
          for (var i = 0; i < len; i++) {
              box = _offset(_touches[i].target);
              poslist[i] = {
                  x: _touches[i].pageX - box.left,
                  y: _touches[i].pageY - box.top,
                  ide: _touches[i].identifier
              };
          }

          var _spi = _stage.tipSpirit(poslist[0]);

          _callEvent.call(_storeEvents, { type: _type, touchPosList: poslist, spirit: _spi });
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
      _c2d.clearRect(0, 0, _stage.width, _stage.height);
			var len = _child.length
      for (var i = 0; i < len && _child[i]; i++) {
          if (_child[i].hide)
              continue;
              
          if (_child[i])
              _child[i].callOwnFrame(_c2d);
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
      
  },
  /*异步传输json strData的数据如：name=value&name1=value1&name2=value2*/
	_loadJson = function(method, url, strData, f, async) {
	    if (typeof (async) == "undefined") async = true;
	    var xr;
	     try {
        xr = new XMLHttpRequest();
      } 
      catch (e) {
        var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP");
        var len = XmlHttpVersions.length;
        for (var i = 0; i < len && !xmlHttp; i++) {
          try {
            xr = new ActiveXObject(XmlHttpVersions[i]);
          } 
          catch (e) {
          	console.log(e);
          }
        }
      }
	    xr.onreadystatechange = function () {
	        if (this.readyState == 4) {
	            if (this.status == 200 && this.responseText != "") {
	                if (typeof (f) === 'function')
	                    f(JSON.parse(this.responseText));
	            } else {
	                if (typeof (f) === 'function')
	                    f(null);
	            }
	        }
	    }
	    xr.open(method, url, async);
	    if (method.toLowerCase() == 'post')
	        xr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    xr.send(strData);
	};
  _stage.add = function (obj) {
      obj.index = 0;
      _child.push(obj);
  };
  _stage.remove=function (spi) {
  	var len = _child.length
      for (var i = 0; i < len; i++) {
      		
          if (spi == _child[i] || _child[i].id == spi.id){
              _child.splice(i, 1);
          	return true;
          }

      }
      return false;
  }
  
  _stage.play = function () {
      if (_running)
          return;
      _running = true;
      var fps = 0;
      var msg = document.createElement('span');
      msg.setAttribute('style','position:fixed;top:0px;left:0px;background:#fff;padding:0px 5px');
      document.body.appendChild(msg);
      (function animloop() {
          _run();
          fps++;
          _requestAnimFrame(animloop);
      })();
      setInterval(function(){
      	msg.innerHTML ="fps:"+fps;
      	fps = 0;
      },1000);
  }
  _stage.pause = function () {

      if (!_running)
          return;

      _running = false;

  }
  _stage.indexOf = function (spi) {
      if (_child.indexOf)
          return _child.indexOf(spi);
      var len = _child.length;
      for (var i = 0; i < len; i++)
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
  _stage.createSpirit = function(x,y,w,h,r){
  	var s = new _spirit(x,y,w,h,r);
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
      this.on(function (obj) {

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
                      _this.callEvent.call(_storeEvents, { type: 'action.jump', keyCode: 74 });
                      break;
                  case 75:
                      _this.callEvent.call(_storeEvents, { type: 'action.kill', keyCode: 75 });
                      break;
              }
          }
      });
      
  }

    /*系统事件*/
  _stage.on = function (callback) {
      _storeEvents.push(callback);
  }
  _stage.unOn =  function (callback) {
			var len = _storeEvents.length
      for (var i = 0; i < len; i++)
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

  _stage.tipSpirit = function (pos) {
      var len = _child.length;
      for (var i = len - 1; i >= 0; i--) {
          if (pos.x >= _child[i].x &&
					 pos.x <= _child[i].x + _child[i].width &&
					 pos.y >= _child[i].y &&
					 pos.y <= _child[i].y + _child[i].height) {
		              return _child[i];
          }
      }
      return null;
  };
  Object.defineProperty(_stage, "child", { get: function () { return _child; } });
 
  /*精灵组件*/
  var _spirit = jf.Spirit = function(cx,cy,w,h,r){

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
		_radus = 0,
		
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
			    c2d.stroke();
				} else {
				    c2d.rect(-this.width/2, -this.height/2, this.width, this.height);
				    c2d.stroke();
				}
				
			
				
				if(this.backgroundColor && this.backgroundColor != '')
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
			}catch(e){console.log(e)}
			c2d.closePath();
			c2d.restore();
			
			if(_textureFrameIndex == 0 && _tmpTextureFrameRate == 0)
				_callEvent.call(_storeEvents,{type:'drawtexture.start',spirit:this});
			
			if(_textureFrameIndex == (_textureFramesLength -1) && _textureFrameRate == _tmpTextureFrameRate)
				_callEvent.call(_storeEvents,{type:'drawtexture.end',spirit:this});
			
			if(_textureFrameRate == 0)
				_callEvent.call(_storeEvents,{type:'drawtexture.each',spirit:this});
				
				
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
			
			if(_movies.length <= 0)
				return;
			c2d.save();
			c2d.beginPath();
			
			_movies[_movieIndex].draw.call(_this,c2d);
			c2d.closePath();
			c2d.restore();
			
			
			/*换帧*/
			_movieFrameIndex++;
			if(_movieFrameIndex >= _movies[_movieIndex].frameRate){
				_movieFrameIndex = 0;
				if(_this.loop)
					_movieIndex = _movieIndex < _movies.length-1 ? _movieIndex+1:0;
				else
					_movieIndex = _movieIndex < _movies.length-1 ? _movieIndex+1:_movies.length - 1;
			}
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
		Object.defineProperty(this,"centerX",{get:function(){return _centerX;},set:function(v){_centerX = v}});
		Object.defineProperty(this,"centerY",{get:function(){return _centerY;},set:function(v){_centerY = v}});
		Object.defineProperty(this,"x",{get:function(){return _centerX - _this.width/2}});
		Object.defineProperty(this,"y",{get:function(){return _centerY - _this.height/2}});
		Object.defineProperty(this,"frames",{get:function(){return _frames}});
		Object.defineProperty(this,"child",{get:function(){return _child}});
		Object.defineProperty(this,"radius",{get:function(){return _this.width/2 }});
		
		
		/*执行*/
		this.addFrame(function(c2d){
			_initSpirit.call(_this,c2d);
			_drawTexture.call(_this,c2d);
			_drawMovie.call(_this,c2d);
		});
  };
  _spirit.prototype = {
		animates:function(obj,frameRate,callback){
			
			for(var i in obj)
				this.animate(i,obj[i],frameRate,callback);
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
			_callFrames.call(this.frames,c2d);
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
  }
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
