// Operaciones básicas
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

export function divide(a, b) {
    if (b === 0) {
        throw new Error('No es posible dividir por cero');
    }
    return a / b;
}

// Evaluación de expresión

// Evaluación de expresión
export function evaluate(expression) {
    // Validar la expresión antes de evaluar
    if (!isValidExpression(expression)) {
        throw new Error('Expresión no válida');
    }

    // Remover comas solo de números, no del signo negativo
    expression = expression.replace(/(\d),(\d)/g, '$1$2');

    // Dividir la expresión en operandos y operadores
    const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);

    // Realizar la evaluación
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const operand = parseFloat(tokens[i + 1]);
        result = operate(result, operator, operand);
    }

    return result;
}
// Realizar la operación correspondiente
function operate(leftOperand, operator, rightOperand) {
    const operations = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide
    };

    if (!operations[operator]) {
        throw new Error('Operador no reconocido: ' + operator);
    }

    return operations[operator](leftOperand, rightOperand);
}


// Validación de expresión// Validación de expresión// Validación de expresión
function isValidExpression(expression) {
    return containsValidCharacters(expression) &&
        !containsConsecutiveOperators(expression) &&
        !endsWithOperator(expression) &&
        !containsMultipleDecimals(expression) &&
        !startsWithDecimal(expression);
}

// Verifica si la expresión contiene caracteres válidos, incluyendo comas
function containsValidCharacters(expression) {
    const validCharactersRegex = /^[\d+\-*/.,\s]+$/;
    return validCharactersRegex.test(expression);
}

// Verifica si la expresión tiene dos operadores consecutivos
function containsConsecutiveOperators(expression) {
    const consecutiveOperatorsRegex = /[\+\-\*\/]{2,}/;
    return consecutiveOperatorsRegex.test(expression);
}

// Verifica si la expresión termina con un operador
function endsWithOperator(expression) {
    const endsWithOperatorRegex = /[\+\-\*\/]\s*$/;
    return endsWithOperatorRegex.test(expression);
}
// Verifica si la expresión contiene múltiples puntos decimales en un número
export function containsMultipleDecimals(expression) {
    const decimalRegex = /\.\d*\./;
    return decimalRegex.test(expression);
}
// Verifica si la expresión comienza con un punto decimal
function startsWithDecimal(expression) {
    const startsWithDecimalRegex = /^\./;
    return startsWithDecimalRegex.test(expression);
}