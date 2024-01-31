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

        if (this.shouldReplaceOperator(currentExpression, value)) {
            this.replaceLastOperator(currentExpression, value);
        } else if (this.shouldAllowNegativeNumber(currentExpression, value)) {
            this.allowNegativeNumber(value);
        } else {
            this.appendValueToExpression(value);
        }
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
        const expression = this.ansInput.value;
    
        // Manejar el caso especial de números negativos al inicio
        const adjustedExpression = expression.replace(/^-/, '0-');
    
        try {
            const result = operations.evaluate(adjustedExpression);

            // Mostrar la expresión y el resultado en el historial
            this.showInHistory(expression, result);

            this.displayResult(result);
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

        // Asignar valores
        expressionElement.textContent = `${expression}`;
        resultElement.textContent = `= ${result}`;

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

    // Muestra el resultado en la calculadora
    displayResult: function (result) {
        this.ansInput.value = result;
    },
};

// Exporta el objeto calculadora como módulo
export default calculator;
