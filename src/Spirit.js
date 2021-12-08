"use strict"
import {callFrames,callEvent} from "./base.js"

export  function Spirit(cx,cy,w,h,r){
    
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
        }catch(e){console.log(e)}
        c2d.closePath();
        c2d.restore();
        
        if(_textureFrameIndex == 0 && _tmpTextureFrameRate == 0)
            callEvent.call(_storeEvents,{type:'drawtexture.start',spirit:this});
        
        if(_textureFrameIndex == (_textureFramesLength -1) && _textureFrameRate == _tmpTextureFrameRate)
            callEvent.call(_storeEvents,{type:'drawtexture.end',spirit:this});
        
        if(_textureFrameRate == 0)
            callEvent.call(_storeEvents,{type:'drawtexture.each',spirit:this});
            
            
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
    Object.defineProperty(this,"centerX",{get:function(){return _centerX;},set:function(v){_centerX = v}});
    Object.defineProperty(this,"centerY",{get:function(){return _centerY;},set:function(v){_centerY = v}});
    Object.defineProperty(this,"x",{
        get:function(){return _centerX - _this.width/2},
        set:function(v){_centerX = _this.width/2 + v}
    });
    Object.defineProperty(this,"y",{
        get:function(){return _centerY - _this.height/2},
        set:function(v){_centerY  =  _this.height/2 + v}
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
            clen ++
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
}