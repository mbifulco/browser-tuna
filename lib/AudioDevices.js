const AUDIO_INPUT_DEVICE_KIND = 'audioinput';

class AudioDevices {
  devices = undefined;
  frequencyAnalyzer = undefined;

  constructor() {
    this.context = new AudioContext();
  }

  async getDevices() {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.enumerateDevices
    ) {
      console.log('enumerateDevices() not supported.');
      return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
    this.devices = devices.filter((d) => d.kind === AUDIO_INPUT_DEVICE_KIND);
  }

  async init() {
    await this.getDevices();
  }

  async listenToDevice(deviceId) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#parameters
    const constraints = { audio: true };

    try {
      let audioSourceNode = new MediaStreamAudioSourceNode(context, {
        mediaStream: navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: deviceId, // if provided, this will select a device by its id. Otherwise we get the default device
          },
        }),
      });

      this.frequencyAnalyzer = new AnalyserNode(
        this.context,
      ).getFloatFrequencyData();
      this.frequencyAnalyzer.fftSize = 2048;

      audioSourceNode.connect(this.analyzer);
      /* use the stream */
    } catch (err) {
      /* handle the error */
    }
  }
}

export default AudioDevices;
