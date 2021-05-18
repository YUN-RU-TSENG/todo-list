
<template>
  <form class="add-card"
        @submit.prevent="$emit('submit')">
    <BaseTitle tag="h2"
               level="primary"
               :isDark="true">ADD TODO</BaseTitle>
    <BaseInput label="事項"
               required
               type="text"
               :value="name"
               @update:value="$emit('update:name', $event)" />
    <BaseSelect label="重要程度"
                required
                name="level"
                :value="level"
                :options="options"
                @update:value="$emit('update:level', $event)" />
    <BaseInput label="代辦時間"
               required
               type="date"
               :value="time"
               @update:value="$emit('update:time', $event)" />
    <div class="add-card-buttons">
      <BaseButton level="secondary"
                  type="button"
                  @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton level="primary"
                  v-if="editMode === 'update'"
                  type="submit">Update</BaseButton>
      <BaseButton level="primary"
                  v-if="editMode === 'add'"
                  type="submit">ADD</BaseButton>
    </div>
  </form>
</template>

<script>
  export default {
    name: 'AddCard',
    props: {
      level: {
        required: true,
      },
      name: {
        required: true,
      },
      time: {
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      editMode: {
        type: String,
        required: true,
      },
    },
    emits: ['submit', 'update:level', 'update:name', 'update:time'],
  };
</script>

<style lang="scss" scoped>
  .add-card {
    background: #eeeeee 0% 0% no-repeat padding-box;
    border-radius: 4px;
    padding: 36px 24px;
    width: 90%;
    height: 475px;
    position: fixed;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    @media (min-width: 576px) {
      width: 420px;
    }

    ::v-deep(.title) {
      text-align: left;
      margin-bottom: 43px;
    }

    ::v-deep(label) {
      margin-bottom: 18px;
    }

    ::v-deep(.add-card-buttons) {
      text-align: right;
      button:first-child {
        margin-right: 4px;
      }
    }
  }
</style>
