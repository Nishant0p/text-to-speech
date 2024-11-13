let speech = new SpeechSynthesisUtterance();
const voiceSelect = document.getElementById('voiceSelect');
const playButton = document.getElementById('playButton');
const downloadButton = document.getElementById('downloadButton');
const textarea = document.querySelector("textarea");

textarea.addEventListener("focus", (event) => {
    event.preventDefault(); 
});

function populateVoices() {
    const voices = window.speechSynthesis.getVoices();
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = ${voice.name} (${voice.lang});
        voiceSelect.appendChild(option);
    });
}

function setVoice() {
    const selectedVoice = voiceSelect.value;
    speech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === selectedVoice);
}

speechSynthesis.onvoiceschanged = populateVoices;

playButton.addEventListener("click", () => {
    speech.text = textarea.value;
    setVoice();
    window.speechSynthesis.speak(speech);
});

downloadButton.addEventListener("click", () => {
    const text = textarea.value;
    const selectedVoice = voiceSelect.value;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    
    const audioChunks = [];
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'speech.wav';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    mediaRecorder.start();
    
    speech.text = text;
    setVoice();
    window.speechSynthesis.speak(speech);

    speech.onend = () => {
        mediaRecorder.stop();
    };
});
