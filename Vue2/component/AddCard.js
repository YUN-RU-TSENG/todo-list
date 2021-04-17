export default {
  name: "AddCard",
  template: `
    <form class="add-card" @submit.prevent="$emit('submit')"><slot></slot></form>
    `,
};
