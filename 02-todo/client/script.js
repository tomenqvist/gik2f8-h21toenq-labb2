const PORT = 5001;

todoForm.title.addEventListener("keyup", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));

todoForm.description.addEventListener("input", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));

todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");
let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api(`http://localhost:${PORT}/tasks`);

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = "";
  switch (name) {
    case "title": {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case "description": {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }

    case "dueDate": {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove("hidden");
}

/* Callbackfunktion som används för eventlyssnare när någon klickar på knappen av typen submit */
function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log("Submit");

    saveTask();
    clearFields();
  }
}
function clearFields() {
  let descriptionText = document.getElementById("description");
  let titleText = document.getElementById("title");
  descriptionText.value = "";
  titleText.value = "";
}
/* Funktion för att ta hand om formulärets data och skicka det till api-klassen. */
function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false,
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

/* En funktion som ansvarar för att skriva ut todo-listan i ett ul-element. */
function renderList() {
  console.log("rendering");

  api.getAll().then((tasks) => {
    todoListElement.innerHTML = "";

    /* Koll om det finns någonting i tasks och om det är en array med längd större än 0 */
    if (tasks && tasks.length > 0) {
      //sorterar tasks efter datum
      tasks.sort(function (a, b) {
        return a.dueDate > b.dueDate;
      });
      //Sedan efter om den är completed eller inte
      tasks.sort(function (a, b) {
        return a.completed > b.completed;
      });

      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
      });
    }
  });
}

function renderTask({ id, title, description, dueDate, completed }) {
  //Variabler för att förändra styling på listobjekten, initieras med värden där de inte är gjorda
  let completedStatusH3 = "text-purple-900";
  let completedStatusLiBG = "";
  let completedBtn =
    "bg-amber-500 text-amber-800 hover:bg-red-400 hover:scale-150 transition-all hover:drop-shadow-md";
  let dateIsDue = "";

  if (completed) {
    completedStatusH3 = "text-slate-500 line-through";
    completedBtn =
      "bg-slate-400 text-black-900 hover:bg-red-400 hover:scale-150 transition-all hover:drop-shadow-md";
    completedStatusLiBG = "bg-slate-300";
  }
  //Skapar dagens datum och konverterar dueDate till ett datum och jämför om datumet har passerat
  const taskDate = new Date(dueDate);
  const date = new Date();
  if (taskDate < date && !completed) {
    dateIsDue = 'class="text-red-500 font-bold"';
  }

  let html = `
  <li class="select-none mt-2 py-2 border-b border-amber-300 ${completedStatusLiBG} rounded-xl">
    <div class="flex items-center">
      <h3 class="pl-2 mb-3 flex-1 text-xl font-bold ${completedStatusH3} uppercase">${title}</h3>
      <div>
        <span ${dateIsDue}>${dueDate}</span>
        <button onclick="deleteTask(${id})" class="mr-2 inline-block ${completedBtn} text-xs px-3 py-1 rounded-md ml-2">Ta bort</button>
      </div>
    </div>`;

  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

  let boxState = "";
  if (completed) {
    boxState = "checked";
  }

  html += `</li>
   <label>Klart!</label>
   <input class="completedBox accent-cyan-700" type="checkbox" onclick="updateTask(${id}, event)"${boxState}>
    `;

  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

/***********************Labb 2 ***********************/
function updateTask(id, event) {
  let isChecked = event.target.checked;
  console.log("Checkbox:", isChecked);
  const data = {
    completed: isChecked,
  };
  api.update(id, data).then((result) => renderList());
}
/***********************Labb 2 ***********************/

renderList();
