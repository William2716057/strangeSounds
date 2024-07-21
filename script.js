const sounds = {};

// Generate a tone for each letter of the alphabet and store it in the sounds array
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const letters = 'abcdefghijklmnopqrstuvwxyz';

letters.split('').forEach((letter, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 220 + (index * 20); // Assign a different frequency for each letter
    oscillator.start(0);
    oscillator.stop(audioContext.currentTime + 1); // Pre-generate the sound

    // Create an audio buffer and store it in the sounds array
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i++) {
        channelData[i] = Math.sin(2 * Math.PI * oscillator.frequency.value * i / audioContext.sampleRate);
    }
    sounds[letter] = buffer;
});

// Add an event listener to play the sound when a key is pressed
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (sounds[key]) {
        const source = audioContext.createBufferSource();
        source.buffer = sounds[key];
        source.connect(audioContext.destination);
        source.start(0);
    }
});