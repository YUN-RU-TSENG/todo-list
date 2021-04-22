# todo Vanilla JS

## 主題：

製作具 CRUD 的 Vanilla JS todo 項目。

## 準備知識：
- proxy

## 開始製作：
### 步驟一 設置 todo CRUD
透過 proxy，代理 application 的 state，使 state 更動  `[[set]]` 執行重新渲染畫面 side effect `renderTodo()`。這樣便可以不用每次更新資料後皆須在程式碼中再寫下 `renderTodo()`，可以透過 `proxy` `set` 執行此行為。

同時一併寫下待會會使用的 CRUD 方法。

這樣 CRUD todo 部分便完成了。

```javascript
//  1. 設定狀態
const state = {
  todo: [
    // {
    //   time: "2020-03-03",
    //   text: "test",
    //   level: "hight-level",
    //   id: 123434,
    // },
  ],
};

// proxy handler，當頁面狀態變動涉及重新渲染的 side-effect 時，會透過該 handler 做設定處理。
const handler = {
  get(target, prop, receiver) {
    // 當為 todo 時，設置回傳 new Proxy 以偵測到 Array.push()、Array.splice() 變動，一旦變動 todo，頁面重新渲染 todo DOM
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
};

// 設置物件代理
let proxyData = new Proxy(state, handler);

function renderTodo() {
  const list = document.querySelector("div.todo-wrapper");
  const item = ({ time, text, level, levelText, id }) => `
                  <section class="todo">
                      <span class="tag ${level}">${levelText}</span>
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
```

**🔺 注意：**

你會在此注意到 `proxyData.todo.push({...})` 無法被 `[[set]]` 捕獲，這是由於 `proxyData.todo.push({...})` 實際上執行以下行為：

1. `[[get]]` 讀取 `proxyData.todo`
2. 接著對求得 value 的 `proxyData.todo` 執行寫入 `[[set]]` 對 `Array` 添加 `new` `property`

這時候可以設置 `proxy` `[[get]]` 遇到 `property` 為 `Object` 便返回 `new Proxy(Reflect.get(...arguments), handler)`， `proxyData.todo.push({...})` 可被 `[[set]` 捕獲。[資料][1]

[1]: https://gomakethings.com/how-to-detect-changes-to-nested-arrays-and-objects-inside-a-proxy/ (How to detect changes to nested arrays and objects inside a Proxy)

### 步驟二 表單修改 todo 狀態
表單可以新增、更改 todo，顯示的模式為：新增、修改，依照 `editMode` 值，一旦更改模式，表單便重新渲染。

表單開啟時顯示的快取資料分為兩種：修改、新增，需要依照新增、修改行為更改 `cacheTodo`。並且要將此數值與 `input` bind。

```javascript
"use strict";

//  狀態
const state = {
  todo: [
    // {
    //   time: "2020-03-03",
    //   text: "test",
    //   level: "hight-level",
    //   levelText: "重要",
    //   id: 123434,
    // },
  ],
  cacheTodo: {},
  editMode: "add",
};

// proxy handler，當頁面狀態變動涉及重新渲染的 side-effect 時，會透過該 handler 做設定處理。
const handler = {
  get(target, prop, receiver) {
    ...
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

function toggleElement(element) {
  const $element = document.querySelector(element);

  if ($element.style.display === "block") $element.style.display = "none";
  else $element.style.display = "block";
}

```

接著將以上功能綁定到 DOM 中即完成。

## 學習

### proxy

### setAttribute
可以設置 element 屬性
```javascript
Element.setAttribute(name, value)
```

和 element.style.display = '' 無使用上的明顯差異。
[When to use setAttribute vs .attribute= in JavaScript? - Stack Overflow](https://stackoverflow.com/questions/3919291/when-to-use-setattribute-vs-attribute-in-javascript/36581696#36581696)


### DocumentFragment

輕量的 `Documemt` API，對於 `DocumentFragment` 的操作不會直接影響到 `Document`，也不會觸發渲染、耗費效能。

普通和 `appendChild` 應用，只會插入 `DocumentFragment` 子節點而非其本身，並且多個子結點會一次被插入，不會多次重新渲染。

一次插入多個 `li` 至 `ul` 中：
```javascript
const list = ['apple', 'banana', 'pie']
const $ul = document.querySelector('ul')
const $fragment = document.createDocumentFragment()

list.forEach(item =>
{
    const $li = document.createElement('li')
    $li.innerHTML = item
    $fragment.appendChild($li)
})

$ul.appendChild($fragment)
```

[DocumentFragment - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)

### append vs appendChild

結論：用 `append` 更好。

#### append

在現有元素插入最後的子節點，可以一次插入多個節點、DomString（Text 節點）

```
append(...[DomString|Node])
```

#### appendChild

在現有元素插入一個最後的子節點，插入一個節點，且只能插入 `Node`

```
appendChild(node)
```