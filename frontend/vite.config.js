import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server:{
    //   proxy: {
    //   // Any request starting with /api will be sent to the backend
    //   '/api': {
    //     target: "http://http://192.168.1.20:3000",
    //     changeOrigin: true,
    //   }
    // }
    cors: true,
}
})
