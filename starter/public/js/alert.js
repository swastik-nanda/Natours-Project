export const hideAlert = () => {
  const el = document.querySelector('alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, mesg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${mesg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
