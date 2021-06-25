export default {
  name: 'BaseButton',
  template: `
    <button class="button" :class="[level]"><slot></slot></button>
    `,
  props: {
    level: {
      type: String,
      required: true,
      validation(val) {
        return ['primary', 'secondary'].includes(val)
      },
    },
  },
}
