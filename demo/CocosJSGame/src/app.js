
var FireLayer = cc.Layer.extend({
    sprite:null,
    draw:null,
    ctor:function () {
       	
        this._super();
        this.sprite = new cc.Sprite();
        
        
        this.sprite.addChild(createDot());
        this.addChild(this.sprite);
        return true;
    }
});

var FireBoxScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new FireLayer();
        this.addChild(layer);
    }
});

function createDot(){
	
	var size = cc.winSize;
	var box = new cc.Sprite();
	box.x = 0,box.y = 0;
	var sprite = new cc.Sprite();

	sprite.x = 100;
	sprite.y = 100;

	var draw =new cc.DrawNode();
	var c = true,r = new cc.Color(218,26,26,200),w = new cc.Color(255,255,255,200);
	!function changecolor(){
		draw.clear();
		draw.drawDot(cc.p(0,0),10,c?r:w);
		c = !c;
		setTimeout(changecolor,200);
	}();

	sprite.addChild(draw,0,1);

	var round = new cc.DrawNode();
	round.drawCircle(cc.p(0,0), 30, cc.degreesToRadians(90), 50, false, 2, cc.color(218,26,26,200));
	sprite.addChild(round,0,2);

	var res = new cc.DrawNode();
	res.drawDot(cc.p(16,16), 6, new cc.Color(218,26,26,200));
	sprite.addChild(res,0,3);

	//sprite.runAction(new cc.RotateTo(3,-180));
	!function rotate(){
		sprite.rotation += 1;
		setTimeout(rotate,50);
	}();
	box.addChild(sprite, localZOrder, tag)
	return sprite;
}
