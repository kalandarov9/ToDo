const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: true,
    body:
      "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body:
      "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  },
];

(function (arrOfTasks) {
  let objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const listConteiner = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const listConteinerCompleted = document.querySelector(
    ".tasks-list-section .list-group-completed"
  );
  const form = document.forms["addTask"];
  const inputTitle = form.elements["title"];
  const inputBody = form.elements["body"];
  const containerTasks = document.querySelector(
    ".tasks-list-section .container"
  );
  const themeSelect = document.getElementById("themeSelect");

  renderAllTasks(objOfTasks);
  getStorage();

  form.addEventListener("submit", onFormsSubmit);

  themeSelect.addEventListener("change", selectTheme);

  containerTasks.addEventListener("click", checkTask);

  containerTasks.addEventListener("click", deleteTaskWithButton);

  containerTasks.addEventListener("click", modalEditTask);

  containerTasks.addEventListener("click", restoreTrash);

  function countTask() {
    let countFalse = 0;
    let countTrue = 0;
    for (const key in objOfTasks) {
      if (objOfTasks[key].completed === true) {
        countTrue++;
      }
      if (objOfTasks[key].completed === false) {
        countFalse++;
      }
    }

    const navHomeTab = document.querySelector(".allTask");
    const completedTask = document.querySelector(".completedTask");

    navHomeTab.textContent = countFalse;
    completedTask.textContent = countTrue;

    if (countFalse == 0) {
      document.querySelector(".allTask").hidden = true;
    } else {
      document.querySelector(".allTask").hidden = false;
    }

    if (countTrue == 0) {
      document.querySelector(".completedTask").hidden = true;
    } else {
      document.querySelector(".completedTask").hidden = false;
    }

    viewMessageEmptyContainer();

    return {
      true: countTrue,
      false: countFalse,
    };
  }

  function modalEditTask(e) {
    if (e.target.classList.contains("edit-task")) {
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;

      const formEditTask = document.forms["editTask"];
      const inputTitle = formEditTask.elements["input-title"];
      const inputBody = formEditTask.elements["text-area-body"];

      for (const key in objOfTasks) {
        if (objOfTasks[key]._id === id) {
          inputTitle.value = objOfTasks[key].title;
          inputBody.value = objOfTasks[key].body;
        }
      }

      $("#editTaskModal").modal("show");

      document.querySelector(".save-changes").addEventListener("click", (e) => {
        objOfTasks[id].title = inputTitle.value;
        objOfTasks[id].body = inputBody.value;

        whileDeleteElement(listConteinerCompleted);

        renderAllTasks(objOfTasks);

        $("#editTaskModal").modal("toggle");
      });
    }
  }

  function checkTask(e) {
    if (e.target.classList.contains("check-task")) {
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      deleteRowAllButton();
      objOfTasks[id].completed = true;

      whileDeleteElement(listConteinerCompleted);

      renderAllTasks(objOfTasks);
      //viewMessageEmptyContainer();
    }
  }

  function renderAllTasks(tasksList) {
    if (containerTasks.childElementCount > 0) {
      whileDeleteElement(listConteiner);
    }

    if (!tasksList) {
      console.error("Передайте список задач!");
      return;
    }

    createDelAllButton();

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      if (task.completed === false) {
        const li = listItemTemplate(task);
        fragment.appendChild(li);
        listConteiner.appendChild(fragment);
      }

      if (task.completed === true) {
        const li2 = listItemTemplate(task);
        fragment.appendChild(li2);
        listConteinerCompleted.appendChild(fragment);
      }
    });

    countTask();
  }

  function listItemTemplate({ _id, title, body, completed } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "justify-content-between",
      "mt-2"
    );
    li.setAttribute("data-task-id", _id);

    const div = document.createElement("div");
    div.classList.add("div-icon");

    const span = document.createElement("span");
    span.textContent = title;

    const iTrash = document.createElement("i");
    iTrash.classList.add("fas", "fa-trash", "ml-2", "delete-btn");

    const edit = document.createElement("i");
    edit.classList.add("fas", "fa-edit", "ml-2", "edit-task");

    const rTrash = document.createElement("i");

    const check = document.createElement("i");
    if (completed !== true) {
      check.classList.add("fas", "fa-check", "ml-2", "check-task");
    } else {
      iTrash.classList.add("completed-del");

      rTrash.classList.add("fas", "fa-trash-restore", "restore-to-trash");
    }

    const p = document.createElement("p");
    p.textContent = body;
    p.classList.add("mt-2", "w-100");

    li.appendChild(span);
    li.appendChild(div);
    if (completed !== true) {
      div.appendChild(check);
      div.appendChild(edit);
    } else {
      div.appendChild(rTrash);
    }

    if (completed === false) {
      //div.appendChild(rTrash);
    }

    div.appendChild(iTrash);
    li.appendChild(p);

    return li;
  }

  function onFormsSubmit(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      console.error("Введите данные");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listConteiner.insertAdjacentElement("afterbegin", listItem);
    //document.querySelector(".div-clear-all").hidden = false;
    form.reset();
    countTask();
  }

  function createNewTask(title, body) {
    const newTask = {
      _id: generateId(23),
      completed: false,
      title,
      body,
    };
    objOfTasks[newTask._id] = newTask;

    return { ...newTask };
  }

  function createDelAllButton() {
    if (document.querySelector(".x-clear-all")) {
      //alert("НЕЕТ");
      return;
    }

    listConteinerCompleted.insertAdjacentHTML(
      "afterbegin",
      ` <div class="row justify-content-between div-clear-all">
    <a href="" data-toggle="modal" data-target="#exampleModal" class="ml-auto float-right x-clear-all">
    <span aria-hidden="true" class="x-clear-all">×</span>
    </a>
  </div>`
    );
  }

  function oneDeleteTask(id, target, parent) {
    const { title } = objOfTasks[id];
    createModuleWindow(target, title);
    $("#deleteTask").modal("show");
    document.querySelector(".model-btn-yes").addEventListener("click", (e) => {
      parent.remove();
      delete objOfTasks[id];
      deleteRowAllButton();
      countTask();
    });
  }

  function deleteTaskWithButton(e) {
    if (e.target.classList.contains("delete-btn")) {
      const target = "delete-btn";
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      oneDeleteTask(id, target, parent);
      //parent.remove();
    }
    if (e.target.classList.contains("x-clear-all")) {
      const target = "x-clear-all";
      createModuleWindow(target, (title = "Все"));
      $("#x-clear-all").modal("show");

      document
        .querySelector(".model-btn-yes")
        .addEventListener("click", deleteAllTaskWithButton);

      for (const key in objOfTasks) {
        console.log(objOfTasks[key]);
        if (objOfTasks[key].completed === true) {
          objOfTasks[key] = [];
        }
      }

      deleteRowAllButton();
    }
  }

  function createModuleWindow(target, title) {
    let res = "";

    const data = {
      allTask: {
        title: "Delete Tasks",
        body: "Do you really want delete all Tasks?",
        id: "x-clear-all",
      },
      oneTask: {
        title: `Delete Task : ${title}`,
        body: "Do you really want delete the task?",
        id: "deleteTask",
      },
    };

    target == "delete-btn" ? (res = data.oneTask) : (res = data.allTask);

    containerTasks.insertAdjacentHTML(
      "afterend",
      `
      <div
      class="modal fade"
      id="${res.id}"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              ${res.title}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          ${res.body}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary all-no"
              data-dismiss="modal"
            >
              No
            </button>
            <button
              type="button"
              class="btn btn-primary model-btn-yes"
              data-dismiss="modal"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
      `
    );
  }

  function deleteRowAllButton() {
    const delete_btns = document.querySelectorAll(".completed-del");
    //const delete_btns_complete = document.querySelectorAll(".del");
    //console.log(delete_btns_complete.length);
    if (delete_btns.length == 0) {
      if (document.querySelector(".div-clear-all")) {
        document.querySelector(".div-clear-all").hidden = true;
      }
    }
  }

  function deleteAllTaskWithButton() {
    document.querySelector(".div-clear-all").hidden = true;

    whileDeleteElement(listConteinerCompleted);
    countTask();
  }

  function viewMessageEmptyContainer() {
    const taskAll = listConteiner.childElementCount;
    const taskCompleted = listConteinerCompleted.childElementCount;
    if (taskAll == 0) {
      listConteiner.insertAdjacentHTML(
        "afterbegin",
        ` <div class="row justify-content-between div-empty-message-all">
        <div class="alert alert-primary mx-auto mt-5" role="alert">
        Создайте Task.
      </div>
      </div>`
      );
    }
    if (taskAll > 0) {
      if (document.querySelector(".div-empty-message-all")) {
        document.querySelector(".div-empty-message-all").hidden = true;
      }
    }
    if (taskCompleted == 0) {
      listConteinerCompleted.insertAdjacentHTML(
        "afterbegin",
        ` <div class="row justify-content-between div-empty-message-completed">
        <div class="alert alert-primary mx-auto mt-5" role="alert">
        Нет законченных тасков
      </div>
      </div>`
      );
    }
    if (taskCompleted > 0) {
      if (document.querySelector(".div-empty-message-completed")) {
        document.querySelector(".div-empty-message-completed").hidden = true;
      }
    }
  }

  function whileDeleteElement(elements) {
    while (elements.firstChild) {
      elements.removeChild(elements.firstChild);
    }
  }

  function restoreTrash(e) {
    //console.log(objOfTasks);

    if (e.target.classList.contains("restore-to-trash")) {
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;

      for (const key in objOfTasks) {
        if (objOfTasks[key]._id === id) {
          objOfTasks[key].completed = false;
          whileDeleteElement(listConteinerCompleted);
          renderAllTasks(objOfTasks);
          // console.log(objOfTasks);
        }
      }
    }
  }

  function selectTheme() {
    const value = themeSelect.value;
    setTheme(value);
    localStorage.setItem("set_theme", value);
  }

  function setTheme(name) {
    const selectedThemObj = themes[name];
    Object.entries(selectedThemObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value); ws=]
    });
  }

  function getStorage() {
    const theme = localStorage.getItem("set_theme");
    if (theme) {
      //themeSelect[0].selected = true;
      themeSelect[1].selected = true;
      setTheme(theme);
    }

    return;
  }

  //генерация uuid
  function dec2hex(dec) {
    return ("0" + dec.toString(16)).substr(-2);
  }

  // generateId :: Integer -> String
  function generateId(len) {
    let arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return "5" + Array.from(arr, dec2hex).join("");
  }
})(tasks);
