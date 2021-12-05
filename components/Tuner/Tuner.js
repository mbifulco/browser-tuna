import { useEffect, useRef, useState } from 'react';
import AudioInputManager from '../../lib/AudioInputManager';
import MicrophoneManager from '../../lib/MicrophoneManager';

import { analyzeFrequencyData } from '../../lib/NoteAnalysis';

import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react';

const FFT_SIZE = 2048;

const Tuner = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState();

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
    const sampleCount = microphoneManager.analyzer.frequencyBinCount;

    const canvasW = canvasRef.current.width;
    const canvasH = canvasRef.current.height;

    const barWidth = (canvasW * 1.0) / sampleCount;

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
    );

    console.log('note', note, frequency);

    for (let i = 0; i < sampleCount; i++) {
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
