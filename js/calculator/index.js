// Importar las funciones y módulos necesarios
import * as operations from './operations.js';
import history from './history.js'; // Importar el módulo del historial

// Objeto calculadora que maneja la lógica de la calculadora
const calculator = {
    // Elementos del DOM
    ansInput: null,
    calculationHistory: null,
    possibleResult: null,
    clearButtonClickCount: 0,



    // Inicialización de la calculadora
    init: function () {
        // Obtener referencias a elementos del DOM
        this.ansInput = document.forms.calculator.ans;
        this.calculationHistory = document.getElementById('calculation-history');
        this.possibleResult = document.getElementById('possible-result');
        this.backspaceButton = document.getElementById('backspace-button');

        // Asignar manejadores de eventos
        this.attachEventHandlers();

    },

    // Asigna manejadores de eventos a los botones
    attachEventHandlers: function () {
        const buttons = document.querySelectorAll('.buttons input[type="button"]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const value = event.target.value;
                this.handleButtonClick(value);
                this.updatePossibleResult();
            });
        });

        const decimalButton = document.getElementById('decimal-button');
        decimalButton.addEventListener('click', () => this.handleDecimalButtonClick());

        // Agrega el botón de retroceso
        this.backspaceButton.addEventListener('click', () => this.handleBackspaceButtonClick());
    },

    // Maneja el clic en el botón de retroceso
    handleBackspaceButtonClick: function () {
        let currentValue = this.ansInput.value;

        // Verifica si hay algo que borrar
        if (currentValue.length > 0) {
            // Elimina el último carácter de la expresión
            currentValue = currentValue.slice(0, -1);

            // Elimina todas las comas de la expresión actual
            const expressionWithoutCommas = currentValue.replace(/,/g, '');

            // Formatea la expresión eliminando comas y luego la vuelve a formatear con las comas en la posición correcta
            const formattedExpression = this.formatExpressionAfterBackspace(expressionWithoutCommas);

            // Asigna el valor formateado de nuevo al campo de entrada
            this.ansInput.value = formattedExpression;

            // Actualiza el posible resultado
            this.updatePossibleResult();
        }
    },
    // Formatea la expresión después de presionar el botón de retroceso
    formatExpressionAfterBackspace: function (expression) {
        if (expression === '') {
            return '';
        }

        const expressionWithoutCommas = this.removeCommas(expression);
        const expressionWithPlaceholder = this.replaceDecimalWithPlaceholder(expressionWithoutCommas);
        const tokens = this.tokenizeExpression(expressionWithPlaceholder);
        const formattedExpression = this.formatNumbersInExpression(tokens);

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

    // Formatea los números en la expresión
    formatNumbersInExpression: function (tokens) {
        let formattedExpression = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (/^\d+$/.test(token)) {
                formattedExpression += this.formatNumber(token);
            } else if (token === '#') {
                formattedExpression += '.';
            } else {
                formattedExpression += token;
            }
        }
        return formattedExpression;
    },

    // ------------------------------------------------------------  Posible Resultado ------------------------------------------------------------


    // Actualizar el posible resultado
    updatePossibleResult: function () {
        const expression = this.ansInput.value;

        try {
            const possibleResult = this.evaluateExpressionWithNegativeHandling(expression);
            this.showPossibleResult(possibleResult);
        } catch (error) {
            this.hidePossibleResult();
        }
    },

    // Evalúa la expresión con manejo especial para operadores negativos al inicio
    evaluateExpressionWithNegativeHandling: function (expression) {
        if (this.startsWithNegativeOperator(expression)) {
            return this.evaluateExpressionWithoutNegativeSign(expression);
        } else {
            return operations.evaluate(expression);
        }
    },

    // Evalúa la expresión sin el signo negativo al inicio
    evaluateExpressionWithoutNegativeSign: function (expression) {
        const adjustedExpression = expression.replace(/^-/, '0-');
        return operations.evaluate(adjustedExpression);
    },

    // Muestra el posible resultado formateado
    showPossibleResult: function (possibleResult) {
        if (!isNaN(possibleResult)) {
            const formattedResult = this.formatNumber(possibleResult);
            this.possibleResult.textContent = `= ${formattedResult}`;
            this.possibleResult.style.display = 'block';
        } else {
            this.hidePossibleResult();
        }
    },

    // Función para ocultar el posible resultado
    hidePossibleResult: function () {
        this.possibleResult.textContent = '';
        this.possibleResult.style.display = 'none';
    },

    // Formatea un número con comas
    formatNumber: function (number) {
        return parseFloat(number).toLocaleString('en-US');
    },

    // Verifica si la expresión comienza con un operador negativo
    startsWithNegativeOperator: function (expression) {
        return /^-\d/.test(expression);
    },


    // ------------------------------------------------------------ Manejadores de eventos y lógica de clics ------------------------------------------------------------

    // Agrega la lógica para manejar el clic en el botón decimal
    handleDecimalButtonClick: function () {
        const currentValue = this.ansInput.value;

        if (this.containsOperator(currentValue)) {
            this.handleDecimalWithOperator(currentValue);
        } else {
            this.handleDecimalWithoutOperator(currentValue);
        }
    },

    // Verifica si la expresión contiene un operador
    containsOperator: function (expression) {
        return expression.includes('+') || expression.includes('-') || expression.includes('*') || expression.includes('/');
    },

    // Maneja el clic en el botón decimal cuando hay un operador en la expresión
    handleDecimalWithOperator: function (currentValue) {
        const lastNumber = currentValue.split(/[\+\-\*\/]/).pop();

        if (!lastNumber.includes('.')) {
            this.ansInput.value += '.';
        }
    },

    // Maneja el clic en el botón decimal cuando no hay un operador en la expresión
    handleDecimalWithoutOperator: function (currentValue) {
        if (!currentValue.includes('.')) {
            this.ansInput.value += '.';
        }
    },


    // Maneja clics en botones
    handleButtonClick: function (value) {
        const buttonActions = {
            '=': () => this.evaluateExpression(),
            'C': () => this.handleClearButtonClick(),
            // Agrega más casos según las operaciones que necesites
            default: () => this.handleDefaultButtonClick(value)
        };

        const action = buttonActions[value] || buttonActions.default;
        action();
    },

    // En la función evaluateExpression
    evaluateExpression: function () {
        let expression = this.ansInput.value;
        const expressionWithoutCommas = expression.replace(/,/g, '');

        try {
            let result;
            if (this.startsWithNegativeOperator(expressionWithoutCommas)) {
                const adjustedExpression = expressionWithoutCommas.replace(/^-/, '0-');
                result = operations.evaluate(adjustedExpression);
            } else {
                result = operations.evaluate(expressionWithoutCommas);
            }

            const formattedResult = this.formatNumber(result);
            history.addEntry(expression, formattedResult); // Agregar entrada al historial
            this.displayResultWithFormat(result);
            this.updatePossibleResult();
        } catch (error) {
            console.error('Error al evaluar la expresión:', error.message);
        }
    },


    // Maneja el clic en el botón "C"
    handleClearButtonClick: function () {
        this.clearCalculator();
        // Restablece el contador después de 1 segundo (1000 milisegundos)
        setTimeout(() => this.clearButtonClickCount = 0, 1000);
    },

    // Maneja el clic en otros botones (por defecto)
    handleDefaultButtonClick: function (value) {
        const currentExpression = this.ansInput.value;

        if (value === '.') {
            this.handleDecimalButtonClick();
        } else if (this.shouldReplaceOperator(currentExpression, value)) {
            this.replaceLastOperator(currentExpression, value);
        } else if (this.shouldAllowNegativeNumber(currentExpression, value)) {
            this.allowNegativeNumber(value);
        } else {
            this.handleNonSpecialValues(value, currentExpression);
        }

        this.formatExpression();
        this.updatePossibleResult();
    },

    // Actualiza la expresión en la calculadora según el botón presionado
    updateExpression: function (value) {
        const currentExpression = this.ansInput.value;

        if (value === '.') {
            this.handleDecimalButtonClick();
        } else if (this.shouldReplaceOperator(currentExpression, value)) {
            this.replaceLastOperator(currentExpression, value);
        } else if (this.shouldAllowNegativeNumber(currentExpression, value)) {
            this.allowNegativeNumber(value);
        } else {
            this.handleNonSpecialValues(value, currentExpression);
        }

        this.formatExpression();
        this.updatePossibleResult();
    },

    // Maneja los valores que no son especiales (ni punto decimal, ni reemplazo de operador, ni número negativo)
    handleNonSpecialValues: function (value, currentExpression) {
        if (this.shouldAppendZero(value, currentExpression)) {
            this.appendZeroToExpression(value);
        } else if (this.shouldAvoidAddingZero(value, currentExpression)) {
            // Evitar agregar ceros adicionales si ya hay un punto decimal
            return;
        } else {
            // Agrega otros valores normalmente
            this.appendValueToExpression(value);
        }
    },

    // Verifica si se debe agregar ceros adicionales al final
    // Verifica si se debe agregar ceros adicionales al final
    shouldAppendZero: function (value, currentExpression) {
        return value === '0' && !currentExpression.includes('.');
    },

    // Verifica si se debe evitar agregar ceros adicionales al final
    shouldAvoidAddingZero: function (value, currentExpression) {
        return value === '0' && currentExpression.endsWith('0');
    },

    // Agrega ceros adicionales al final
    appendZeroToExpression: function (value) {
        this.appendValueToExpression(value);
    },


    /// ------------------------------ Lógica relacionada con el formato ------------------------------




    // Verifica si se debe reemplazar el último operador en la expresión
    shouldReplaceOperator: function (expression, value) {
        const lastCharIsOperator = /[\+\-\*\/]$/.test(expression);
        const newValueIsOperator = /[\+\-\*\/]/.test(value);
        return lastCharIsOperator && newValueIsOperator;
    },

    // Reemplaza el último operador en la expresión
    replaceLastOperator: function (expression, value) {
        this.ansInput.value = expression.slice(0, -1) + value;
    },

    // Verifica si se debe permitir un número negativo al inicio de la expresión
    shouldAllowNegativeNumber: function (expression, value) {
        return expression === '' && /[\+\-\*\/]/.test(value);
    },

    // Permite un número negativo al inicio de la expresión
    allowNegativeNumber: function (value) {
        this.ansInput.value = value;
    },


    // Agrega el valor del botón a la expresión
    appendValueToExpression: function (value) {
        this.ansInput.value += value;
    },

    // ------------------------------ Lógica relacionada con limpiar la calculadora ------------------------------


    clearCalculator: function () {
        // Incrementa el contador de clics
        this.clearButtonClickCount++;

        // Borra el historial si se han presionado dos veces el botón "C"
        if (this.clearButtonClickCount === 2) {
            history.clearHistory();
        } else {
            // Lógica actual de borrar resultado y posible resultado
            this.ansInput.value = '';
            this.hidePossibleResult();
        }
    },



    // ------------------------------ Lógica relacionada con el formato de la expresión ------------------------------

    // Formatea la expresión para mostrar comas en los números
    formatExpression: function () {
        let expression = this.ansInput.value;
        expression = this.removeCommas(expression);
        expression = this.replaceDecimalWithPlaceholder(expression);

        const tokens = this.tokenizeExpression(expression);
        const formattedExpression = this.formatNumbersInExpression(tokens);

        this.ansInput.value = formattedExpression;
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



    // Muestra el resultado en la calculadora con formato
    displayResultWithFormat: function (result) {
        // Formatear el resultado con comas
        const formattedResult = parseFloat(result).toLocaleString('en-US');
        this.ansInput.value = formattedResult;
    },
    displayResult: function (result) {
        // Formatear el resultado para que se muestre correctamente con números negativos
        const formattedResult = this.formatNumber(result);
        this.ansInput.value = formattedResult;
    },


};

// Exporta el objeto calculadora como módulo
export default calculator;