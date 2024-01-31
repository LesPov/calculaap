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
export function evaluate(expression) {
    // Validar la expresión antes de evaluar
    if (!isValidExpression(expression)) {
        throw new Error('Expresión no válida');
    }

    // Dividir la expresión en operandos y operadores
    const tokens = expression.match(/(\d+|\+|\-|\*|\/)/g);

    // Realizar la evaluación
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const operand = parseFloat(tokens[i + 1]);

        switch (operator) {
            case '+':
                result = add(result, operand);
                break;
            case '-':
                result = subtract(result, operand);
                break;
            case '*':
                result = multiply(result, operand);
                break;
            case '/':
                result = divide(result, operand);
                break;
            default:
                throw new Error('Operador no reconocido: ' + operator);
        }
    }

    return result;
}

// Validación de expresión
function isValidExpression(expression) {
    // Expresión regular que permite dígitos, operadores y espacios en blanco
    const validCharactersRegex = /^[\d\+\-\*\/\.\s]+$/;

    // Verificar caracteres válidos
    if (!validCharactersRegex.test(expression)) {
        return false;
    }

    // Verificar que no haya dos operadores seguidos
    if (/[\+\-\*\/]\s*[\+\-\*\/]/.test(expression)) {
        return false;
    }

    // Verificar que la expresión no termine con un operador
    if (/[\+\-\*\/]\s*$/.test(expression)) {
        return false;
    }

    return true;
}

