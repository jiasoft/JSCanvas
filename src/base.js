export const base = {};
base.Stage = {width:800,height:700};
base.c2d = null;
export let 	requestAnimFrame = (function(){
	  return  window.requestAnimationFrame   ||
			  window.webkitRequestAnimationFrame ||
			  window.mozRequestAnimationFrame    ||
			  function( callback ){
					window.setTimeout(callback, 1000 / 60);
			  };
	})()
function offset(elem){
    var box = elem.getBoundingClientRect();
    var docElem = document.documentElement;
    return{
        top: box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
                left: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
        };
        
}
base.child = [];
base.running = false;
base.storeEvents = [];
  //_defJumpAttrVal = { x: 10, y: 10, alpha: 0.1, rotate: Math.PI / 180, scaleX: 0.1, scaleY: 0.1 },
export function callFrames(c2d) {
  	
  	var len = this.length;
  	if(!this[0].call)
  		console.log(this[0]);
    for (var i = 0; this[i] && i < len; i++)
        this[i].call(null,c2d);
  }
export function callEvent (spi) {
      if (this instanceof Array) {
      	var len = this.length;
      	
	      for (var i = 0; i < len; i++) {
	          this[i].call(base.Stage,spi);
	      }
      }
  }
  /*鼠标事件*/
export function InitSysEvent(ele) {
      var box = {top:0,left:0}
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
  export function runFrame() {
      if (!base.running)
          return;
      base.c2d.clearRect(0, 0, base.Stage.width, base.Stage.height);
			var len = base.child.length
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
  /*异步传输json strData的数据如：name=value&name1=value1&name2=value2*/
export  function loadJson(method, url, strData, f, async) {
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