const SAMPLING_RATE = 48000;

export const determinePeakFrequency = (spectrum, fftSize) => {
  const max = Math.max(...spectrum);
  const maxIndex = spectrum.indexOf(max);
  const maxFreq = maxIndex * (SAMPLING_RATE / fftSize);
  return maxFreq;
};

export const indexOfPeakFrequency = (spectrum, fftSize) => {
  const max = Math.max(...spectrum);
  const maxIndex = spectrum.indexOf(max);
  return maxIndex;
};

const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export const getNoteFromFrequency = (frequency) => {
  const note = {
    name: '',
    octave: 0,
  };
  if (frequency > 0) {
    const noteIndex = Math.round(
      12 * (Math.log(frequency / 440) / Math.log(2)),
    );
    note.name = NOTES[noteIndex % 12];
    note.octave = Math.floor(noteIndex / 12);
  }
  return note;
};

export const getFrequencyFromFrequencyIndex = (frequencyIndex, fftSize) => {
  const frequency = frequencyIndex * (SAMPLING_RATE / fftSize);
  return frequency;
};

export const analyzeFrequencyData = (frequencyData, fftSize) => {
  const note = getNoteFromFrequency(
    determinePeakFrequency(frequencyData, fftSize),
  );
  const frequencyIndex = indexOfPeakFrequency(frequencyData, fftSize);
  const frequency = getFrequencyFromFrequencyIndex(frequencyIndex, fftSize);
  return {
    note,
    frequency,
    frequencyIndex,
  };
};
