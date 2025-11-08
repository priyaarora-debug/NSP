document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  // ---------- REGISTER ----------
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const aadhar = document.getElementById('aadhar').value.trim();
      const dob = document.getElementById('dob').value.trim(); // new field
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!name || !aadhar || !dob || !email || !password) {
        alert("Please fill all fields!");
        return;
      }

      // Calculate age
      const birthDate = new Date(dob);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        alert("You must be 18 or older to register for voting.");
        return;
      }

      if (localStorage.getItem(aadhar)) {
        alert("User already registered with this Aadhaar ID!");
        return;
      }

      const user = { name, aadhar, dob, email, password, voted: false, voteFor: null };
      localStorage.setItem(aadhar, JSON.stringify(user));

      alert("Registration successful! Please log in now.");
      window.location.href = "login.html";
    });
  }

  // ---------- LOGIN ----------
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const aadhar = document.getElementById('aadharLogin').value.trim();
      const password = document.getElementById('passwordLogin').value.trim();
      const userData = localStorage.getItem(aadhar);

      if (!userData) {
        alert("User not found. Please register first.");
        return;
      }

      const user = JSON.parse(userData);

      if (user.password === password) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        if (user.voted) {
          alert("You have already voted!");
          window.location.href = "success.html";
        } else {
          alert("Login successful! Welcome " + user.name);
          window.location.href = "politician.html";
        }
      } else {
        alert("Incorrect password. Try again.");
      }
    });
  }

  // ---------- LOGOUT ----------
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem("loggedInUser");
      alert("You have logged out successfully.");
      window.location.href = "login.html";
    });
  }

  // ---------- VOTING SYSTEM ----------
  if (window.location.pathname.endsWith("politician.html")) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please log in to vote.");
      window.location.href = "login.html";
      return;
    }

    if (user.voted) {
      alert("You have already voted!");
      window.location.href = "success.html";
      return;
    }

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const name = card.querySelector("h3").textContent;
        const confirmVote = confirm(`Are you sure you want to vote for ${name}?`);

        if (confirmVote) {
          user.voted = true;
          user.voteFor = name;
          localStorage.setItem(user.aadhar, JSON.stringify(user));
          localStorage.setItem("loggedInUser", JSON.stringify(user));

          alert(`You voted for ${name}`);
          window.location.href = "success.html";
        }
      });
    });
  }

  // ---------- SUCCESS PAGE ----------
  if (window.location.pathname.endsWith("success.html")) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const msg = document.getElementById("voteMessage");

    if (user && user.voted) {
      msg.innerHTML = `🎉 Thank you, <strong>${user.name}</strong>! You have successfully voted for <strong>${user.voteFor}</strong>.`;
    } else {
      msg.innerHTML = "You haven't voted yet!";
    }

    // Auto logout after 5 seconds
    setTimeout(() => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    }, 5000);
  }
});








