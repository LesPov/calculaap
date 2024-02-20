// Importar las funciones y módulos necesarios
import * as operations from './operations.js';

// Objeto calculadora que maneja la lógica de la calculadora
const calculator = {
    // Elementos del DOM
    ansInput: null,
    calculationHistory: null,
    possibleResult: null,

    // Inicialización de la calculadora
    init: function () {
        // Obtener referencias a elementos del DOM
        this.ansInput = document.forms.calculator.ans;
        this.calculationHistory = document.getElementById('calculation-history');
        this.possibleResult = document.getElementById('possible-result');

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
            });
        });

        const decimalButton = document.getElementById('decimal-button');
        decimalButton.addEventListener('click', () => this.handleDecimalButtonClick());
    },

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
            'C': () => this.clearCalculator(),
            // Agrega más casos según las operaciones que necesites
            default: () => this.updateExpression(value)
        };

        const action = buttonActions[value] || buttonActions.default;
        action();
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
    },

    // Maneja los valores que no son especiales (ni punto decimal, ni reemplazo de operador, ni número negativo)
    handleNonSpecialValues: function (value, currentExpression) {
        if (this.shouldAvoidAddingZero(value, currentExpression)) {
            return;
        }

        this.appendValueToExpression(value);
    },

    // Verifica si se debe evitar agregar ceros adicionales al final
    shouldAvoidAddingZero: function (value, currentExpression) {
        return value === '0' && currentExpression.endsWith('0');
    },


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

    // Evalúa la expresión y muestra el resultado en la calculadora
    evaluateExpression: function () {
        let expression = this.ansInput.value;

        // Remover comas de los números antes de evaluar
        const expressionWithoutCommas = expression.replace(/,/g, '');

        try {
            const result = operations.evaluate(expressionWithoutCommas);

            // Mostrar la expresión y el resultado en el historial
            this.showInHistory(expression, result);

            // Formatear el resultado antes de mostrarlo
            this.displayResultWithFormat(result);
        } catch (error) {
            console.error('Error al evaluar la expresión:', error.message);
        }
    },

    // Muestra la expresión y el resultado en el historial de cálculos
    showInHistory: function (expression, result) {
        const historyEntry = document.createElement('div');
        historyEntry.classList.add('calculation-entry');

        // Crear elementos para la expresión y el resultado
        const expressionElement = document.createElement('div');
        const resultElement = document.createElement('div');

        expressionElement.classList.add('calculation-operation');
        resultElement.classList.add('calculation-result');

        // Formatear el resultado con comas
        const formattedResult = parseFloat(result).toLocaleString('en-US');

        // Asignar valores
        expressionElement.textContent = `${expression}`;
        resultElement.textContent = `= ${formattedResult}`;

        // Agregar al historial al principio (antes de las existentes)
        historyEntry.appendChild(expressionElement);
        historyEntry.appendChild(resultElement);
        this.calculationHistory.insertBefore(historyEntry, this.calculationHistory.firstChild);
    },

    // Limpia la calculadora
    clearCalculator: function () {
        this.ansInput.value = '';
        // Puedes limpiar otros elementos, como el historial de cálculos, si es necesario
    },

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

    // Formatea un número con comas
    formatNumber: function (number) {
        return parseFloat(number).toLocaleString('en-US');
    },


    // Muestra el resultado en la calculadora con formato
    displayResultWithFormat: function (result) {
        // Formatear el resultado con comas
        const formattedResult = parseFloat(result).toLocaleString('en-US');
        this.ansInput.value = formattedResult;
    },
    // Muestra el resultado en la calculadora
    displayResult: function (result) {
        this.ansInput.value = result;
    },
};

// Exporta el objeto calculadora como módulo
export default calculator;