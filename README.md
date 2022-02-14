# JSCanas 是用Canvas实现的一个简单的游戏类库

用rollup打包

demo:
	

	JF.Stage.init("democavs");
	
	var fs = JF.Stage.createSpirit(200,300,40,40);
	fs.setTextureJson(texturefs);
	fs.textureFrameCount = 20;
	fs.animates({x:400},100);
	var turnSpri = JF.Stage.createSpirit(120,30,40,40,35);
	turnSpri.setTextureJson(turn);
	turnSpri.textureFrameCount = 5;
	
	var baoSpri = JF.Stage.createSpirit(200,30,40,40,35);
	baoSpri.setTextureJson(bao);
	baoSpri.textureFrameCount = 10;
	
	var firPri = JF.Stage.createSpirit(250,36,40,40,35);
	firPri.setTextureJson(fir);
	firPri.textureFrameCount = 18;
	
	var fir_open_spri = JF.Stage.createSpirit(280,37,40,40,35);
	fir_open_spri.setTextureJson(fir_open);
	fir_open_spri.textureFrameCount = 20;
	
	for(var i = 0;i < 160;i++){
		turnSpri = JF.Stage.createSpirit(Math.random()*600,Math.random()*150+100,60,60,true);

		turnSpri.setTextureJson(turn);
		turnSpri.textureFrameCount = 8;
		turnSpri.scaleX = 1;
		turnSpri.scaleY = 1;
	}
		
	
	JF.Stage.play();

