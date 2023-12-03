// header selectors
const balance = document.querySelector('.balance-number');
const expences = document.querySelector('.expenses-number');
const income = document.querySelector('.income-number');
const username = document.querySelector('.username');
// new-transaction-container selectors
const newTransBtns = document.querySelector('.new-transaction-buttons');
const expenseBtn = document.querySelector('.expense-button');
const incomeBtn = document.querySelector('.income-button');

const text = document.querySelector('.text-input');
const addBtn = document.querySelector('.new-trans-btn');
const transactionsEl = document.querySelector('.transactions');
const dropdownList = document.querySelector(".dropdown-list");
const selectedOption = document.querySelector(".selected-option");
const container = document.querySelector(".container");


const titleEl = document.querySelector('.text-input');
const amountEl = document.querySelector('.amount-input');
const dateEl = document.querySelector('.date-input');
const categoryEl = document.querySelector('.selected-option');

const modal = document.querySelector('.modal');
// const modalContainer = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const cancelBtns = document.querySelectorAll('.close-modal');
const modalDeleteBtn = document.querySelector('.proceed');
// const currentDate = new Date();
// const formattedDate = new Intl.DateTimeFormat('el-GR', {
//   year: 'numeric',
//   month: '2-digit',
//   day: '2-digit',
// }).format(currentDate);

// console.log('Formatted date:', formattedDate);
// Function to format and display the date
// function displayFormattedDate() {
//     const selectedDate = date.value;
//     console.log(date.value);

//     const formattedDate = new Intl.DateTimeFormat('el-GR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit'
//     }).format(new Date(selectedDate));

//     date.value = formattedDate;
// }

// // Attach the input event listener
// date.addEventListener('input', displayFormattedDate);

// Call the function on page load
// displayFormattedDate();

let transactionsArr = JSON.parse(localStorage.getItem('transactions')) || [];
let editTransactionIndex = '';

newTransBtns.addEventListener('click', (e) => {
    console.log(e.target);
    // const expenseBtn = e.target.closest('.expense-button');
    // const incomeBtn = e.target.closest('.income-button');
    if (e.target === expenseBtn) {
        console.log('expense');
        expenseBtn.classList.add('expense-btn-active');
        incomeBtn.classList.remove('income-btn-active');
    } else if (e.target === incomeBtn) {
        console.log('income');
        expenseBtn.classList.remove('expense-btn-active');
        incomeBtn.classList.add('income-btn-active');
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
    let date = dateEl.value;
    let category = categoryEl.textContent;
    let type = 'expense';
    if (incomeBtn.classList.contains('income-btn-active')) {
        type = 'income';
    } else {
        type = 'expense';
    }

    // Date based on user's locale
    const userLocale = navigator.language || navigator.userLanguage;
    console.log(userLocale);

    const formattedDate = new Date(date).toLocaleDateString(userLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    console.log('Formatted date:', formattedDate);

    console.log("Text:", title);
    console.log("Amount:", amount);
    console.log("Date:", date);
    console.log("Category:", category);
    console.log("Type:", type);

    const newTransaction = {
        title: title,
        type: type,
        amount: amount,
        date: formattedDate,
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
    document.querySelector('.text-input').value = document.querySelector('.amount-input').value = document.querySelector('.date-input').value = '' ;
    document.querySelector('.selected-option').textContent = 'Select';
    addBtn.textContent = 'Add';
    editTransactionIndex = '';
}

function editTransaction(transactionIndex) {
    let title = titleEl.value;
    let amount = amountEl.value;
    let date = dateEl.value;
    let category = categoryEl.textContent;
    if (incomeBtn.classList.contains('income-btn-active')) {
        type = 'income';
    } else {
        type = 'expense';
    }
    console.log(title);

    transactionsArr[transactionIndex].title = title;
    transactionsArr[transactionIndex].amount = amount;
    transactionsArr[transactionIndex].date = date;
    transactionsArr[transactionIndex].category = category;
    transactionsArr[transactionIndex].type = type;
    localStorage.setItem('transactions', JSON.stringify(transactionsArr));
    displayTransactions();
    clearInputFields();
}

function displayTransactions(transactionsArr) {
    transactionsArr = JSON.parse(localStorage.getItem('transactions')) || [];
    transactionsEl.innerHTML = '';
    console.log('array: ' + transactionsArr);
    transactionsArr.forEach((trans, i) => {
        const transactionHtml = `
            <div class="transaction" data-index="${trans.id}" style="border-left: ${trans.type === 'expense' ? '1rem solid var(--red-color)' : '1rem solid var(--dark-green-color)'};">
                <span class="title">${trans.title}</span>
                <span class="date">${trans.date}</span>
                <span class="amount">${trans.amount}</span>
                <div class="icons">
                    <ion-icon name="create-outline" id="edit-btn"></ion-icon>
                    <ion-icon name="trash-outline" id="delete-btn"></ion-icon>
                </div>
                
            </div>
        `;
        transactionsEl.insertAdjacentHTML('afterbegin', transactionHtml);
    })
}

function initialize() {
    displayTransactions(transactionsArr);
    // Attach the delete event listener once during initialization
    // transactionsEl.addEventListener('click', (event) => {
    //     const deleteButton = event.target.closest('#delete-btn');
    //     const transactionId = event.target.closest('.transaction').getAttribute('data-index');

    //     if (deleteButton) {
    //         modal.classList.remove('hidden');
    //         overlay.classList.remove('hidden');
    //         modalDeleteBtn.addEventListener('click', function() {
    //             handleDeleteAction(transactionId);
    //         });
    //     }
    // });
}
initialize();


function handleItemClick(event) {
    if (event.target.tagName === "LI") {
        
        // Update the selected option text
        selectedOption.textContent = event.target.textContent;

        // Close the dropdown
        // dropdownList.style.display = "none";
        dropdownList.classList.remove("show");
        container.classList.remove("dropdown-shown");
        const selectedValue = selectedOption.textContent;
        console.log(selectedValue);
        // switch (selectedValue) {
        //     case 'All':
        //         displayAllTasks();
        //         break;
        //     case 'Completed':
        //         displayCompletedTasks();
        //         break;
        //     case 'Pending':
        //         displayPendingTasks();
        //         break;
        //     case 'Sort':
        //         displaySortedTasks();
        //         break;
        // }
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

        // handleDeleteAction(transactionId);
        // console.log(deleteButton);
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
    console.log(transId);
    const transactionIndex = transactionsArr.findIndex(trans => trans.id === Number(transId));
    console.log(transactionIndex);
    if (transactionIndex !== -1) {
        console.log(transactionsArr[transactionIndex]);
        const { title, amount, date, category, type } = transactionsArr[transactionIndex];
        editTransactionIndex = transactionIndex;
        setFields(title, amount, date, category, type);
        // localStorage = JSON.parse(localStorage.getItem(transactions[transactionIndex]))
        // displayTransactions();
    }
}
// let transactionsArr = JSON.parse(localStorage.getItem('transactions'))

function setFields(title, amount, date, category, type) {
    titleEl.value = title;
    amountEl.value = amount;
    dateEl.value = date;
    categoryEl.textContent = category;
    addBtn.textContent = 'Save';
    if (type === 'expense') {
        expenseBtn.classList.add('expense-btn-active');
        incomeBtn.classList.remove('income-btn-active');
        newTransBtns.style.borderBottom ='3px solid var(--red-color)';
    } else {
        expenseBtn.classList.remove('expense-btn-active');
        incomeBtn.classList.add('income-btn-active');
        newTransBtns.style.borderBottom ='3px solid var(--dark-green-color)';
    }
    // editTransaction(transactionIndex);
}