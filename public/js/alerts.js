/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error' only
export const showAlert = (type, msg, time = 7) => {
  const markup = `<div class='container'><div class="alert mt-5 alert--${type}">${msg}</div></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};
