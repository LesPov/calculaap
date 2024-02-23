// voiceModule.js
const voiceModule = {
    sanitizeVoiceInput: function (input) {
        const operatorMap = {
            'por': '*',
            'en': '/',
            'más': '+',
            'menos': '-'
            // Agrega más palabras y operadores según tus necesidades
        };

        const sanitizedInput = input.toLowerCase();

        const sanitizedWithOperators = sanitizedInput.replace(
            new RegExp(Object.keys(operatorMap).join('|'), 'g'),
            (matched) => operatorMap[matched]
        );

        const allowedCharacters = sanitizedWithOperators.replace(/[^0-9+\-*/.]/g, '');

        if (this.isValidExpression(allowedCharacters)) {
            return this.formatExpressionWithCommas(allowedCharacters);
        } else {
            return null;
        }
    },

    formatExpressionWithCommas: function (expression) {
        const formattedExpression = expression.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return formattedExpression;
    },

    isValidExpression: function (expression) {
        try {
            eval(expression);
            return true;
        } catch (error) {
            return false;
        }
    }
};

export default voiceModule;
