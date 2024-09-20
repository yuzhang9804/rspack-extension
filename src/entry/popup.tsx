import { createRoot } from 'react-dom/client'
import { App } from '@/components/App'
import '@radix-ui/themes/styles.css'
import '../index.css'

const dom = document.getElementById('root')
createRoot(dom!).render(<App />)
