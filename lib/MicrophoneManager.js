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

        // the higher this value is set, the longer frequencies will linger in the data returned
        // range is 0-1, default is 0.8
        this.analyzer.smoothingTimeConstant = 0.91;

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
    return [...this.dataArray].map((v) => v / 128);
  }

  getTimeDomainData() {
    if (!this.initialized) return;
    this.analyzer.getByteTimeDomainData(this.dataArray);
    return [...this.dataArray].map((v) => v / 128);
  }
}

export default MicrophoneManager;
