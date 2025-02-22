import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), checker({ typescript: true })],
  server: {
    open: true,
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          datePicker: ['@mui/x-date-pickers'],
          fullcalendar: [
            '@fullcalendar/core',
            '@fullcalendar/interaction',
            '@fullcalendar/timegrid',
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/rrule',
          ],
          icons: ['@mui/icons-material'],
          firebaseApp: ['firebase/app'],
          firebaseAuth: ['firebase/auth'],
          firebaseFirestore: ['firebase/firestore'],
          state: ['zustand', 'zod'],
          chore: ['sonner', '@zl-asica/react'],
        },
      },
    },
  },
})
