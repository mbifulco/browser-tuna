import { useEffect, useRef, useState } from 'react';
import MicrophoneManager from '../../lib/MicrophoneManager';

import { analyzeFrequencyData } from '../../lib/NoteAnalysis';

import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react';

const FFT_SIZE = Math.pow(2, 11);

const Tuner = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState();

  // store the last heard note in state
  const [lastHeardNote, setLastHeardNote] = useState();

  const canvasRef = useRef();
  const frequencyDataRef = useRef();
  // const timeDomainDataRef = useRef();

  // store microphone manager in state
  const [microphoneManager, setMicrophoneManager] = useState(
    () => new MicrophoneManager(FFT_SIZE),
  );

  const width = 1500;
  const height = 350;

  const draw = (ctx) => {
    const canvasW = canvasRef.current.width;
    const canvasH = canvasRef.current.height;

    ctx.clearRect(0, 0, canvasW, canvasH);

    ctx.fillStyle = 'rgba(0,0,0,0.0)';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();

    let x = 0;

    const { frequencyIndex, note, frequency } = analyzeFrequencyData(
      frequencyDataRef.current,
      FFT_SIZE,
      microphoneManager.audioContext.sampleRate,
    );

    if (note.name) {
      setLastHeardNote({
        ...note,
        frequency,
      });
    }

    const highPassThreshold = 1200; // in hz, the highest frequency we want to display

    // this is effectively used for a lowpass filter on the data we get back from the FFT
    // we're calculating the bucket index for the highest frequency data we care about
    // based on the given instrument.

    /* 
      for GUITAR: 
        - max 1200 hz
        - source: http://recordingology.com/in-the-studio/guitars/#:~:text=The%20fundamental%20frequencies%20in%20the,1200%20Hz%20(Figure%203.8).
    */
    const maxFrequencyBucket =
      Math.round(
        highPassThreshold /
          (microphoneManager.audioContext.sampleRate / 2 / FFT_SIZE),
      ) + 1;

    const barWidth = (canvasW * 1.0) / maxFrequencyBucket;

    for (let i = 0; i < maxFrequencyBucket; i++) {
      const barHeight = frequencyDataRef.current[i] * canvasH;
      ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50 ,125)'; // fillStyle =  '#ee60ac';

      if (i === frequencyIndex) {
        ctx.fillStyle = '#00ff00';
        ctx.shadowBlur = 10;
      }
      ctx.fillRect(x, canvasH - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth;
    }
  };

  const monitorMicrophone = () => {
    if (microphoneManager.initialized) {
      frequencyDataRef.current = microphoneManager.getFrequencyData();
      // timeDomainDataRef.current = microphoneManager.getTimeDomainData();

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (frequencyDataRef.current || timeDomainDataRef.current) {
        draw(context);
      }
    }
    requestAnimationFrame(monitorMicrophone);
  };

  useEffect(() => {
    // set up and start listening
    monitorMicrophone();
  }, []);

  return (
    <Stack>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
        The last note I heard was... {lastHeardNote && lastHeardNote.name}:{' '}
        {lastHeardNote && Math.round(lastHeardNote.frequency)}
      </h1>
      <canvas ref={canvasRef} width={width} height={height} />
      {/* {frequencyData} */}

      {/* {audioInputManager.devices?.length && (
        <Stack>
          <h1>Listening? {audioInputManager.isListening ? 'Yes' : 'No'}</h1>
          <RadioGroup
            name="audio-interface-selection"
            onChange={setSelectedDeviceId}
            value={selectedDeviceId}
          >
            <Stack>
              {audioInputManager.devices.map((device) => {
                return (
                  <Radio
                    value={device.deviceId}
                    key={`${device.kind}-${device.groupId}-${device.deviceId}`}
                  >
                    {device.label}
                  </Radio>
                );
              })}
            </Stack>
          </RadioGroup>

          <Button
            onClick={() => {
              audioInputManager?.listenToDevice(selectedDeviceId);
            }}
          >
            Start
          </Button>
        </Stack>
      )} */}
    </Stack>
  );
};

export default Tuner;
