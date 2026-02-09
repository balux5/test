const USER = {
    username: "Şagird",
    password: "balux"
  };
  
  const loginBox = document.getElementById("loginBox");
  const quizContainer = document.getElementById("quizContainer");
  const classSelect = document.getElementById("classSelect");
  const quiz = document.getElementById("quiz");
  const submitBtn = document.getElementById("submitBtn");
  const result = document.getElementById("result");
  const loginError = document.getElementById("loginError");
  
  let currentData = [];
  
  function login() {
    const u = username.value;
    const p = password.value;
  
    if (u === USER.username && p === USER.password) {
      localStorage.setItem("loggedIn", "true");
      showQuiz();
    } else {
      loginError.innerText = "İstifadəçi adı və ya şifrə səhvdir!";
    }
  }
  
  function logout() {
    localStorage.clear();
    location.reload();
  }
  
  function showQuiz() {
    loginBox.style.display = "none";
    quizContainer.style.display = "block";
  }
  
  if (localStorage.getItem("loggedIn")) {
    showQuiz();
  }
  
  function loadQuiz(file) {
    fetch(file)
      .then(res => res.json())
      .then(data => {
        currentData = data;
        quiz.innerHTML = "";
        result.innerHTML = "";
        submitBtn.disabled = false;
  
        data.forEach((q, i) => {
          quiz.innerHTML += `
            <div class="question">
              <p><b>${i + 1}.</b> ${q.question}</p>
              ${q.options.map(opt => `
                <label>
                  <input type="radio" name="q${i}" value="${opt}">
                  ${opt}
                </label><br>
              `).join("")}
            </div>
          `;
        });
      });
  }
  
  loadQuiz(classSelect.value);
  classSelect.addEventListener("change", e => loadQuiz(e.target.value));
  
  submitBtn.addEventListener("click", () => {
    let correct = 0;
  
    currentData.forEach((q, i) => {
      const selected = document.querySelector(`input[name=q${i}]:checked`);
      const options = document.querySelectorAll(`input[name=q${i}]`);
  
      options.forEach(opt => {
        const label = opt.parentElement;
  
        if (opt.value === q.correctAnswer) {
          label.style.color = "green";
          label.style.fontWeight = "bold";
        }
  
        if (selected && opt === selected && opt.value !== q.correctAnswer) {
          label.style.color = "red";
          label.style.fontWeight = "bold";
        }
  
        opt.disabled = true;
      });
  
      if (selected && selected.value === q.correctAnswer) {
        correct++;
      }
    });
  
    result.innerHTML = `
      <h2>Nəticə</h2>
      <p>Düz: ${correct}</p>
      <p>Səhv: ${currentData.length - correct}</p>
    `;
  
    submitBtn.disabled = true;
  });
  
