// js/calculator/index.js

// Importar las funciones y módulos necesarios
import * as operations from './operations.js';


const calculator = {
    ansInput: null,
    calculationHistory: null,
    possibleResult: null,

    init: function () {
        this.ansInput = document.forms.calculator.ans;
        this.calculationHistory = document.getElementById('calculation-history');
        this.possibleResult = document.getElementById('possible-result');

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

        this.ansInput.addEventListener('input', () => {
            this.updatePossibleResult();
        });
    },


    // Actualizar el posible resultado
    updatePossibleResult: function () {
        const expression = this.ansInput.value;
    
        try {
            const possibleResult = operations.evaluate(expression);
            this.showPossibleResult(possibleResult);
        } catch (error) {
            // Verificar si la expresión comienza con un operador negativo
            const startsWithNegativeOperator = /^-\d/.test(expression);
    
            if (startsWithNegativeOperator) {
                // Si comienza con un operador negativo, intentar evaluar sin el signo negativo al inicio
                const adjustedExpression = expression.replace(/^-/, '0-');
                try {
                    const possibleResult = operations.evaluate(adjustedExpression);
                    this.showPossibleResult(possibleResult);
                } catch (error) {
                    this.hidePossibleResult();
                }
            } else {
                this.hidePossibleResult();
            }
        }
    },
    

    showPossibleResult: function (possibleResult) {
        if (!isNaN(possibleResult)) {
            const formattedResult = this.formatNumber(possibleResult);
            this.possibleResult.textContent = `= ${formattedResult}`;
            this.possibleResult.style.display = 'block';
        } else {
            this.hidePossibleResult();
        }
    },
    formatNumber: function (number) {
        // Implement your formatting logic here
        return number.toLocaleString(); // Example: Use toLocaleString for basic formatting
    },

    hidePossibleResult: function () {
        this.possibleResult.textContent = '';
        this.possibleResult.style.display = 'none';
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
            default:
                this.updateExpression(value);
                break;
        }
    },
    // Actualización de la expresión en la calculadora
    updateExpression: function (value) {
        const currentExpression = this.ansInput.value;

        const lastCharIsOperator = /[\+\-\*\/]$/.test(currentExpression);
        const newValueIsOperator = /[\+\-\*\/]/.test(value);

        if (currentExpression === '' && value === '-') {
            // Permitir que el primer número sea negativo
            this.ansInput.value = value;
        } else if (lastCharIsOperator && newValueIsOperator) {
            // Reemplazar el operador anterior con el nuevo operador
            this.ansInput.value = currentExpression.slice(0, -1) + value;
        } else {
            // Agregar el nuevo valor a la expresión
            this.ansInput.value += value;
        }

        // Actualizar el posible resultado después de modificar la expresión
        this.updatePossibleResult();
    },




    // Evaluación de la expresión
    // Evaluación de la expresión
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
        this.updatePossibleResult(); // Actualiza el posible resultado al modificar la expresión

    },



    // Mostrar la expresión y el resultado en el historial
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


    // Limpiar la calculadora
    clearCalculator: function () {
        this.ansInput.value = '';
        this.resultcontainer.textContent = ''; // Limpiar el posible resultado al limpiar la calculadora
    },

    // Mostrar el resultado
    displayResult: function (result) {
        // Formatear el resultado para que se muestre correctamente con números negativos
        const formattedResult = this.formatNumber(result);
        this.ansInput.value = formattedResult;
    },
    // Actualizar el posible resultado

};

export default calculator;
