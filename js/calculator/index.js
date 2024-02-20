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
    // Agrega la lógica para manejar el clic en el botón decimal
    handleDecimalButtonClick: function () {
        const currentValue = this.ansInput.value;

        // Verificar si ya hay un operador en la expresión
        if (currentValue.includes('+') || currentValue.includes('-') || currentValue.includes('*') || currentValue.includes('/')) {
            // Verificar si el último número ya tiene un punto decimal
            const lastNumber = currentValue.split(/[\+\-\*\/]/).pop();
            if (!lastNumber.includes('.')) {
                // Si no tiene un punto decimal, agregar el punto decimal al final
                this.ansInput.value += '.';
            }
        } else {
            // Si no hay operador, agregar el punto decimal al final
            if (!currentValue.includes('.')) {
                this.ansInput.value += '.';
            }
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
            // Si el valor es un punto decimal, manejarlo específicamente
            this.handleDecimalButtonClick();
        } else if (this.shouldReplaceOperator(currentExpression, value)) {
            this.replaceLastOperator(currentExpression, value);
        } else if (this.shouldAllowNegativeNumber(currentExpression, value)) {
            this.allowNegativeNumber(value);
        } else {
            if (value === '0' && currentExpression.endsWith('0')) {
                // Evitar agregar ceros adicionales al final
                return;
            }
            this.appendValueToExpression(value);
        }

        // Formatear la expresión para mostrar comas en los números
        this.formatExpression();
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
    // Formatea la expresión para mostrar comas en los números
    formatExpression: function () {
        let expression = this.ansInput.value;

        // Remover comas existentes
        expression = expression.replace(/,/g, '');

        // Reemplazar los puntos decimales con una marca temporal
        expression = expression.replace(/\./g, '#');

        // Separar la expresión en operandos y operadores
        const tokens = expression.match(/(\d+|\+|\-|\*|\/|#)/g);

        // Formatear los números en la expresión
        const formattedExpression = tokens.map(token => {
            if (/^\d+$/.test(token)) {
                // Formatear el número con comas
                return parseFloat(token).toLocaleString('en-US');
            } else if (token === '#') {
                // Mantener el punto decimal en su lugar
                return '.';
            }
            return token;
        }).join('');

        // Actualizar el valor del input con la expresión formateada
        this.ansInput.value = formattedExpression;
    },


    // Evalúa la expresión y muestra el resultado en la calculadora
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