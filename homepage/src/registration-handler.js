import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { idNumberData } from './id-number.js';
import { setCookie } from './cookie-utils.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3fKEG0NmEfEp1sR559zRoAVkhLTuFU04",
  authDomain: "faridpur-high-school.firebaseapp.com",
  projectId: "faridpur-high-school",
  storageBucket: "faridpur-high-school.firebasestorage.app",
  messagingSenderId: "323975497844",
  appId: "1:323975497844:web:455afa394066b511172921",
  measurementId: "G-SED3BLB20X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

let canSendVerification = true;

window.addEventListener('load', () => {
  const idMessageEl = document.getElementById('id-message');
  const checkIdBtn = document.getElementById('check-id-btn');
  const registrationForm = document.getElementById('registration-form');

  // Clear previous loggedInUser data from localStorage on page load
  localStorage.removeItem('loggedInUser');

  if (!idMessageEl || !checkIdBtn || !registrationForm) {
    console.error('One or more required elements not found:', {
      idMessageEl,
      checkIdBtn,
      registrationForm
    });
    return;
  }

  checkIdBtn.addEventListener('click', () => {
    const idNumberInput = document.getElementById('id-number');
    if (!idNumberInput) {
      console.error('ID number input not found');
      return;
    }
    let idNumber = idNumberInput.value.trim();
    idNumber = idNumber.replace(/^0+/, '');

    idMessageEl.textContent = '';

    const fields = ['reg-name', 'reg-section', 'reg-phone', 'reg-rollnumber', 'reg-class', 'reg-shift'];

    if (!idNumber) {
      idMessageEl.textContent = 'please input your id number';
      fields.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.disabled = false;
      });
      return;
    }

    const studentData = idNumberData[idNumber];
    if (studentData) {
      fields.forEach(id => {
        const el = document.getElementById(id);
        el.value = studentData[id.replace('reg-', '')] || '';
        el.disabled = true;
      });
    } else {
      idMessageEl.textContent = 'ID number is not found';
      fields.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.disabled = false;
      });
    }
  });

  registrationForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    idMessageEl.textContent = '';

    let idNumber = document.getElementById('id-number').value.trim();
    idNumber = idNumber.replace(/^0+/, '');

    const name = document.getElementById('reg-name').value;
    const rollnumber = document.getElementById('reg-rollnumber').value;
    const studentClass = document.getElementById('reg-class').value;
    const section = document.getElementById('reg-section').value;
    const shift = document.getElementById('reg-shift').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (!idNumber) {
      idMessageEl.textContent = 'ID number is not inputted';
      return;
    }

    if (!Object.keys(idNumberData).includes(idNumber)) {
      idMessageEl.textContent = 'ID number is not found';
      return;
    }

    if (password !== confirmPassword) {
      idMessageEl.textContent = 'Passwords do not match';
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullStudentData = {
        idNumber,
        name,
        rollnumber,
        class: studentClass,
        section,
        shift,
        phone,
        email,
        uid: user.uid,
      };
      localStorage.setItem('loggedInUser', JSON.stringify(fullStudentData));

      // Set sessionId cookie for authentication
      setCookie('sessionId', user.uid, 1); // expires in 1 day

      if (!canSendVerification) {
        idMessageEl.textContent = 'Please wait before requesting another verification email.';
        return;
      }

      canSendVerification = false;
      setTimeout(() => {
        canSendVerification = true;
      }, 60000);

      await sendEmailVerification(user);
      alert('Registration successful! Please verify your email before logging in.');

      // Extract first name from full name
      const firstName = name.trim().split(' ')[0];

      // Prepare registration info to send to backend
      const registrationInfo = {
        idNumber,
        name,
        rollnumber,
        class: studentClass,
        section,
        shift,
        phone,
        email,
        uid: user.uid,
      };

      // Send POST request to backend to save profile data via new API with auth token
      fetch('http://localhost:3001/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token' // Simple auth token for demo
        },
        body: JSON.stringify({ uid: user.uid, registrationInfo })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Profile save response:', data);
      })
      .catch(error => {
        console.error('Error saving profile data:', error);
      });

      // Also send POST request to create static profile HTML file
      fetch('http://localhost:3001/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, registrationInfo })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Profile HTML creation response:', data);
      })
      .catch(error => {
        console.error('Error creating profile HTML file:', error);
      });

      window.location.href = 'email-verification.html';
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        idMessageEl.textContent = 'Too many requests. Please wait and try again later.';
      } else if (error.code === 'auth/email-already-in-use') {
        idMessageEl.textContent = 'Email address is already registered.';
      } else {
        idMessageEl.textContent = error.message;
      }
    }
  });
});

