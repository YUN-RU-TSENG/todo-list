// 引入 Vue ES Module
import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js";

// component
import SvgBucket from "./component/SvgBucket.js";
import SvgChecked from "./component/SvgChecked.js";
import SvgPencil from "./component/SvgPencil.js";
import SvgAdd from "./component/SvgAdd.js";
import BaseTitle from "./component/BaseTitle.js";
import BaseTag from "./component/BaseTag.js";
import BaseInput from "./component/BaseInput.js";
import BaseButton from "./component/BaseButton.js";
import BaseSelect from "./component/BaseSelect.js";
import TodoItem from "./component/TodoItem.js";
import AddCard from "./component/AddCard.js";

const vm = new Vue({
  el: "#app",
  components: {
    "svg-add": SvgAdd,
    "svg-bucket": SvgBucket,
    "svg-pencil": SvgPencil,
    "svg-checked": SvgChecked,
    "base-tag": BaseTag,
    "base-title": BaseTitle,
    "base-input": BaseInput,
    "base-button": BaseButton,
    "base-select": BaseSelect,
    "todo-item": TodoItem,
    "add-card": AddCard,
  },
  data: {
    todo: [
      {
        name: "測試代辦",
        ID: 44948948,
        time: "2021-12-15",
        level: "hight-level",
      },
      {
        name: "測試代辦2",
        ID: 449418948,
        time: "2021-12-25",
        level: "medium-level",
      },
    ],
    // 表單填選的數值
    formToDo: {
      name: "",
      ID: null,
      time: null,
      level: "",
    },
    updateTodoID: "",
    // 表單編輯模式，有 add update 模式
    formToDoMode: "add",
    todoLevelOptions: [
      {
        value: "hight-level",
        text: "高等",
      },
      {
        value: "medium-level",
        text: "中等",
      },
      {
        value: "low-level",
        text: "低等",
      },
    ],
    isFormTodoShow: false,
  },
  computed: {
    tagStyle() {
      return (todoID) => {
        const todo = this.todo.find((item) => item.ID === todoID);
        switch (todo.level) {
          case "hight-level":
            return "blue";
          case "medium-level":
            return "green";
          case "low-level":
            return "orange";
        }
      };
    },
    tagText() {
      return (todoID) => {
        const todo = this.todo.find((item) => item.ID === todoID);
        switch (todo.level) {
          case "hight-level":
            return "重度";
          case "medium-level":
            return "中度";
          case "low-level":
            return "輕度";
        }
      };
    },
    formateDate() {
      return (todoID) => {
        const todo = this.todo.find((item) => item.ID === todoID);
        return dayjs(todo.time).format("YYYY年MM月DD日");
      };
    },
  },
  watch: {
    /**
     * @description 根據現有模式來決定 form 中的 todo 資料，當為 add 時為空，update 時根據 updateID 來顯示淺拷貝資料，會需要設計的原因在於表單需要根據不同模式呈現不同資料故採用此設計
     * 舉例來說：若是按下了 update，則模式該改為 update，formtodo 也會偵測改變為淺拷貝的資料
     *         若是按下了 add 則模式該改為 add，formtodo 會是空值，讓使用者自訂新增 todo
     */
    formToDoMode: {
      immediate: true,
      handler(val) {
        switch (val) {
          case "add":
            return this.initFormTodo()
          case "update":
            return (this.formToDo = {
              ...this.todo.find((item) => item.ID === this.updateTodoID),
            });
        }
      },
    },
  },
  methods: {
    addTodo() {
      this.todo.push({ ...this.formToDo, ID: Date.now() });
    },
    updateTodo(todoID) {
      const index = this.todo.findIndex((item) => item.ID === todoID);
      this.todo.splice(index, 1, this.formToDo);
    },
    deleteTodo(index) {
      this.todo.splice(index, 1);
    },
    initFormTodo() {
      this.formToDo = {
        name: "",
        ID: null,
        time: null,
        level: "",
      };
    },
    // ! 開關 todoForm，這裡統一將 toggleFormTodo 採用 expression 方式寫在 @event="" 中，不寫在 add 中，減少耦合
    toggleFormTodo(isOpen) {
      this.isFormTodoShow = isOpen;
    },
    /**
     * @description 更新表單模式，表單有 add、update 模式，根據不同的模式，formTodo 中會呈現不同的資料
     * @param {String} formToDoMode 可以填入 add、update
     * @param {Number} todoID 當下選中的 todoID，當為 update 模式的時候再行填入
     */
    updateFormMode(formToDoMode = 'add', todoID = null) {
      this.formToDoMode = formToDoMode;
      this.updateTodoID = todoID ? todoID : '';
    },
    /**
     * @description 表單會透過 formTodoMode 決定目前是要執行新增、修改 todo 項目，兩者執行的程式碼不同，add 代表執行新增、update 代表執行修改
     */
    // ! 有無更好的命名？
    handler() {
      if (this.formToDoMode === "add") this.addTodo();
      else if (this.formToDoMode === "update") this.updateTodo(this.updateTodoID);
    },
  },
  template: `
    <main id="app">
        <base-title tag="h1" level="primary" class="todo-title">待辦清單</base-title>
        <todo-item class="todo" v-for="(item, index) of todo" :key="item.ID">
            <base-tag :color="tagStyle(item.ID)">{{ tagText(item.ID) }}</base-tag>
            <base-title tag="h2" level="secondary">{{ item.name }}</base-title>
            <base-title tag="p" level="third">{{ formateDate(item.ID) }}</base-title>
            <button @click="deleteTodo(index)"><svg-bucket/></button>
            <button @click="updateFormMode('update', item.ID),toggleFormTodo(true)"><svg-pencil/></button>
            <button @click=""><svg-checked/></button>
        </todo-item>
        <add-card class="add-card"
                v-show="isFormTodoShow"
                @submit="handler(), toggleFormTodo(false)">
            <base-title tag="h2"
                        level="primary"
                        :isDark="true">ADD TODO</base-title>
            <base-input label="事項"
                        required
            type="text" v-model="formToDo.name"/>
            <base-select label="重要程度"
                            v-model="formToDo.level"
                        required
                        name="level"
                        :options="todoLevelOptions"/>
            <base-input label="代辦時間"
                        required
                        type="date"
                        v-model="formToDo.time"/>
            <div class="add-card-buttons">
                <base-button level="secondary"
                        type="button"
                        @click.native="toggleFormTodo(false), updateFormMode('add')">Cancel</base-button>
                <base-button level="primary"
                        type="submit"
                        v-if="formToDoMode === 'update'">Update</base-button>
                <base-button level="primary"
                        type="submit"
                        v-if="formToDoMode === 'add'">ADD</base-button>
            </div>
        </add-card>
        <button class="add" @click="toggleFormTodo(true), updateFormMode('add')"><svg-add/></button>
    </main>`,
});
