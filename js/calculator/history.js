// Módulo encargado de la lógica del historial
const history = {
    historyEntries: [],

    // Agregar una nueva entrada al historial
    // En la función addEntry
    addEntry: function (expression, formattedResult) {
        const historyEntry = {
            expression,
            result: formattedResult,
        };

        this.historyEntries.unshift(historyEntry); // Agregar al principio del historial
        this.updateHistoryView();
    },


    // Limpiar el historial
    clearHistory: function () {
        this.historyEntries = [];
        this.updateHistoryView();
    },

    // Actualizar la vista del historial en el DOM
    updateHistoryView: function () {
        const historyContainer = document.getElementById('calculation-history');
        historyContainer.innerHTML = '';

        this.historyEntries.forEach((entry) => {
            const historyEntry = document.createElement('div');
            historyEntry.classList.add('calculation-entry');

            const expressionElement = document.createElement('div');
            const resultElement = document.createElement('div');

            expressionElement.classList.add('calculation-operation');
            resultElement.classList.add('calculation-result');

            expressionElement.textContent = `${entry.expression}`;
            resultElement.textContent = `= ${entry.result}`;

            historyEntry.appendChild(expressionElement);
            historyEntry.appendChild(resultElement);
            historyContainer.appendChild(historyEntry);
        });
    }
};

// Exportar el módulo del historial
export default history;
