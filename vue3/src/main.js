import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from './components/base/BaseButton.vue'
import BaseTitle from './components/base/BaseTitle.vue'
import BaseInput from './components/base/BaseInput.vue'
import BaseTag from './components/base/BaseTag.vue'
import BaseSelect from './components/base/BaseSelect.vue'

const app = createApp(App)

app.component('BaseButton', BaseButton)
app.component('BaseTitle', BaseTitle)
app.component('BaseInput', BaseInput)
app.component('BaseTag', BaseTag)
app.component('BaseSelect', BaseSelect)

app.mount('#app')
