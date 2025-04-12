'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2025-01-10T14:11:59.604Z',
    '2025-01-12T17:01:17.194Z',
    '2025-01-16T23:36:17.929Z',
    '2025-01-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2025-01-10T14:43:26.374Z',
    '2025-01-15T18:49:59.371Z',
    '2025-01-16T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayDate = (date1, locale) => {
  const noOfDays = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

  const daysPassed = Math.round(noOfDays(date1, new Date()));

  if (daysPassed === 0) return 'TODAY';
  if (daysPassed === 1) return 'YESTERDAY';
  if (daysPassed <= 7) return `${daysPassed} Days ago`;

  const day = `${date1.getDate()}`.padStart(2, 0);
  const month = `${date1.getMonth() + 1}`.padStart(2, 0);
  const year = date1.getFullYear();
  //return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date1);
};

//-------------------------------------------------------------
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const movDateTime = displayDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    //formatted movements
    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${movDateTime}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedBal = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance);
  labelBalance.textContent = `${formattedBal}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedIncomes = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes);
  labelSumIn.textContent = `${formattedIncomes}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedOutcomes = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(out);
  labelSumOut.textContent = `${formattedOutcomes}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const formattedInterest = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest);
  labelSumInterest.textContent = `${formattedInterest}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Fake logged in..
let currentAccount;
// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI(currentAccount);
//adding date
// const cur = new Date().inter;
// const option = {
//   day: 'numeric',
//   month: 'numeric',
//   year: 'numeric',
//   weekday: 'long',
//   hour: 'numeric',
//   minute: 'numeric',
// };
// // fetching time,date standard from browser
// const locale = navigator.language;
// // console.log(cur);
// // const day = `${cur.getDate()}`.padStart(2, 0);
// // const month = `${cur.getMonth() + 1}`.padStart(2, 0);
// // const year = cur.getFullYear();
// // const hours = `${cur.getHours()}`.padStart(2, 0);
// // const minutes = `${cur.getMinutes()}`.padStart(2, 0);
// //const curTime = `${day}/${month}/${year} ${hours}:${minutes}`;
// labelDate.textContent = new Intl.DateTimeFormat(locale, option).format(cur);

// Event handlers
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //create date n time
    const cur = new Date().inter;
    const option = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    };
    const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(locale, option).format(cur);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // logOutimer
    let time = 10;
    const timeLogOut = function () {
      let min = String(Math.trunc(time / 60)).padStart(2, 0);
      let sec = String(Math.trunc(time % 60)).padStart(2, 0);

      labelTimer.textContent = `${min}:${sec}`;
      console.log(`${min}:${sec}`);
      time--;
    };
    setInterval(timeLogOut, 1000);
    if (time === 0) clearInterval(timeLogOut);

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    setTimeout(function () {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      const transferDate = new Date();
      currentAccount.movementsDates.push(transferDate);
      receiverAcc.movementsDates.push(transferDate);

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      const loanDate = new Date();
      currentAccount.movementsDates.push(loanDate);

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//---------------------------------- LECTURE#170 Converting & Checking Number ---------------------------

// few concepts
console.log(23 === 23);
console.log(0.3 === 0.3);
console.log(0.1 + 0.2); // invalid
console.log(1 + 0.2); // valid

// converting
console.log(Number('25'));
console.log(+'23'); // better approach

//parsing
console.log(Number.parseInt('37px'));
console.log(Number.parseFloat('2.3rem'));

//checking if value is number
console.log(Number.isNaN('20')); //false
console.log(Number.isNaN(20)); //false
console.log(Number.isNaN(2.0)); //false
console.log(Number.isNaN(+'20X')); // true
console.log(Number.isNaN(20 / 0)); //false

// best approach checking if value is number
console.log(Number.isFinite(23)); //true
console.log(Number.isFinite(2.3)); // true
console.log(Number.isFinite('23')); // false
console.log(Number.isFinite(23 / 0)); // false
console.log(Number.isFinite('23x')); // false

//---------------------------------- LECTURE#171 Math & Rounding ---------------------------

// Math

// 1.sqrt
console.log(Math.sqrt(25)); // 5
console.log((25 * 1) / 5); // 5
// 2.max
console.log(Math.max(1, 55, 20, 44)); // 55
console.log(Math.max(1, '55', 20, 44)); // 55
console.log(Math.max(1, '55x', 20, 44)); // NaN
console.log(Math.max(1, +'55x', 20, 44)); // NaN
// 3.min
console.log(Math.min(1, 55, 20, 44)); // 1
console.log(Math.min(-1, 55, 20, 44)); // -1
console.log(Math.min('1', 55, 20, 44)); // 1

// 4.random
console.log(Math.trunc(Math.random() * 6 + 1));
// to be used in Bankist
let randomNo = function (min, max) {
  return Math.trunc(Math.random() * (max - min) + 1) + min;
};
console.log(randomNo(10, 20));

// Rounding integers

// 1.trunc
console.log(Math.trunc(37.8)); // 37 just removes the decimal part
// 2.round
console.log(Math.round(37.5)); // 38 removes the decimal part depending on point
console.log(Math.round(37.4)); // 37
// 3.ceil
console.log(Math.ceil(37.3)); // 38 removes the decimal part and always go for next number.
console.log(Math.ceil(37.8)); // 38
// 4.floor
console.log(Math.floor(37.8)); // 37 just removes the decimal part as trunc() only when number is positive
console.log(Math.trunc(-37.8)); // -37 just removes the decimal part
console.log(Math.floor(-37.8)); // -38 roundup because for negative number it works other way | better approach

// Rounding decimals

// toFixed
console.log(+(23.5).toFixed(0)); // 24
console.log(+(23.4).toFixed(0)); // 23
console.log(+(23.345).toFixed(2)); // 23.34
console.log(+(23.545).toFixed(2)); // 24.55

//---------------------------------- LECTURE#172 The Remainder Operator ---------------------------

console.log(10 % 3); // 1
console.log(10 / 3); // 10=3*3+ 1

console.log(25 % 3); // 1
console.log(25 / 3); // 25= 8*8+ 1

console.log(10 % 5); // 0
console.log(10 / 5); // 10=5*5+ 0

const isEven = n => n % 2 === 0;
console.log(isEven(45));
console.log(isEven(37));
console.log(isEven(40));

//---------------------------------- LECTURE#173 The Numeric Operator ---------------------------

// for just our convenience.. the long intergers can be represented in a way which makes it easier to read.
// 350,000,000

const myNetWorth = 350_000_000;
console.log(myNetWorth); // 350000000

console.log(Number('35_00')); // NaN
console.log(35_00); // 3500

// invalid
// console.log(35_.00);
// console.log(35._00);
// console.log(35.00_);
// console.log(_35.00);

//---------------------------------- LECTURE#174 Working with BigInt ---------------------------
/* there is limit on numbers which can be stored in a variable, to store larger numbers we use n keyword with
number or bigInt()*/

console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 this is the maximum no can be stored safely

console.log(2 ** 53 - 1); // 9007199254740991
console.log(2 ** 53 + 2); //9007199254740994 wrong output

// but we can use n:
const hugeNo = 9007199254740994455n;
console.log(hugeNo);

//console.log(hugeNo * 2); // give error Cannot mix BigInt and other types, use explicit conversions
console.log(hugeNo * 2n); // correct
console.log(hugeNo * BigInt(2)); // correct

console.log(234n === 234); // false
console.log(234n === '234'); // false
console.log(234n === 234n); // true
console.log(234n === BigInt(234)); // true

//---------------------------------- LECTURE#175 Creating Dates ---------------------------

const jsTime = new Date(0);
console.log(jsTime);
console.log(typeof jsTime); // object

let now = new Date();
console.log(now);

let custom = new Date(2023, 4, 25, 12, 5, 30);
console.log(custom);
console.log(custom.getFullYear());
console.log(custom.getMonth());
console.log(custom.getDate());
console.log(custom.getHours());
console.log(custom.getMinutes());
console.log(custom.getSeconds());
console.log(custom.toISOString());

console.log(Date.now()); // returns the number of milliseconds passed since January 1, 1970.

//---------------------------------- LECTURE#176 Working with Dates ---------------------------'

console.log(account1);
/* adding dates in displayMovements,transfer and loan module, also the current date in the header (above)*/

//---------------------------------- LECTURE#177 Operations with Dates ---------------------------

/* we can finally compute date like subtracting or adding to get no of days in return. */

// For Example, calculating days

const myAgeInDays = (dob, currDate) => (currDate - dob) / (1000 * 60 * 60 * 24);

const dob = new Date(2002, 4, 4);
console.log(+dob); // in miliseconds

console.log(Math.floor(myAgeInDays(dob, new Date())));

/* adding day, no of days and date and in displayMovements (above)*/

//---------------------------------- LECTURE#178 Internationalizing dates intl ---------------------------

/* Internationalizing dates: using this API we can format date n time according to country standard format using locale, we can specify option
obj to set the type for each attribut like day,month,year etc(above: login, dispalymovements)*/

//---------------------------------- LECTURE#178 Internationalizing Numbers intl ---------------------------

/* Internationalizing can be used to format numbers*/
// for Example
const num = 1234557.37;
const option = {
  // style: 'unit',
  // unit: 'mile-per-hour',
  style: 'currency',
  currency: 'PKR',
  //useGrouping: false,
};
console.log('PK', new Intl.NumberFormat('ur-PK', option).format(num));
console.log('Seria', new Intl.NumberFormat('ar-SY', option).format(num));
console.log('Portugal', new Intl.NumberFormat('pt-PT', option).format(num));

//---------------------------------- LECTURE#179 setTimeOut and setInterval ---------------------------

/* setTimeout - is used when we want an action to be executed after specific time period, we can cancel this
action during this time. setTimeout it takes call back function*/

// setTimeOut
const carSpecs = ['Honda Civic', 'white', '1800'];
const buyCar = setTimeout(
  (model, color, power) => {
    console.log(
      `${model} car in ${color} with ${power} cc engine is purchased.`
    );
  },
  3000,
  ...carSpecs
);

// cancel setTimeout
if (carSpecs.includes('black')) clearTimeout(buyCar);

//setInterval

// const repeatDate = setInterval(function () {
//   const now = new Date();
//   const date = new Intl.DateTimeFormat('ur-Pk').format(now);
//   console.log(date);
// }, 1000);
