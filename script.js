// header selectors
const balance = document.querySelector('.balance-number');
const expences = document.querySelector('.expenses-number');
const income = document.querySelector('.income-number');
const username = document.querySelector('.username');
// new-transaction-container selectors
const text = document.querySelector('.text-input');
const amount = document.querySelector('.amount-input');
const date = document.querySelector('.date-input');
const addBtn = document.querySelector('.add-new-trans');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

addBtn.addEventListener('click', function () {
    // Get values from input fields
    const title = document.querySelector('.text-input').value;
    const amount = document.querySelector('.amount-input').value;
    const date = document.querySelector('.date-input').value;

    console.log("Text:", title);
    console.log("Amount:", amount);
    console.log("Date:", date);

    const newTransaction = {
        title: title,
        type: 'expense',
        amount: amount,
        date: date,
        category: 'food',
        id: generateNextID()
    }

    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
});
