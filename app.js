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

  renderAllTasks(objOfTasks);

  form.addEventListener("submit", onFormsSubmit);

  containerTasks.addEventListener("click", checkTask);

  containerTasks.addEventListener("click", deleteTaskWithButton);

  function checkTask(e) {
    if (e.target.classList.contains("check-task")) {
      const parent = e.target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      deleteRowAllButton();

      objOfTasks[id].completed = true;

      while (listConteinerCompleted.firstChild) {
        listConteinerCompleted.removeChild(listConteinerCompleted.firstChild);
      }

      renderAllTasks(objOfTasks);
    }
  }

  function renderAllTasks(tasksList) {
    if (containerTasks.childElementCount > 0) {
      while (listConteiner.firstChild) {
        listConteiner.removeChild(listConteiner.firstChild);
      }
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
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    li.setAttribute("data-task-id", _id);

    const span = document.createElement("span");
    span.textContent = title;

    const iTrash = document.createElement("i");
    iTrash.classList.add("fas", "fa-trash", "ml-2", "delete-btn");

    const check = document.createElement("i");
    check.classList.add("fas", "fa-check", "ml-auto", "check-task");

    const p = document.createElement("p");
    p.textContent = body;
    p.classList.add("mt-2", "w-100");

    li.appendChild(span);
    li.appendChild(check);
    li.appendChild(iTrash);
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
    document.querySelector(".div-clear-all").hidden = false;
    form.reset();
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
      return;
    }
    containerTasks.insertAdjacentHTML(
      "afterbegin",
      ` <div class="row justify-content-between div-clear-all">
    <a href="" data-toggle="modal" data-target="#exampleModal" class="ml-auto float-right x-clear-all">
    <span aria-hidden="true" class="x-clear-all">×</span>
    </a>
  </div>`
    );
  }

  function oneDeleteTask(id, target, parent) {
    console.log(objOfTasks);
    const { title } = objOfTasks[id];
    createModuleWindow(target, title);
    $("#deleteTask").modal("show");
    document.querySelector(".model-btn-yes").addEventListener("click", (e) => {
      parent.remove();
      delete objOfTasks[id];
      deleteRowAllButton();
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
      objOfTasks = [];
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
    const delete_btns = document.querySelectorAll(".delete-btn");
    //console.log(delete_btns.length);
    if (delete_btns.length == 0) {
      if (document.querySelector(".div-clear-all")) {
        document.querySelector(".div-clear-all").hidden = true;
      }
    }
  }

  function deleteAllTaskWithButton() {
    document.querySelector(".div-clear-all").hidden = true;
    while (listConteiner.firstChild) {
      listConteiner.removeChild(listConteiner.firstChild);
    }
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
