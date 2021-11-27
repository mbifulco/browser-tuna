import { useEffect, useRef, useState } from 'react';
import AudioDevices from '../../lib/AudioDevices';

import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

const Tuner = () => {
  const [audioInterface, setAudioInterface] = useState();
  const [audioInterfaceSelection, setAudioInterfaceSelection] = useState('0');

  const [count, setCount] = useState(0);
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (!audioInterface?.frequencyAnalyzer) return;

    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;

      var bufferLength = audioInterface.frequencyAnalyzer.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      audioInterface.frequencyAnalyzer.getFloatFrequencyData(dataArray);

      // Pass on a function to the setter of the state
      // to make sure we always have the latest state
      setCount(dataArray);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  useEffect(() => {
    async function initializeAudio() {
      const ai = new AudioDevices();
      await ai.init();
      setAudioInterface(ai);
    }
    initializeAudio();
  }, []);

  return (
    <section>
      {count}
      {audioInterface?.devices?.length && (
        <RadioGroup
          name="audio-interface-selection"
          onChange={setAudioInterfaceSelection}
          value={audioInterfaceSelection}
        >
          <Stack>
            {audioInterface.devices.map((device, idx) => {
              return (
                <Radio
                  value={idx + ''}
                  key={`${device.kind}-${device.groupId}-${device.deviceId}`}
                >
                  {device.label}
                </Radio>
              );
            })}
          </Stack>
        </RadioGroup>
      )}
    </section>
  );
};

export default Tuner;
