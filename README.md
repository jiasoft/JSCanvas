# JSCanas 是用Canvas实现的一个简单的游戏类库

用Rollor打包

demo:

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>demo 01</title>
<meta name="Keywords" content="canvas demo" />
<meta name="Description" content="canvas demo" />
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
<style>
body{padding:0px;margin:0px;}
</style>
</head>
<body>
	<div style="width:1000px;margin:auto;">
	<canvas width="800" height="400" id="democavs" _style="position:fixed;top:20px;left:20px;"></canvas>
	</div>
	<div id="msg"></div>
	<script type="text/javascript" src="../dist/jf.js"></script>
	<script type="text/javascript" src="res/bao.json"></script>
	<script type="text/javascript" src="res/fir.json"></script>
	<script type="text/javascript" src="res/fir_open.json"></script>
	<script type="text/javascript" src="res/texturefs.json"></script>
	<script type="text/javascript" src="res/turn.json"></script>
	<script>
		

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


	</script>
</body>
</html>
