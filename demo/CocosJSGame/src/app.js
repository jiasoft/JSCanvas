const roundLength = 20;
var BaseLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {

        this._super();

        var size = cc.winSize;
        this.sprite = new cc.Sprite();
        
        //this.createBox();
        this.sprite.addChild(new RoundDot());
        
        this.sprite.x = size.width/2;
        this.sprite.y = size.height/2;
        
        this.addChild(this.sprite);
        return true;
    },
    createBox:function(callback){
    	
	        var box = this.createRoundDot();
	        box.x = 0,box.y = 0;
	        this.sprite.addChild(box);
	        box.scale = 0.01;
	        box.rotation = 360;
	        var _this = this;
	        var scaLength = 0;
	        (function toScale(){
	        	box.scale += 0.001
	        	box.rotation -= 1;
	        	scaLength++;
	        	
	        	if(scaLength == 150){
		        	setTimeout(function(){
		        		_this.createBox();
		        	},30);
		        	
		        }
		  
				if(box.rotation <= 0)
					box.rotation = 360;
					
				if(box.scale < 1)
		        	setTimeout(toScale,30);
		        else
		        	_this.sprite.removeChild(box,true);
	        })();
    },
    createDot:function(i,radius,roundLength){
    	
			var sprite = new cc.Sprite();
			x = radius/2 * Math.sin(Math.PI * 2 / roundLength * i );
			y = radius/2 * Math.sin(Math.PI/2 - Math.PI * 2 / roundLength * i );
				
			sprite.x = x;
			sprite.y = y;
		
			var draw =new cc.DrawNode();
			var c = true,r = new cc.Color(218,26,26,200),w = new cc.Color(255,255,255,200);
			
			!function changecolor(){
				draw.clear();
				draw.drawDot(cc.p(0,0),10,c?r:w);
				c = !c;
				setTimeout(changecolor,300);
			}();
			
			sprite.addChild(draw,0,1);
		
			var round = new cc.DrawNode();
			round.drawCircle(cc.p(0,0), 30, cc.degreesToRadians(90), 50, false, 2, cc.color(218,26,26,200));
			sprite.addChild(round,0,2);
		
			var res = new cc.DrawNode();
			res.drawDot(cc.p(16,16), 6, new cc.Color(218,26,26,200));
			sprite.addChild(res,0,3);
			
			
			!function rotate(){
				sprite.rotation += 1;
				if(sprite.rotation >= 360)
					sprite.rotation = 0;
				setTimeout(rotate,30);
			}();
			
			
			return sprite;
    },
    createRoundDot:function(){
    	var size = cc.winSize;
			var raius = size.width/2;
			var box = new cc.Sprite();
			var minradous = size.width/2 * (Math.PI * 2 / roundLength / 2 / 2) * 2 - 2;
			for(var i = 0;i < roundLength;i++){	
				box.addChild(this.createDot(i,raius,roundLength));
			}
			return box;
    }
});

var FireBoxScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new BaseLayer();
        this.addChild(layer);
    }
});

