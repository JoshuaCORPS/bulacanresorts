import '@babel/polyfill';
import { login, signup, logout } from './login';
import { forgotPass, resetPass } from './forgotPass';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { createResort, updateResort } from './resort';

const mapbox = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const formSignup = document.querySelector('.form--signup');
const formForgot = document.querySelector('.form--forgot');
const formReset = document.querySelector('.form--reset');
const formUserPassword = document.querySelector('.form-user-password');
const formUserData = document.querySelector('.form-user-data');
const logoutBtn = document.querySelector('.nav__el--logout');
const formEditResort = document.querySelector('.form-edit-resort');
const formSearchResort = document.querySelector('.form-search-resort');

// me route
const settingsBtn = document.getElementById('settings');
const createResortBtn = document.getElementById('createResort');
const manageResortBtn = document.getElementById('manageResorts');
const manageUserBtn = document.getElementById('manageUsers');

const inputFile = document.getElementById('photo');

const ObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  const suffix = 'xxxxxxxxxxxxxxxx'
    .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
    .toLowerCase();
  return `${timestamp}${suffix}`;
};

if (mapbox) {
  const loc = JSON.parse(mapbox.dataset.location);
  displayMap(loc);
}

if (formLogin) {
  formLogin.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--login').textContent = 'Logging in...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);

    document.querySelector('.btn--login').textContent = 'Log in';
  });
}

if (formSignup) {
  formSignup.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--sign-up').textContent = 'Creating...';

    const name = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordC = document.getElementById('passwordC').value;
    await signup(name, email, password, passwordC);

    document.querySelector('.btn--sign-up').textContent = 'Sign up';
  });
}

if (formForgot) {
  formForgot.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--forgot').textContent = 'Searching...';

    const email = document.getElementById('email').value;

    await forgotPass(email);

    document.querySelector('.btn--forgot').textContent = 'Search';
  });
}

if (formReset) {
  formReset.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--reset').textContent = 'Updating...';

    const token = document.getElementById('token').dataset.tokenid;
    const password = document.getElementById('password').value;
    const passwordC = document.getElementById('passwordC').value;
    console.log(passwordC);
    await resetPass(password, passwordC, token);

    document.querySelector('.btn--reset').textContent = 'Update Password';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (createResortBtn) {
  createResortBtn.addEventListener('click', function() {
    // createResortBtn.classList.toggle('side-nav--active');
    // manageResortBtn.classList.remove('side-nav--active');
    // settingsBtn.classList.remove('side-nav--active');
    // manageUserBtn.classList.remove('side-nav--active');

    const userData = [
      ...document.querySelectorAll('.user-view__form-container')
    ];

    // const manageContainer = document.querySelector('.container');

    userData.forEach(el => {
      el.parentElement.removeChild(el);
    });

    // if (manageContainer)
    // manageContainer.parentElement.removeChild(manageContainer);

    const markup = `
    <div class="user-view__form-container">
      <h2 class="heading-secondary ma-bt-md">Create New Resort</h2>
      <form class="form frm-new-resort">
        <div class="form__group">
          <label class="form__label" for="name">Name</label>
          <input class="form__input" id="name" type="text" placeholder="Resort Name" name="name" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="summary">Summary</label>
          <textarea class="form__input" id="summary" placeholder="Resort Summary Description..." name="summary" required></textarea>
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="description">Description</label>
          <textarea class="form__input" id="description" placeholder="Resort Description..." name="description" required></textarea>
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="price">Price</label>
          <input class="form__input" id="price" onkeypress='return event.charCode == 32 || event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)' type="text" placeholder="250 150 250 150" name="price" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="operation">Operation Hours</label>
          <input class="form__input" id="operation" type="text" placeholder="8:00 A.M - 5:00 P.M, 5:00 P.M - 12:00 MN" name="operationHours" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="coordinates">Location Coordinates</label>
          <input class="form__input" id="coordinates" type="text" placeholder="120.0000 14.0000" name="location" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="address">Address</label>
          <input class="form__input" id="address" type="text" placeholder="123 Nowhere St. PH" name="address" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="contact">Contact Numbers</label>
          <input class="form__input" id="contact" type="text" placeholder="09123-123-3211, (044) 321-1234" name="contactNumbers" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="email">Email</label>
          <input class="form__input" id="email" type="email" placeholder="resort@website.com" name="email" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="socialmedia">Social Media</label>
          <input class="form__input" id="socialmedia" type="text" placeholder="https://fb.com/pagename" name="socialmedia" required />
        </div>
        <div class="form__group ma-bt-md">
          <label class="form__label" for="website">Website</label>
          <input class="form__input" id="website" type="text" placeholder="resort.com" name="website" required />
        </div>
        <div class="form__group form__photo-upload">
          <img class="form__user-photo" src="/img/bulacan-nav.png" alt="User photo" />
          <input class="form__upload" type="file" accept="image/*" id="photo" name="images" multiple required/>
          <label for="photo">Choose 4 Photos</label>
        </div>
        <div class="form__group right">
          <button class="btn btn--small btn--green btn-new-resort"> Create Resort
        </div>
      </form>
    </div>
    `;

    document
      .querySelector('.user-view__content')
      .insertAdjacentHTML('afterbegin', markup);

    let createResortBtn = document.querySelector('.frm-new-resort');

    if (createResortBtn) {
      createResortBtn.addEventListener('submit', async e => {
        e.preventDefault();

        const id = ObjectId();
        const name = document.getElementById('name').value;
        const summary = document.getElementById('summary').value;
        const description = document.getElementById('description').value;
        const price = document
          .getElementById('price')
          .value.trim()
          .split(' ')
          .map(el => parseFloat(el));

        const operationHours = document
          .getElementById('operation')
          .value.split(',');

        const locArr = document
          .getElementById('coordinates')
          .value.split(' ')
          .map(el => parseFloat(el));

        const location = [
          {
            _id: id,
            type: 'Point',
            coordinates: locArr,
            description: document.getElementById('name').value
          }
        ];

        const address = document.getElementById('address').value;
        const contact = document.getElementById('contact').value.split(',');
        const email = document.getElementById('email').value;
        const social = document.getElementById('socialmedia').value;
        const website = document.getElementById('website').value;

        const form = new FormData();
        form.append('name', name);
        form.append('summary', summary);
        form.append('description', description);
        form.append('address', address);
        form.append('email', email);
        form.append('socialMedia', social);
        form.append('website', website);
        form.append('imageCover', document.getElementById('photo').files[0]);
        form.append('images', document.getElementById('photo').files[1]);
        form.append('images', document.getElementById('photo').files[2]);
        form.append('images', document.getElementById('photo').files[3]);

        const followUpData = { operationHours, contact, price, location };

        await createResort(form, followUpData);
      });
    }
  });
}

if (formUserPassword) {
  formUserPassword.addEventListener('submit', async e => {
    e.preventDefault();

    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
  });
}

if (formUserData) {
  formUserData.addEventListener('submit', async e => {
    e.preventDefault();

    // Create multipart/form-data to enable uploading files
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');
  });
}

if (inputFile) {
  inputFile.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        document.querySelector('.form__user-photo').src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
      console.log(this.files[0]);
    }
  });
}

if (manageResortBtn) {
  manageResortBtn.addEventListener('click', () => {
    manageResortBtn.classList.add('side-nav--active');
    createResortBtn.classList.remove('side-nav--active');
    settingsBtn.classList.remove('side-nav--active');
    manageUserBtn.classList.remove('side-nav--active');

    const form_containers = [
      ...document.querySelectorAll('.user-view__form-container')
    ];

    form_containers.forEach(el => {
      el.parentElement.removeChild(el);
    });

    const resorts = JSON.parse(
      document.querySelector('.user-view__content').dataset.resorts
    );

    const markup = `
      <div class="user-view__form-container">
        <h2 class="heading-secondary ma-bt-md">Resorts</h2>

        <table>
          <thead>
            <th> Resort Name </th>
            <th> Resort Link </th>
            <th> Action </th>
          <thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    `;
    document
      .querySelector('.user-view__content')
      .insertAdjacentHTML('afterbegin', markup);

    const trMarkup = resorts
      .map((el, i) => {
        return `
                <tr>
                  <td>
                    ${el.name}
                  </td>
                  <td>
                    <a href='/resort/${el.slug}' target='_blank'>
                      <svg class='overview-box__icon icon-manage'>
                        <use xlink:href="/img/icons.svg#icon-external-link"></use> 
                      </svg>
                    </a>
                  </td>
                  <td>
                    <a href='/resort/${el.slug}/edit' target='_blank' class=''>
                      <svg class='overview-box__icon icon-manage'>
                        <use xlink:href="/img/icons.svg#icon-edit"></use> 
                      </svg>
                    </a>
                    <button class='delete-resort-${i + 1}'> 
                      <svg class='overview-box__icon icon-manage'>
                        <use xlink:href="/img/icons.svg#icon-delete"></use> 
                      </svg>  
                    </button>
                  </td>
                </tr>
                `;
      })
      .join(' ');

    document.querySelector('tbody').insertAdjacentHTML('afterbegin', trMarkup);
  });
}

if (manageUserBtn) {
  manageUserBtn.addEventListener('click', () => {
    manageUserBtn.classList.add('side-nav--active');
    createResortBtn.classList.remove('side-nav--active');
    manageResortBtn.classList.remove('side-nav--active');
    settingsBtn.classList.remove('side-nav--active');
  });
}

if (formEditResort) {
  formEditResort.addEventListener('submit', async e => {
    e.preventDefault();

    const id = ObjectId();
    const name = document.getElementById('name').value;
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const price = document
      .getElementById('price')
      .value.trim()
      .split(' ')
      .map(el => parseFloat(el));

    const operationHours = document
      .getElementById('operation')
      .value.split(',');

    const locArr = document
      .getElementById('coordinates')
      .value.split(' ')
      .map(el => parseFloat(el));

    const location = [
      {
        // _id: id,
        // type: 'Point',
        coordinates: locArr,
        description: document.getElementById('name').value
      }
    ];

    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value.split(',');
    const email = document.getElementById('email').value;
    const social = document.getElementById('socialMedia').value;
    const website = document.getElementById('website').value;
    const slug = document.querySelector('.user-view__content').dataset.resortid;
    const data = {
      name,
      summary,
      description,
      price,
      operationHours,
      location,
      address,
      contactNumbers: contact,
      email,
      socialMedia: social,
      website
    };
    console.log(slug);
    await updateResort(data, slug);
  });
}

if (formSearchResort) {
  formSearchResort.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    console.log(name);
    if (name) {
      return location.assign(
        `/?search=${name
          .toLowerCase()
          .split(' ')
          .join('-')}`
      );
    }
  });
}
