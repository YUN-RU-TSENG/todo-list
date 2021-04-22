"use strict";

// DOM 節點均為 $ 開頭
const $form = document.querySelector("form");
const $formAdd = document.querySelector(".form-add");
const $formUpdate = document.querySelector(".form-update");
const $formCancel = document.querySelector(".form-cancel");
const $inputTime = document.querySelector("input.time");
const $inputText = document.querySelector("input.text");
const $selectLevel = document.querySelector("select.level");
const $todoWrapper = document.querySelector("div.todo-wrapper");
const $addTodo = document.querySelector("button.add");

//  狀態
const state = {
  todo: [
    // {
    //   time: "2020-03-03",
    //   text: "test",
    //   level: "hight-level",
    //   id: 123434,
    // },
  ],
  cacheTodo: {},
  editMode: "add",
};

// proxy handler，當頁面狀態變動涉及重新渲染的 side-effect 時，會透過該 handler 做設定處理。
const handler = {
  get(target, prop, receiver) {
    // 當為 todo 時，設置回傳 new Proxy 以偵測到 Array.push()、Array.splice() 變動，一旦變動 todo，頁面重新渲染 todo DOM 部分
    if (prop === "todo")
      return new Proxy(Reflect.get(...arguments), {
        set() {
          Reflect.set(...arguments);
          renderTodo();
          return true;
        },
      });
    return Reflect.get(...arguments);
  },
  set(target, prop, value) {
    Reflect.set(...arguments);
    // 更動 edit 模式，form 表單按鈕呈現對應的岸鳥
    if (prop === "editMode") {
      $formAdd.style.display = value === "add" ? "inline-block" : "none";
      $formUpdate.style.display = value === "update" ? "inline-block" : "none";
      // 更動 cacheTodo 為空，form 表單 input 也會重新清空
    } else if (prop === "cacheTodo") {
      $inputText.value = value.text ?? "";
      $inputTime.value = value.time ?? "";
      $selectLevel.value = value.level ?? "";
    }

    return true;
  },
};

// 設置物件代理，有關於資料改變涉及的頁面渲染會透過此運作
let proxyData = new Proxy(state, handler);

// 當更改、刪除事件時，會透過事件代理半段元素上的 data-edit 狀態決定刪除、修改當前元素
function editTodo(e) {
  if (e.target.dataset.edit === "update") {
    proxyData.cacheTodo = {
      ...proxyData.todo.find((item) => item.id == e.target.dataset.id),
    };
    updateEditMode("update");
    toggleElement("form");
  } else if (e.target.dataset.edit === "delete") {
    deleteTodo(e.target.dataset.id);
  }
}

function submit(e) {
  e.preventDefault();

  if (proxyData.editMode === "add") addTodo(proxyData.cacheTodo);
  else updateTodo(proxyData.cacheTodo);

  resetCacheTodo();
  toggleElement("form");
}

// bind input value 到 cacheTodo 中
function updateInputValue(data) {
  return function (e) {
    proxyData.cacheTodo[data] = e.target.value;
  };
}

function updateEditMode(mode) {
  proxyData.editMode = mode;
}

function renderTodo() {
  const list = document.querySelector("div.todo-wrapper");
  const item = ({ time, text, level, id }) => `
                  <section class="todo">
                      <span class="tag ${tagStyle(level)}">${tagText(level)}</span>
                      <h2 class="secondary title">${text}</h2>
                      <p class="third title">${time}</p>
                      <button>
                          <img src ="./images/bucket.svg" data-id="${id}" data-edit="delete">
                      </button>
                      <button >
                          <img src ="./images/pencil.svg" data-id="${id}" data-edit="update">
                      </button>
                      <button>
                          <img src ="./images/checked.svg" data-id="${id}" data-edit="update">
                      </button>
                  </section >`;
  const noItem = `
                  <section class="todo">
                      <h2 class="secondary title">尚無代辦事項，請新增。✏️</h2>
                  </section>`;

  const $item = proxyData.todo.length
    ? proxyData.todo.map((todo) => item(todo)).join("")
    : noItem;

  list.innerHTML = $item;
}

function toggleElement(element) {
  const $element = document.querySelector(element);

  if ($element.style.display === "block") $element.style.display = "none";
  else $element.style.display = "block";
}

function resetCacheTodo() {
  proxyData.cacheTodo = {};
}

function addTodo(newTodo) {
  proxyData.todo.push({ ...newTodo, id: Date.now() });
}

function deleteTodo(id) {
  const index = proxyData.todo.findIndex((item) => item.id === Number(id));
  proxyData.todo.splice(index, 1);
}

function updateTodo(newTodo) {
  const index = proxyData.todo.findIndex((item) => item.id == newTodo.id);
  proxyData.todo.splice(index, 1, newTodo);
}

function tagStyle(todoLevel) {
  switch (todoLevel) {
    case "hight-level":
      return "blue";
    case "medium-level":
      return "green";
    case "low-level":
      return "orange";
  }
}

function tagText(todoLevel) {
  switch (todoLevel) {
    case "hight-level":
      return "重度";
    case "medium-level":
      return "中度";
    case "low-level":
      return "輕度";
  }
}

// 初始渲染後，針對空資料進行首次渲染
window.addEventListener("load", renderTodo);
$todoWrapper.addEventListener("click", editTodo);
$addTodo.addEventListener(
  "click",
  () => (updateEditMode("add"), toggleElement("form"))
);
$form.addEventListener("submit", submit);
$formCancel.addEventListener(
  "click",
  () => (toggleElement("form"), resetCacheTodo())
);
$inputText.addEventListener("input", updateInputValue("text"));
$inputTime.addEventListener("input", updateInputValue("time"));
$selectLevel.addEventListener("input", updateInputValue("level"));
