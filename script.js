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
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

function setVoice() {
    const selectedVoice = voiceSelect.value;
    speech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === selectedVoice);
}

speechSynthesis.onvoiceschanged = populateVoices;

playButton.addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;
    setVoice();
    window.speechSynthesis.speak(speech);
});

downloadButton.addEventListener("click", () => {
    const text = document.querySelector("textarea").value;
    const selectedVoice = voiceSelect.value;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    
    const voice = window.speechSynthesis.getVoices().find(voice => voice.name === selectedVoice);
    
    const source = audioContext.createBufferSource();
    source.connect(mediaStreamDestination);

    const request = new XMLHttpRequest();
    request.open('GET', 'https://api.voicerss.org/?key=8854e4704a1c4b8ea3c44922281e4184&hl=en-us&src=' + encodeURIComponent(text), true);
    request.responseType = 'blob';
    request.onload = function() {
        const blob = request.response;
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'speech.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    request.send();
});