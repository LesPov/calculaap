// voiceModule.js
const voiceModule = {

    /**
     * Sanitiza la entrada de voz, reemplazando palabras clave por operadores matemáticos y eliminando caracteres no permitidos.
     * @param {string} input - La entrada de voz a sanear.
     * @returns {string|null} - La expresión sanitizada o null si la expresión no es válida.
     */
    sanitizeVoiceInput: function (input) {
        const operatorMap = {
            'por': '*',
            'dividido en': '/',
            'más': '+',
            'menos': '-'
            // Agrega más palabras y operadores según tus necesidades
        };

        // Convierte la entrada a minúsculas para hacer la comparación insensible a mayúsculas
        const sanitizedInput = input.toLowerCase();

        // Reemplaza palabras clave por operadores matemáticos
        const sanitizedWithOperators = sanitizedInput.replace(
            new RegExp(Object.keys(operatorMap).join('|'), 'g'),
            (matched) => operatorMap[matched]
        );

        // Elimina caracteres no permitidos, dejando solo dígitos y operadores
        const allowedCharacters = sanitizedWithOperators.replace(/[^0-9+\-*/.]/g, '');

        // Valida la expresión resultante
        if (this.isValidExpression(allowedCharacters)) {
            // Formatea la expresión con comas para separar los miles
            return this.formatExpressionWithCommas(allowedCharacters);
        } else {
            return null;
        }
    },

    /**
     * Formatea una expresión numérica agregando comas para separar los miles.
     * @param {string} expression - La expresión numérica a formatear.
     * @returns {string} - La expresión formateada.
     */
    formatExpressionWithCommas: function (expression) {
        const formattedExpression = expression.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return formattedExpression;
    },

    /**
     * Valida una expresión matemática utilizando eval().
     * @param {string} expression - La expresión a validar.
     * @returns {boolean} - true si la expresión es válida, false si hay un error de evaluación.
     */
    isValidExpression: function (expression) {
        try {
            eval(expression);
            return true;
        } catch (error) {
            return false;
        }
    }
};

// Exporta el módulo para su uso en otras partes de la aplicación
export default voiceModule;
