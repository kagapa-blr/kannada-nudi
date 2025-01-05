// src/main/lib/speechToText.js

class SpeechToText {
    constructor() {
        // Ensure SpeechRecognition is available in the renderer process (not the main process)
        const SpeechRecognition =
            global.window?.SpeechRecognition || global.window?.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('SpeechRecognition API is not supported in this environment.');
            this.isSupported = false;
            return;
        }

        this.isSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'kn-IN'; // Kannada language code
        this.recognition.interimResults = false; // Return final results only
        this.recognition.maxAlternatives = 1; // Use one result alternative for simplicity
    }

    startListening() {
        if (!this.isSupported) {
            throw new Error('SpeechRecognition is not supported.');
        }

        return new Promise((resolve, reject) => {
            this.recognition.onstart = () => {
                console.log('Speech recognition started.');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Transcription: ', transcript);
                resolve(transcript); // Resolve with the transcription
            };

            this.recognition.onerror = (error) => {
                console.error('SpeechRecognition error:', error);
                reject(`Error: ${error.error}`); // Reject with detailed error
            };

            this.recognition.onend = () => {
                console.log('Speech recognition ended.');
            };

            try {
                this.recognition.start();
            } catch (error) {
                reject('Failed to start SpeechRecognition: ' + error.message);
            }
        });
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop(); // Stop recognition manually if needed
        }
    }
}

// Default export the class
export default SpeechToText;
