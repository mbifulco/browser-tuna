const DEFAULT_SAMPLE_RATE = 44100;

export const determinePeakFrequency = (
  spectrum,
  fftSize,
  sampleRate = DEFAULT_SAMPLE_RATE,
) => {
  const maxIndex = indexOfPeakFrequency(spectrum, fftSize);
  const maxFreq = (maxIndex + 1) * (sampleRate / 2 / fftSize);
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

    note.name = NOTES.at(noteIndex % NOTES.length);

    if (note.name === undefined) debugger;
    note.octave = Math.floor(noteIndex / 12);
  }
  return note;
};

export const getFrequencyFromFrequencyIndex = (
  frequencyIndex,
  fftSize,
  sampleRate = DEFAULT_SAMPLE_RATE,
) => {
  const frequency = frequencyIndex * (sampleRate / fftSize);
  return frequency;
};

export const analyzeFrequencyData = (
  frequencyData,
  fftSize,
  sampleRate = DEFAULT_SAMPLE_RATE,
) => {
  const note = getNoteFromFrequency(
    determinePeakFrequency(frequencyData, fftSize),
  );
  const frequencyIndex = indexOfPeakFrequency(frequencyData, fftSize);
  const frequency = getFrequencyFromFrequencyIndex(
    frequencyIndex,
    fftSize,
    sampleRate,
  );
  return {
    note,
    frequency,
    frequencyIndex,
  };
};
