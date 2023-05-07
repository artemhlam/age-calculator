const dayInput = document.querySelector('#day-input');
const monthInput = document.querySelector('#month-input');
const yearInput = document.querySelector('#year-input');

const inputs = document.querySelectorAll('input[type="number"]');

inputs.forEach(input => {

  // Add max-length to all inputs type number
  input.oninput = function() {
    if(this.value.length > this.maxLength) {
      this.value = this.value.slice(0, this.dataset.maxLength);
    }
  }

  input.addEventListener('focusin', function() {
    this.parentElement.classList.add('calculator__form-group--focus')
  })
  input.addEventListener('focusout', function() {
    this.parentElement.classList.remove('calculator__form-group--focus')
  })
})



const formEl = document.querySelector('.calculator__form');
formEl.addEventListener('submit', e => {
  e.preventDefault();

  const isValid = checkValid();
  if(!isValid) return;  

  const birthDate = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
  const diff = calculateAge(birthDate);
  setResult(diff);

})

function calculateAge(birthDate) {
  const currentDate = new Date();
  const diffDate = new Date(currentDate - birthDate);
  const diffMonths = diffDate.getMonth();
  const diffDays = diffDate.getDate();

  let diffYears = currentDate.getFullYear() - birthDate.getFullYear();

  if(currentDate.getMonth() < birthDate.getMonth() ) {
    diffYears--;;
  }
  if(birthDate.getMonth() == currentDate.getMonth() && 
    currentDate.getDate() < birthDate.getDate()) {

    diffYears--;
}
   
  return {
    months: diffMonths,
    days: diffDays,
    years: diffYears
  }
}

function setResult({ days, years, months }) {
  console.log(days, years, months); 
  const resultDaysEl = document.querySelector('.calculator__results-days');
  const resultMonthsEl = document.querySelector('.calculator__results-months');
  const resultYearsEl = document.querySelector('.calculator__results-years');

  const currentDays = +resultDaysEl.textContent;
  const currentMonths = +resultMonthsEl.textContent ;
  const currentYears = +resultYearsEl.textContent;

  animateValue(resultDaysEl, currentDays, days, 500)
  animateValue(resultMonthsEl, currentMonths, months, 500)
  animateValue(resultYearsEl, currentYears, years, 500)
}

function checkValid() {
  const currentDate = new Date();

  const days = dayInput.value;
  const months = monthInput.value;
  const years = yearInput.value;

  const inputDate = new Date(years, months - 1, days);
  if(inputDate.getTime() > currentDate.getTime()) {
    setInputError(dayInput, 'Must be in the past')
    setInputError(monthInput, 'Must be in the past')
    setInputError(yearInput, 'Must be in the past')

    return false;
  }
  
  const maxDaysInMonth = new Date(years, months, 0).getDate();

  if(days.length === 0) {
    setInputError(dayInput, 'This field is required');
  } else if(days <= 0) {
    setInputError(dayInput, 'Must be more than 0');
  } else if(days > maxDaysInMonth) {
    setInputError(dayInput, `Must be less than '${maxDaysInMonth}'`);
  } else {
    removeInputError(dayInput)
  }



  if(!months || months.length === 0) {
    setInputError(monthInput, 'This field is required');
  } 
  else if(months <= 0) {
    setInputError(monthInput, 'Must be more than 0');
  } 
  else if (months > 12) {
    setInputError(monthInput, 'Must be less than 13');
  } 
  else {
    removeInputError(monthInput)
  }


  if(!years || years.length === 0) {
    setInputError(yearInput, 'This field is required');
  }
  else if(years < 100) {
    setInputError(yearInput, 'Must be more than 99');
  }
  else {
    removeInputError(yearInput)
  }


  let isValid = true;

  const formGroupEls = document.querySelectorAll('.calculator__form-group');
  formGroupEls.forEach(el => {
    if(el.classList.contains('calculator__form-group--error')) {
      isValid = false;
      return;
    }
  })

  return isValid;
}

function setInputError(input, errorText) {
  const inputErrorEl = input.nextElementSibling;
  inputErrorEl.textContent = errorText;

  input.parentElement.classList.add('calculator__form-group--error')
}
function removeInputError(input) {
  const inputErrorEl = input.nextElementSibling;
  inputErrorEl.textContent = '';

  input.parentElement.classList.remove('calculator__form-group--error')
}

function animateValue(el, start, end, duration) {
  if(isNaN(start)) start = 0;
  if(start === end) {
    el.textContent = start;
    return;
  }

  const range = end - start;
  let current = start;
  const increment = end > start? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  const id = setInterval(function() {
      current += increment;
      el.textContent = current;
      if(current == end) {
          clearInterval(id);
      }
  }, stepTime);
}