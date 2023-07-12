// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { Auth0Client } from './composables/auth0'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App).use(Auth0Client)

registerPlugins(app)

app.mount('#app')
