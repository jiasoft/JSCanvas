
export class Sound {
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
        console.log("sound init.")
    }
}