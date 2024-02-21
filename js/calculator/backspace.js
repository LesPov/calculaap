const backspace = {
      // Maneja el clic en el botón de retroceso
      handleBackspaceButtonClick: function (ansInput, updatePossibleResult, formatNumbersInExpression) {
        let currentValue = ansInput.value;

        // Verifica si hay algo que borrar
        if (currentValue.length > 0) {
            // Elimina el último carácter de la expresión
            currentValue = currentValue.slice(0, -1);

            // Elimina todas las comas de la expresión actual
            const expressionWithoutCommas = currentValue.replace(/,/g, '');

            // Formatea la expresión eliminando comas y luego la vuelve a formatear con las comas en la posición correcta
            const formattedExpression = this.formatExpressionAfterBackspace(expressionWithoutCommas, formatNumbersInExpression);

            // Asigna el valor formateado de nuevo al campo de entrada
            ansInput.value = formattedExpression;

            // Actualiza el posible resultado
            updatePossibleResult();
        }
    },

    // Formatea la expresión después de presionar el botón de retroceso
    formatExpressionAfterBackspace: function (expression, formatNumbersInExpression) {
        if (expression === '') {
            return '';
        }

        const expressionWithoutCommas = this.removeCommas(expression);
        const expressionWithPlaceholder = this.replaceDecimalWithPlaceholder(expressionWithoutCommas);
        const tokens = this.tokenizeExpression(expressionWithPlaceholder);
        const formattedExpression = formatNumbersInExpression(tokens);

        return formattedExpression;
    },

    // Remueve comas existentes en la expresión
    removeCommas: function (expression) {
        return expression.replace(/,/g, '');
    },

    // Reemplaza los puntos decimales con una marca temporal
    replaceDecimalWithPlaceholder: function (expression) {
        return expression.replace(/\./g, '#');
    },

    // Separa la expresión en operandos y operadores
    tokenizeExpression: function (expression) {
        return expression.match(/(\d+|\+|\-|\*|\/|#)/g);
    },
};

// Exportar el módulo del botón de retroceso
export default backspace;
