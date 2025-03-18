import { createApp } from 'vue'
import App from './App.vue'
import { Button, Input, Form, Tabs, Card, Spin, Empty, Checkbox } from 'ant-design-vue'
import '@/assets/index.scss'

const app = createApp(App)
const elements = [Button, Input, Form, Tabs, Card, Spin, Empty, Checkbox]
elements.forEach((element) => app.use(element))

app.mount('#app')
