export class Music {
    audioElement = document.getElementById('background-music');
    trackList = [
        './music/Pixel Wizard Fight1.mp3',
        './music/Pixel Wizard Fight2.mp3',
        './music/Pixel Wizard Fight3.mp3'
    ];
    currentTrack = 0;
    constructor() {
        this.audioElement.src = this.trackList[this.currentTrack];
        this.audioElement.play();

        this.audioElement.addEventListener('ended', () => {
            this.currentTrack = (this.currentTrack + 1) % this.trackList.length;
            this.audioElement.src = this.trackList[this.currentTrack];
            this.audioElement.play();

        });
        document.getElementById('clickable-area').addEventListener('click', () => {
            document.getElementById('clickable-area').style.display = 'none';
            if (this.audioElement.paused) {
                this.audioElement.play();
            }
        });

    }
}
