import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './leaflet';
import { updateSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const fileInput = document.querySelector('.form__upload');
const loginForm = document.querySelector('.form');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData();

    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#user-email').value);

    console.log(form);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'UPDATING...';
    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });
}

if (fileInput)
  fileInput.addEventListener('change', async (e) => {
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);

    // Take care of the type attribute being photo
    const newImage = await updateSettings(form, 'photo');

    if (newImage) {
      document
        .querySelector('.nav__user-img')
        .setAttribute('src', `/img/users/${newImage}`);
      document
        .querySelector('.form__user-photo')
        .setAttribute('src', `/img/users/${newImage}`);
    }
  });
