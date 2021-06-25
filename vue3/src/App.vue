<template>
  <main class="wrapper">
    <BaseTitle tag="h1" level="primary" class="todo-title">待辦清單</BaseTitle>
    <BaseTitle v-if="!todo.length" tag="h2" level="secondary">
      尚無代辦事項，請新增。✏️
    </BaseTitle>
    <template v-else>
      <TodoItem
        v-for="(item, index) of todo"
        v-bind="item"
        @finishTodo="updateTodoFinish(index)"
        @deleteTodo="deleteTodo(index)"
        @editTodo="editTodo(index)"
        :key="item.ID"
      />
    </template>
    <AddCard
      v-show="isShow"
      v-model:name="cacheTodo.name"
      v-model:level="cacheTodo.level"
      v-model:time="cacheTodo.time"
      :minDate="minDate"
      :editMode="editMode"
      :options="levelOption"
      @cancel="cancelSubmitTodo"
      @submit="submitTodo"
    />
    <button class="add" @click="toggleShow(), updateEditMode('add')">
      <svg-add />
    </button>
  </main>
</template>

<script>
import SvgAdd from "./components/SvgAdd.vue";
import AddCard from "./components/AddCard.vue";
import TodoItem from "./components/TodoItem.vue";

import dayjs from "dayjs";
import useTodo from "./composables/useTodo";
import useToggleForm from "./composables/useToggleForm";

export default {
  name: "app",
  components: {
    SvgAdd,
    TodoItem,
    AddCard
  },
  setup() {
    const { toggleShow, isShow } = useToggleForm();
    const {
      todo,
      submitTodo,
      cancelSubmitTodo,
      deleteTodo,
      editTodo,
      cacheTodo,
      editMode,
      updateEditMode,
      updateTodoFinish
    } = useTodo(isShow);

    return {
      todo,
      submitTodo,
      deleteTodo,
      editTodo,
      cacheTodo,
      cancelSubmitTodo,
      editMode,
      updateTodoFinish,
      updateEditMode,
      isShow,
      toggleShow,
      levelOption: [
        {
          value: "hight-level",
          text: "高等"
        },
        {
          value: "medium-level",
          text: "中等"
        },
        {
          value: "low-level",
          text: "低等"
        }
      ],
      minDate: dayjs().format("YYYY-MM-DD")
    };
  }
};
</script>

<style lang="scss">
@import "./assets/style/base/reset";
</style>

<style lang="scss" scoped>
.wrapper {
  width: 95%;
  margin: auto;
  padding-top: 48px;
  min-height: 100vh;
  position: relative;
  @media (min-width: 576px) {
    width: 540px;
  }
  @media (min-width: 768px) {
    width: 608px;
  }
}

.todo-title {
  margin-bottom: 12px;
}

button.add {
  background: #24c3c2 0% 0% no-repeat padding-box;
  border-radius: 60px;
  position: fixed;
  width: 60px;
  height: 60px;
  right: 32px;
  bottom: 72px;
  border: none;
  cursor: pointer;
  z-index: 9;
  svg {
    width: 32px;
  }
}
</style>
