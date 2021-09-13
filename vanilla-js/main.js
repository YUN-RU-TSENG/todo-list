// DOM 節點均為 $ 開頭
const $form = document.querySelector('form')
const $formAdd = document.querySelector('.form-add')
const $formUpdate = document.querySelector('.form-update')
const $formCancel = document.querySelector('.form-cancel')
const $inputTime = document.querySelector('input.time')
const $inputText = document.querySelector('input.text')
const $selectLevel = document.querySelector('select.level')
const $todoWrapper = document.querySelector('div.todo-wrapper')
const $addTodo = document.querySelector('button.add')
const $finishTodo = document.querySelector('button.finish')

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
  cacheTodo: {
    time: null,
    text: null,
    level: null,
    id: null,
    finish: false,
  },
  editMode: 'add',
}

// proxy handler，rerender DOM
const handler = {
  get(_, prop) {
    if (prop === 'todo')
      return new Proxy(Reflect.get(...arguments), {
        set() {
          Reflect.set(...arguments)
          renderTodo()
          return true
        },
      })
    return Reflect.get(...arguments)
  },
  set(_, prop, value) {
    Reflect.set(...arguments)
    // 更動 edit 模式，form 表單按鈕呈現對應的按鈕
    if (prop === 'editMode') {
      $formAdd.style.display = value === 'add' ? 'inline-block' : 'none'
      $formUpdate.style.display = value === 'update' ? 'inline-block' : 'none'
      // 更動 cacheTodo 為空，form 表單 input 也會重新清空
    } else if (prop === 'cacheTodo') {
      $inputText.value = value.text ?? ''
      $inputTime.value = value.time ?? ''
      $selectLevel.value = value.level ?? ''
    }

    return true
  },
}

// 設置物件代理，有關於資料改變涉及的頁面渲染會透過此運作
let proxyData = new Proxy(state, handler)

// 限制 date input min date
$inputTime.min = dayjs().format('YYYY-MM-DD')

window.addEventListener('load', renderTodo)
$todoWrapper.addEventListener('click', editTodo)
$todoWrapper.addEventListener('click', finishTodoItem)
$addTodo.addEventListener(
  'click',
  () => (updateEditMode('add'), toggleElement('form'))
)
$form.addEventListener('submit', submit)
$formCancel.addEventListener(
  'click',
  () => (toggleElement('form'), resetCacheTodo())
)
$inputText.addEventListener('input', updateInputValue('text'))
$inputTime.addEventListener('input', updateInputValue('time'))
$selectLevel.addEventListener('input', updateInputValue('level'))

// 當更改、刪除事件時，會透過事件代理判斷元素上的 data-edit 狀態決定刪除、修改當前元素
function editTodo(e) {
  if (e.target.dataset.edit === 'update') {
    proxyData.cacheTodo = {
      ...proxyData.todo.find((item) => item.id == e.target.dataset.id),
    }

    updateEditMode('update')
    toggleElement('form')
  } else if (e.target.dataset.edit === 'delete') {
    deleteTodo(e.target.dataset.id)
  }
}

function finishTodoItem(e) {
  if (e.target.dataset.edit === 'finish') {
    const index = proxyData.todo.findIndex(
      (item) => item.id == e.target.dataset.id
    )
    proxyData.todo[index] = {
      ...proxyData.todo[index],
      finish: !proxyData.todo[index].finish,
    }
  }
}

function submit(e) {
  e.preventDefault()

  if (proxyData.editMode === 'add') addTodo(proxyData.cacheTodo)
  else updateTodo(proxyData.cacheTodo)

  resetCacheTodo()
  toggleElement('form')
}

// bind input value 到 cacheTodo 中
function updateInputValue(data) {
  return function (e) {
    proxyData.cacheTodo[data] = e.target.value
  }
}

function updateEditMode(mode) {
  proxyData.editMode = mode
}

function renderTodo() {
  const list = document.querySelector('div.todo-wrapper')
  const item = ({ time, text, level, id, finish }) => `
    <section class="todo ${finish ? 'finish' : ''}">
        <span class="tag ${tagStyle(level)}">${tagText(level)}</span>
        <h2 class="secondary title">${text}</h2>
        <p class="third title">${dayjs(time).format('YYYY-MM-DD')}</p>
        <button>
            <img src ="./images/bucket.svg" data-id="${id}" data-edit="delete">
        </button>
        <button >
            <img src ="./images/pencil.svg" data-id="${id}" data-edit="update">
        </button>
        <button>
            <img src ="./images/checked.svg" data-id="${id}" data-edit="finish">
        </button>
    </section >`

  const noItem = `
    <section class="todo">
        <h2 class="secondary title">尚無代辦事項，請新增。✏️</h2>
    </section>`

  const $item = proxyData.todo.length
    ? proxyData.todo.map((todo) => item(todo)).join('')
    : noItem

  list.innerHTML = $item
}

function toggleElement(element) {
  const $element = document.querySelector(element)

  if ($element.style.display === 'block') $element.style.display = 'none'
  else $element.style.display = 'block'
}

function resetCacheTodo() {
  proxyData.cacheTodo = {
    time: null,
    text: null,
    level: null,
    id: null,
    finish: false,
  }
}

function addTodo(newTodo) {
  proxyData.todo.push({ ...newTodo, id: Date.now() })
}

function deleteTodo(id) {
  const index = proxyData.todo.findIndex((item) => item.id === Number(id))
  proxyData.todo.splice(index, 1)
}

function updateTodo(newTodo) {
  const index = proxyData.todo.findIndex((item) => item.id == newTodo.id)
  proxyData.todo.splice(index, 1, newTodo)
}

function tagStyle(todoLevel) {
  switch (todoLevel) {
    case 'hight-level':
      return 'blue'
    case 'medium-level':
      return 'green'
    case 'low-level':
      return 'orange'
  }
}

function tagText(todoLevel) {
  switch (todoLevel) {
    case 'hight-level':
      return '重度'
    case 'medium-level':
      return '中度'
    case 'low-level':
      return '輕度'
  }
}
