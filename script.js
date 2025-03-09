document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;

    // Update the display
    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(currentOperand);
        
        if (operation) {
            previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    // Format the number for display
    function formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Add a number to the current operand
    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = number.toString();
            resetScreen = false;
        } else {
            currentOperand = currentOperand.toString() + number.toString();
        }
    }

    // Choose an operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    // Convert operation symbols for calculation
    function getOperationSymbol(op) {
        switch(op) {
            case '÷': return '/';
            case '×': return '*';
            case '−': return '-';
            case '+': return '+';
            default: return op;
        }
    }

    // Perform calculation
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        try {
            // Using Function constructor to safely evaluate the expression
            computation = Function('return ' + prev + getOperationSymbol(operation) + current)();
            
            // Check for division by zero
            if (operation === '÷' && current === 0) {
                currentOperand = 'Error';
                previousOperand = '';
                operation = undefined;
                return;
            }
        } catch (e) {
            currentOperand = 'Error';
            previousOperand = '';
            operation = undefined;
            return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        resetScreen = true;
    }

    // Clear the calculator
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    // Delete the last digit
    function deleteNumber() {
        if (currentOperand === 'Error') {
            clear();
            return;
        }
        
        currentOperand = currentOperand.toString().slice(0, -1);
        if (currentOperand === '') {
            currentOperand = '0';
        }
    }

    // Event listeners for buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === '.' && currentOperand.includes('.')) return;
            appendNumber(button.textContent);
            updateDisplay();
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.textContent);
            updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        calculate();
        updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        deleteNumber();
        updateDisplay();
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (/[0-9]/.test(event.key)) {
            appendNumber(event.key);
            updateDisplay();
        }
        if (event.key === '.') {
            if (!currentOperand.includes('.')) {
                appendNumber('.');
                updateDisplay();
            }
        }
        if (event.key === '+' || event.key === '-') {
            chooseOperation(event.key === '-' ? '−' : '+');
            updateDisplay();
        }
        if (event.key === '*') {
            chooseOperation('×');
            updateDisplay();
        }
        if (event.key === '/') {
            chooseOperation('÷');
            updateDisplay();
        }
        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            calculate();
            updateDisplay();
        }
        if (event.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
        }
        if (event.key === 'Escape') {
            clear();
            updateDisplay();
        }
    });

    // Initial display update
    updateDisplay();
});