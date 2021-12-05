const AUDIO_INPUT_DEVICE_KIND = 'audioinput';

class AudioInputManager {
  devices = undefined;
  frequencyAnalyzer = undefined;
  audioSourceNode = undefined;

  isListening = false;

  async init() {
    await this.getDevices();
  }

  async getDevices() {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.enumerateDevices
    ) {
      console.error('enumerateDevices() not supported.');
      return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    this.devices = devices.filter((d) => d.kind === AUDIO_INPUT_DEVICE_KIND);
  }

  async listenToDevice(deviceId) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#parameters
    const context = new AudioContext();
    console.log('attempting to listen to', deviceId);

    try {
      this.audioSourceNode = new MediaStreamAudioSourceNode(context, {
        mediaStream: await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: deviceId,
          },
        }),
      });

      console.log('analyzer creation');
      this.frequencyAnalyzer = new AnalyserNode(context);
      this.frequencyAnalyzer.fftSize = 2048;

      console.log('connecting');
      this.audioSourceNode.connect(this.frequencyAnalyzer);
      this.isListening = true;

      console.log('listening');
      /* use the stream */
    } catch (err) {
      /* handle the error */
      console.error(err);
    }
  }
}

export default AudioInputManager;
