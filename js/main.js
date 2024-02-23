// js/main.js
import speechRecognition from './voice/speechRecognition.js';

// Importar las funciones y módulos necesarios
import calculator from './calculator/index.js';

// Inicializar la calculadora y la funcionalidad de voz
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar la calculadora
    calculator.init();

    // Inicializar la funcionalidad de reconocimiento de voz
    speechRecognition.init(calculator);
});
// Aquí puedes agregar cualquier otra lógica principal de la aplicación, como la interacción con el DOM o gestión de eventos.
