class MicrophoneManager {
  constructor(fftSize = 1024) {
    this.initialized = false;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.audioContext = new AudioContext();
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.analyzer = this.audioContext.createAnalyser();
        this.analyzer.fftSize = fftSize;

        const bufferLength = this.analyzer.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        this.microphone.connect(this.analyzer);

        this.initialized = true;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getFrequencyData() {
    if (!this.initialized) return;
    this.analyzer.getByteFrequencyData(this.dataArray);
    return [...this.dataArray];
  }

  getTimeDomainData() {
    if (!this.initialized) return;
    this.analyzer.getByteTimeDomainData(this.dataArray);
    return [...this.dataArray].map((v) => v / 128);
  }
}

export default MicrophoneManager;
