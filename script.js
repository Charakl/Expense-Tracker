// header selectors
const balanceEl = document.querySelector('.balance-number');
const expences = document.querySelector('.expenses-number');
const income = document.querySelector('.income-number');
const username = document.querySelector('.username');
// new-transaction-container selectors
const newTransContainer = document.querySelector('.new-transaction-container');
const newTransBtns = document.querySelector('.new-transaction-buttons');
const expenseBtn = document.querySelector('.expense-button');
const incomeBtn = document.querySelector('.income-button');

// transactions buttons
const radioBtnsContainer = document.querySelector('.radio-btns-container');
const transRadioBtn = document.getElementById('trans-radio-btn');
const expensesRadioBtn = document.getElementById('expenses-radio-btn');
const incomeRadioBtn = document.getElementById('income-radio-btn');

const text = document.querySelector('.text-input');
const addBtn = document.querySelector('.new-trans-btn');
const transactionsEl = document.querySelector('.transactions');
const dropdownList = document.querySelector(".dropdown-list");
const selectedOption = document.querySelector(".selected-option");
const container = document.querySelector(".container");


const titleEl = document.querySelector('.text-input');
const amountEl = document.querySelector('.amount-input');
const categoryEl = document.querySelector('.selected-option');
const sectionTitleEl = document.querySelector('.section-title');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const cancelBtns = document.querySelectorAll('.close-modal');
const modalDeleteBtn = document.querySelector('.proceed');

let transactionsArr = JSON.parse(localStorage.getItem('transactions')) || [];
let editTransactionIndex = '';
let balanceChart;
let expensesChart;
let incomeChart;

const userLocale = navigator.language || navigator.userLanguage;
const options = {
    style: 'currency',
    currency: 'EUR'
}

const dateOptions = {
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
}

const transStyle = {
    borderTopLeftRadius: '1rem',
    borderBottomLeftRadius: '1rem',
    padding: 0
};

const categoryIcons = {
    Transportation: 'car',
    Food: 'restaurant',
    Health: 'medkit',
    Entertainment: 'game-controller',
    Education: 'school',
    Travel: 'airplane',
    Housing: 'home',
    Other: 'ellipsis-horizontal-circle',
  };

  let expenseSum, incomeSum;

  const xValues = ["Expenses", "Income"];
  const yValues = [expenseSum, incomeSum];
  const barColors = [
      "#c06c7a",
      "#30606e",
  ];

let myChart = new Chart("myChart", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      legend: {
        display: false
      },
      maintainAspectRatio: false
    }
  });

newTransBtns.addEventListener('click', (e) => {
    console.log(e.target);
    const categoryContainer = document.querySelector('.new-trans-category-container');
    if (e.target === expenseBtn) {
        console.log('expense');
        expenseBtn.classList.add('expense-btn-active');
        incomeBtn.classList.remove('income-btn-active');
        categoryContainer.classList.remove('hidden');
    } else if (e.target === incomeBtn) {
        console.log('income');
        expenseBtn.classList.remove('expense-btn-active');
        incomeBtn.classList.add('income-btn-active');
        categoryContainer.classList.add('hidden');
    }

    if (incomeBtn.classList.contains('income-btn-active')) {
        newTransBtns.style.borderBottom ='3px solid var(--dark-green-color)';
    } else {
        newTransBtns.style.borderBottom ='3px solid var(--red-color)';
    }
})

addBtn.addEventListener('click', function () {

    if (editTransactionIndex) {
        editTransaction(editTransactionIndex);
        return;
    }
    let title = titleEl.value;
    let amount = amountEl.value;
    let category = categoryEl.textContent;

    
    console.log(category);
    let type = 'expense';
    if (incomeBtn.classList.contains('income-btn-active')) {
        type = 'income';
    } else {
        type = 'expense';
    }

    if (!title || !amount || (type === 'expense' && category === 'Select')) {
        console.log('empty');
        const errorMessage = document.querySelector('.error-message');
        errorMessage.textContent = 'Please fill out all fields.';
        return;
    }
    
    console.log('patata');
    console.log(userLocale);
    const now = new Date();
    const userDate = new Intl.DateTimeFormat(userLocale, dateOptions).format(now);

    console.log("Text:", title);
    console.log("Amount:", amount);
    console.log("Date:", userDate);
    console.log("Category:", category);
    console.log("Type:", type);

    const newTransaction = {
        title: title,
        type: type,
        amount: amount,
        date: userDate,
        category: category,
        id: new Date().getTime()
    }

    transactionsArr.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactionsArr));
    console.log(transactionsArr);
    displayTransactions(transactionsArr);

    // Clear input fields
    clearInputFields();
});

function clearInputFields() {
    document.querySelector('.text-input').value = document.querySelector('.amount-input').value = '';
    document.querySelector('.selected-option').textContent = 'Select';
    addBtn.textContent = 'Add';
    sectionTitleEl.textContent = 'New Transaction';
    editTransactionIndex = '';
}

function editTransaction(transactionIndex) {
    let title = titleEl.value;
    let amount = amountEl.value;
    let category = categoryEl.textContent;
    if (incomeBtn.classList.contains('income-btn-active')) {
        type = 'income';
    } else {
        type = 'expense';
    }
    console.log(title);

    transactionsArr[transactionIndex].title = title;
    transactionsArr[transactionIndex].amount = amount;
    transactionsArr[transactionIndex].category = category;
    transactionsArr[transactionIndex].type = type;
    localStorage.setItem('transactions', JSON.stringify(transactionsArr));
    displayTransactions();
    // clearInputFields();
}

 expenseSum = 0, incomeSum = 0;

function displayTransactions(transactionsArr) {
    transactionsArr = JSON.parse(localStorage.getItem('transactions')) || [];
    transactionsEl.innerHTML = '';
    expenseSum = incomeSum = 0;

    transactionsArr.forEach((trans, i) => {
        let transactionHtml = '';
        const transRadioStyle = transRadioBtn.checked ? `border-left: ${trans.type === 'expense' ? '1rem solid var(--red-color)' : '1rem solid var(--dark-green-color)'}` : '';

        const expensesRadioStyle =  `
            border-top-left-radius: 1rem;
            border-bottom-left-radius: 1rem;
            padding-left: 0;
        ` ;

        const incomeRadioStyle = `
            border-left: 1rem solid var(--dark-green-color);
        `;

        if (transRadioBtn.checked || (expensesRadioBtn.checked && trans.type === 'expense') || (incomeRadioBtn.checked && trans.type === 'income')) {
            let transStyle;
            if (expensesRadioBtn.checked) {
                transStyle = expensesRadioStyle;
            } else if (transRadioBtn.checked) {
                transStyle = transRadioStyle;
            } else {
                transStyle = incomeRadioStyle;
            }
            let text;
            if (trans.title.length > 100) {
                console.log(trans.title);
                console.log("Text is more than 100 characters long.");
                console.log(trans.title.length);
                text = trans.title.split('').splice(0, 92).join('') + "...";
                console.log(text);
            } else {
                text = trans.title;
            }
            
            transactionHtml = `
                <div class="transaction" data-index="${trans.id}" style="${transStyle}">
                    <div class="icon-title-container">
                        <div class="tooltip">
                        <ion-icon name="${categoryIcons[trans.category]}" class="category-icon ${expensesRadioBtn.checked ? '' : 'hidden'}"></ion-icon>
                            <span class="tooltiptext">${trans.category}</span>
                        </div>
                        
                        
                    </div>
                    <span class="title">${text}</span>
                    <span class="date">${trans.date}</span>
                    <span class="amount">${new Intl.NumberFormat(userLocale, options).format(trans.amount)}</span>
                    <div class="icons">
                        <ion-icon name="create-outline" id="edit-btn"></ion-icon>
                        <ion-icon name="trash-outline" id="delete-btn"></ion-icon>
                    </div>
                </div>
            `;
        }
// ${expensesRadioBtn.checked ? `<ion-icon name="${categoryIcons[trans.category]}" class="category-icon"></ion-icon>` : ''}

        transactionsEl.insertAdjacentHTML('afterbegin', transactionHtml);

        if (trans.type === 'expense') {
            expenseSum += Number(trans.amount);
        } else if (trans.type === 'income') {
            incomeSum += Number(trans.amount);
        }
    });

    console.log(expenseSum, incomeSum);
    const expValue = new Intl.NumberFormat(userLocale, options).format(expenseSum);
    expences.textContent = expValue;
    const incValue = new Intl.NumberFormat(userLocale, options).format(incomeSum);
    income.textContent = incValue;
    // expensesChart = expValue.parseFloat(originalString.replace(/[^0-9,]/g, '').replace(',', '.'));
    // incomeChart = expValue.parseFloat(originalString.replace(/[^0-9,]/g, '').replace(',', '.'));

    const balance = incomeSum - expenseSum;
    balanceEl.textContent = new Intl.NumberFormat(userLocale, options).format(balance);
    balanceChart = new Intl.NumberFormat(userLocale, options).format(balance);
    updateChart(expenseSum, incomeSum);
}

function initialize() {
    displayTransactions(transactionsArr);
}
initialize();


function handleItemClick(event) {
    if (event.target.tagName === "LI") {
        
        // Update the selected option text
        selectedOption.textContent = event.target.textContent;

        // Close the dropdown
        dropdownList.classList.remove("show");
        container.classList.remove("dropdown-shown");
        const selectedValue = selectedOption.textContent;
        console.log(selectedValue);
    }
}

dropdownList.addEventListener("click", handleItemClick);

document.querySelector(".custom-dropdown").addEventListener("mouseenter", function() {
    // Show the dropdown by adding the "show" class
    dropdownList.classList.add("show");
    container.classList.add("dropdown-shown");
});
    
// Hide the dropdown list when the container is not hovered
document.querySelector(".custom-dropdown").addEventListener("mouseleave", function() {
    // Hide the dropdown by removing the "show" class
    dropdownList.classList.remove("show");
    container.classList.remove("dropdown-shown");
});

radioBtnsContainer.addEventListener('click', displayTransactions);

// Edit, Delete, and Complete/Uncomplete Actions
transactionsEl.addEventListener('click', (event) => {
    const editButton = event.target.closest('#edit-btn');
    const deleteButton = event.target.closest('#delete-btn');
    const transactionId = event.target.closest('.transaction').getAttribute('data-index');
    console.log(transactionId);

    if (editButton) {
        handleEditAction(transactionId);
        console.log(editButton);
    } else if (deleteButton) {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        modalDeleteBtn.addEventListener('click', handleDeleteAction.bind(null, transactionId));
        cancelBtns.forEach(cancelBtn => {
            cancelBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                overlay.classList.add('hidden');
            });
        });
    } 
});

// Function to handle the Delete action
function handleDeleteAction(transId) {
    console.log(transId);
    const transactionIndex = transactionsArr.findIndex(trans => trans.id === Number(transId));
    console.log(transactionIndex);

    if (transactionIndex !== -1) {
        transactionsArr.splice(transactionIndex, 1);
        localStorage.setItem('transactions', JSON.stringify(transactionsArr));
        displayTransactions();
    }
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

function handleEditAction(transId) {
    newTransContainer.scrollIntoView({behavior: 'smooth'});
    console.log(transId);
    const transactionIndex = transactionsArr.findIndex(trans => trans.id === Number(transId));
    console.log(transactionIndex);
    if (transactionIndex !== -1) {
        console.log(transactionsArr[transactionIndex]);
        const { title, amount, category, type } = transactionsArr[transactionIndex];
        editTransactionIndex = transactionIndex;
        setFields(title, amount, category, type);
    }
}

function setFields(title, amount, category, type) {
    console.log('here');
    sectionTitleEl.textContent = 'Edit Transaction';
    titleEl.value = title;
    amountEl.value = amount;
    categoryEl.textContent = category;
    addBtn.textContent = 'Save';

    const existingButton = document.querySelector('.cancel-edit-btn');

    if (!existingButton) {
        let buttonHtml = `
            <button class="cancel-edit-btn">Cancel</button>
        `;
        newTransContainer.insertAdjacentHTML('beforeend', buttonHtml);
    }

    // document.querySelector('.cancel-edit-btn').addEventListener('click', () => {
    //     console.log('here');
    //     // clearInputFields();
    
    // });

    const categoryContainer = document.querySelector('.new-trans-category-container');
    if (type === 'expense') {
        expenseBtn.classList.add('expense-btn-active');
        incomeBtn.classList.remove('income-btn-active');
        newTransBtns.style.borderBottom ='3px solid var(--red-color)';
        categoryContainer.classList.remove('hidden');
    } else {
        expenseBtn.classList.remove('expense-btn-active');
        incomeBtn.classList.add('income-btn-active');
        newTransBtns.style.borderBottom ='3px solid var(--dark-green-color)';
        categoryContainer.classList.add('hidden');
    }
}

// Tooltip
document.addEventListener("DOMContentLoaded", function () {
    var tooltipTrigger = document.querySelector(".tooltip-trigger");
    var tooltip = document.getElementById("myTooltip");
  
    tooltipTrigger.addEventListener("mouseover", function () {
      showTooltip(tooltip);
    });
  
    tooltipTrigger.addEventListener("mouseout", function () {
      hideTooltip(tooltip);
    });
  });
  
function showTooltip(tooltip) {
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = 1;
}

function hideTooltip(tooltip) {
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = 0;
}

// using event delegation for dynamicaly created element
newTransContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('cancel-edit-btn') || (event.target.classList.contains('new-trans-btn') && event.target.textContent === 'Save')) {
        console.log('here');
        console.log(event.target.textContent);
        clearInputFields();

        const cancelButton = newTransContainer.querySelector('.cancel-edit-btn');
        if (cancelButton) {
            cancelButton.remove();
        }
    }
});

  
// Function to update chart data
function updateChart(newExpenseSum, newIncomeSum) {
    expenseSum = newExpenseSum;
    incomeSum = newIncomeSum;

    // Check if myChart is defined before trying to update
    if (myChart) {
        // Update chart data
        myChart.data.datasets[0].data = [expenseSum, incomeSum];

        // Update chart
        myChart.update();
    }
}

// ... (rest of your code)

// Call the chart function with initial data
updateChart(expenseSum, incomeSum);

