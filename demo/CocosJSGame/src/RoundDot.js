var RoundDot = cc.Sprite.extend({
	roundLength:20,
	runTime:0,
	ctor:function(){
		this._super();
		var size = cc.winSize;
		var radius = size.width/2;
		
		var minradous = size.width/2 * (Math.PI * 2 / this.roundLength / 2 / 2) * 2 - 2;
		var dot;
		for(var i = 0;i < this.roundLength;i++){
			x = radius/2 * Math.sin(Math.PI * 2 / this.roundLength * i );
			y = radius/2 * Math.sin(Math.PI/2 - Math.PI * 2 / this.roundLength * i );
			dot = new cc.Sprite();
			dot.x = x;
			dot.y = y;
			this.addChild(dot);
		}
		//this.scale = 0.001;
		this.runTime = setInterval(this.turnBig,13);
	},
	unuse:function(){
		var list = this.getChildren();
		for(var i = 0;i < list.length;i++){
			list[i].unuse();
			this.removeChild(list[i], true);
		}
		clearInterval(this.runTime);
			
	},
	turnBig:function(){
		this.scale += 0.001;
		this.rotation += 1;
		//if(this.scale >= 1.2)
		//	this.unuse();
		//this.getParent().removeChild(this);
	}
});

var Dot = cc.Sprite.extend({
	drawCenterDot:null,
	drawLine:null,
	chnTime:0,
	turnRnTime:0,
	changeColor:false,
	rColor:null,
	wColor:null,
	ctor:function(){
		this._super();
		
		this.drawLine = new cc.DrawNode();
		this.drawLine.drawCircle(cc.p(0,0), 30, cc.degreesToRadians(90), 50, false, 2, cc.color(218,26,26,200));
		this.drawLine.drawDot(cc.p(0,0),29,cc.color(0,0,0,125));
		this.drawLine.drawDot(cc.p(16,16),6,cc.color(218,26,26,200));
		this.drawCenterDot = new cc.DrawNode();
		this.rColor = new cc.Color(218,26,26,200);
		this.wrColor = new new cc.Color(255,255,255,200);
	
		this.drawCenterDot(rColor);
		this.chnTime = setInterval(this.drawCenterDot,300);
		this.turnRnTime = setInterval(this.turnRound,13);
		this.addChild(this.drawLine);
		this.addChild(this.drawCenterDot);
	},
	drawCenterDot:function(){
		this.drawCenterDot.clear();
		this.drawCenterDot.drawDot(cc.p(0,0),10,this.changeColor?this.rColor:this.wColor);
		this.changeColor = false;
	},
	turnRound:function(){
		this.rotation +=1;
		if(this.rotation >= 360)
			this.rotation = 0;
	},
	unuse:function(){
		clearInterval(this.chnTime);
		clearInterval(this.turnRnTime);
		delete this.drawCenterDot;
		delete this.drawLine;
	}
});