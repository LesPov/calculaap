// js/calculator/index.js

// Importar las funciones y módulos necesarios
import * as operations from './operations.js';

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

    

    attachEventHandlers: function () {
        const buttons = document.querySelectorAll('.buttons input[type="button"]');
        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const value = event.target.value;
                this.handleButtonClick(value);
            });
        });
    },


    // Manejo de clics en botones
    handleButtonClick: function (value) {
        switch (value) {
            case '=':
                this.evaluateExpression();
                break;
            case 'C':
                this.clearCalculator();
                break;
            // Puedes agregar más casos según las operaciones que necesites
            default:
                this.updateExpression(value);
                break;
        }
    },

    // Actualización de la expresión en la calculadora


    updateExpression: function (value) {
        const currentExpression = this.ansInput.value;

        // Verificar si la expresión está vacía y el nuevo valor es un operador
        if (currentExpression === '' && /[\+\-\*\/]/.test(value)) {
            // Permitir que el primer número sea negativo
            this.ansInput.value = value;
            return;
        }

        // Verificar si ya hay un operador al final de la expresión
        const lastCharIsOperator = /[\+\-\*\/]$/.test(currentExpression);

        // Verificar si el nuevo valor es un operador
        const newValueIsOperator = /[\+\-\*\/]/.test(value);

        // Verificar si hay dos operadores seguidos y el usuario seleccionó un nuevo operador
        if (lastCharIsOperator && newValueIsOperator) {
            // Reemplazar el operador anterior con el nuevo operador
            this.ansInput.value = currentExpression.slice(0, -1) + value;
            return;
        }

        // Agregar el nuevo valor a la expresión
        this.ansInput.value += value;
    },



    // Evaluación de la expresión
    evaluateExpression: function () {
        const expression = this.ansInput.value;
    
        // Manejar el caso especial de números negativos al inicio
        const adjustedExpression = expression.replace(/^-/, '0-');
    
        try {
            const result = operations.evaluate(adjustedExpression);
            this.displayResult(result);
        } catch (error) {
            console.error('Error al evaluar la expresión:', error.message);
        }
    },
    

    // Limpiar la calculadora
    clearCalculator: function () {
        this.ansInput.value = '';
        // Puedes limpiar otros elementos, como el historial de cálculos, si es necesario
    },

    // Mostrar el resultado
    displayResult: function (result) {
        this.ansInput.value = result;
    },

};

export default calculator;
