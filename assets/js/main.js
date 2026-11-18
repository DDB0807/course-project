

const burger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (burger && navMenu) {
  const toggle = () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };
  burger.addEventListener('click', toggle);

  navMenu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) {
      burger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

(function () {
  const openBtn  = document.getElementById('bookCallBtn');
  const modal    = document.getElementById('callModal');
  if (!openBtn || !modal) return;

  const overlay  = modal.querySelector('[data-modal-overlay]');
  const closes   = modal.querySelectorAll('[data-modal-close]');
  const form     = modal.querySelector('#callForm');
  let lastFocus  = null;

  const open = () => {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';       // блок скролу
    // фокус на перше поле
    const first = modal.querySelector('input, textarea, button');
    if (first) first.focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  openBtn.addEventListener('click', open);
  overlay.addEventListener('click', close);        // missclick по фону закриває
  closes.forEach((btn) => btn.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {    // Esc закриває
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  const fields = Array.from(form.querySelectorAll('input, textarea, select'));
  const phonePattern = /^(?:\+380|0)[1-9]\d{8}$/;

  const validateField = (field) => {
    field.setCustomValidity('');

    if (field.required && field.type === 'checkbox' && !field.checked) {
      field.setCustomValidity('Підтвердьте згоду на обробку персональних даних.');
    } else if (field.required && !field.value.trim()) {
      const messages = {
        text: 'Введіть ваше ім’я.',
        email: 'Введіть електронну адресу.',
        tel: 'Введіть номер телефону.'
      };
      field.setCustomValidity(messages[field.type] || 'Заповніть це поле.');
    } else if (field.type === 'tel' && field.value.trim()) {
      const number = field.value.replace(/[\s()-]/g, '');
      if (!/^[+\d\s()-]+$/.test(field.value) || !phonePattern.test(number)) {
        field.setCustomValidity('Введіть український номер у форматі +380 67 123 45 67 або 067 123 45 67.');
      }
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      field.setCustomValidity('Введіть коректну електронну адресу, наприклад name@example.com.');
    } else if (!field.validity.valid) {
      field.setCustomValidity('Перевірте правильність заповнення цього поля.');
    }
  };

  form.noValidate = true;
  fields.forEach((field) => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('change', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach(validateField);
    if (form.reportValidity()) close();
  });
})();

(function () {
  const btnM = document.querySelector('.button:nth-child(1)');
  const btnY = document.querySelector('.button:nth-child(2)');
  if (!btnM || !btnY) return;

  const amounts = document.querySelectorAll('[data-plan-price]');
  const periods = document.querySelectorAll('[data-plan-period]');

  const setMode = (mode) => {
    btnM.classList.toggle('selected', mode === 'monthly');
    btnY.classList.toggle('selected', mode === 'yearly');

    amounts.forEach(el => {
      const val = el.getAttribute(mode === 'monthly' ? 'data-monthly' : 'data-yearly');
      if (val != null) el.textContent = val;
    });

    periods.forEach(el => {
      el.textContent = mode === 'monthly' ? '/місяць' : '/рік';
    });
  };

  btnM.addEventListener('click', () => setMode('monthly'));
  btnY.addEventListener('click', () => setMode('yearly'));

  // Ініціалізація
  setMode(btnM.classList.contains('selected') ? 'monthly' : 'yearly');
})();
