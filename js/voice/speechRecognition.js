import voiceModule from './voiceModule.js';

const speechRecognition = {
    init: function (calculator) {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'es-ES';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const result = event.results[0][0].transcript;
                console.log('Texto escuchado:', result);
                this.handleVoiceInput(result, calculator);
            };

            recognition.onerror = (event) => {
                console.error('Error en el reconocimiento de voz:', event.error);
            };

            const voiceButton = document.getElementById('voice-button');
            voiceButton.addEventListener('click', () => {
                this.startRecognition(recognition);
            });
        } else {
            console.error('El navegador no es compatible con la funcionalidad de reconocimiento de voz.');
        }
    },

    startRecognition: function (recognition) {
        recognition.start();
    },

    handleVoiceInput: function (input, calculator) {
        const sanitizedInput = voiceModule.sanitizeVoiceInput(input);
        if (sanitizedInput) {
            // Mostrar el posible resultado al dictar la operación
            calculator.ansInput.value = sanitizedInput;
            calculator.updatePossibleResult();

            // Esperar 3 segundos antes de evaluar la expresión
            setTimeout(() => {
                calculator.evaluateExpression();

                // Obtener el resultado después de evaluar la expresión
                const result = calculator.ansInput.value;

                // Dictar el resultado usando la síntesis de voz
                this.speakResult(result);
            }, 3000);
        } else {
            console.error('Expresión no válida');
        }
    },

    speakResult: function (result) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();

        // Formatear el resultado para que se pronuncie correctamente
        const formattedResult = this.formatResultForSpeech(result);

        // Configurar el texto que se leerá
        utterance.text = `El resultado es ${formattedResult}`;

        // Establecer el idioma (puedes ajustarlo según tus necesidades)
        utterance.lang = 'es-ES';

        // Leer el texto usando la síntesis de voz
        synth.speak(utterance);
    },

    formatResultForSpeech: function (result) {
        // Remover comas del resultado para una pronunciación correcta
        const formattedResult = result.replace(/,/g, '');
        return formattedResult;
    },
};

export default speechRecognition;
