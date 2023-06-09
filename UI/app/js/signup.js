// CONSUME SIGNUP ENDPOINT
const signupBtn = document.getElementById('signupBtn');
const nameUser = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

const usernameErr = document.querySelector('div#usernameErr');
const emailErr = document.querySelector('div#emailErr');
const passwordErr = document.querySelector('div#passwordErr');
const password2Err = document.querySelector('div#password2Err');

/**
 * isValidPassword method
 * @param {string} password
 * @returns {string} true or error messages
 */
// Adapted from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
function isValidPassword(value) {
  if (!/[a-z]/.test(value)) {
    return 'Sua senha deve conter pelo menos uma letra minúscula';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Sua senha deve conter pelo menos uma letra maiúscula';
  }
  if (!/\d/.test(value)) {
    return 'Sua senha deve conter pelo menos um número';
  }
  if (!/[@$!%*?&]/.test(value)) {
    return 'Sua senha deve conter pelo menos um destes caracteres especiais: @, $, !, %, *, ?, &';
  }
  if (value.length < 6) {
    return 'Sua senha deve ser composta por pelo menos 6 caracteres';
  }
  return 'true';
}

nameUser.onchange = () => {
  password2Err.innerHTML = '';
};
email.onchange = () => {
  emailErr.innerHTML = /\S+@\S+\.\S+/.test(email.value)
    ? ''
    : 'Por favor, insira um e-mail válido';
  usernameErr.innerHTML = '';
  password2Err.innerHTML = '';
};
password.onchange = () => {
  passwordErr.innerHTML =
    isValidPassword(password.value) === 'true'
      ? ''
      : isValidPassword(password.value);
  password2Err.innerHTML =
    password2.value === password.value
      ? ''
      : 'As senhas são diferentes, verifique!';
};
password2.oninput = () => {
  password2Err.innerHTML =
    password2.value === password.value
      ? ''
      : 'As senhas são diferentes, verifique!';
};

signupBtn.onmouseover = () => {
  if (
    emailErr.innerHTML !== '' ||
    passwordErr.innerHTML !== '' ||
    password2Err.innerHTML !== ''
  ) {
    signupBtn.style.opacity = 0.6;
  } else {
    signupBtn.style.opacity = 1;
    signupBtn.style.cursor = 'pointer';
  }
};

const localhost = 'http://localhost:9999/api/v1';
// UNCOMMENT BELOW AND USE IN REQ FOR PRODUCTION
// const herokuhost = 'https://fast-food-fast-bobsar0.herokuapp.com/api/v1/';

signupBtn.onclick = () => {
  if (
    emailErr.innerHTML !== '' ||
    passwordErr.innerHTML !== '' ||
    password2Err.innerHTML !== ''
  ) {
    usernameErr.innerHTML = 'Por favor, corrija os erros abaixo:';
  } else {
    const username = nameUser.value;
    usernameErr.innerHTML = '';
    const req = new Request(`${localhost}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // mode: 'no-cors',
      body: JSON.stringify({
        username,
        email: email.value,
        password: password.value,
      }),
    });
    fetch(req)
      .then((resp) =>
        resp
          .json()
          .then((res) => {
            if (res.status === 'fail') {
              password2Err.innerHTML = res.message;
            }
            if (res.status === 'success' && res.token) {
              localStorage.setItem('token', res.token);
              localStorage.setItem('username', res.user.username);
              localStorage.setItem('address', res.user.address);
              localStorage.setItem('phone', res.user.phone);
              localStorage.setItem('id', res.user.userid);

              password2Err.innerHTML = `<span style='color: greenyellow'>${res.message}</span>`;

              if (res.user.role === 'admin') {
                setTimeout(() => {
                  localStorage.setItem(res.user.username, 'an');
                  window.location.href = 'admin';
                }, 100);
                return;
              }
              setTimeout(() => {
                window.location.href = 'userMenu';
              }, 100);
            }
          })
          .catch((err) => {
            password2Err.innerHTML = err.message;
          }),
      )
      .catch((fetchErr) => {
        usernameErr.innerHTML = `Error: ${fetchErr}... Offline?`;
      });
  }
};
