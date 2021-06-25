import { ref, nextTick } from "vue";

export default function(isShow) {
  const todo = ref([]);
  const editMode = ref("add");
  const cacheTodo = ref({ name: "", ID: null, time: null, finish: false });

  const submitTodo = async () => {
    if (editMode.value === "update") updateTodo();
    if (editMode.value === "add") addTodo();

    resetCacheTodo();
    nextTick(() => {
      isShow.value = false;
    });
  };

  const cancelSubmitTodo = () => {
    isShow.value = false;
    resetCacheTodo();
    updateEditMode("add");
  };

  const editTodo = index => {
    updateCacheTodo(index);
    updateEditMode("update");

    nextTick(() => (isShow.value = true));
  };

  const updateTodoFinish = index => {
    todo.value[index].finish = !todo.value[index].finish;
  };

  const updateEditMode = mode => {
    editMode.value = mode;
  };

  const resetCacheTodo = () => {
    cacheTodo.value = { name: "", ID: null, time: null };
  };

  const updateCacheTodo = index => {
    const currentTodo = { ...todo.value[index] };
    cacheTodo.value = currentTodo;
  };

  const addTodo = () => {
    todo.value.push({ ...cacheTodo.value, ID: Date.now().toString() });
  };

  const updateTodo = () => {
    const index = todo.value.findIndex(item => item.ID === cacheTodo.value.ID);
    todo.value.splice(index, 1, { ...cacheTodo.value });
  };

  const deleteTodo = index => {
    todo.value.splice(index, 1);
  };

  return {
    todo,
    editTodo,
    deleteTodo,
    updateTodoFinish,
    updateEditMode,
    submitTodo,
    cancelSubmitTodo,
    cacheTodo,
    editMode
  };
}
