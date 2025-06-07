import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace '<YOUR_REPOSITORY_NAME>' with the name of your GitHub repository.
  // If your GitHub Pages URL is https://<username>.github.io/<YOUR_REPOSITORY_NAME>/
  // then base should be '/<YOUR_REPOSITORY_NAME>/'.
  // If your repository is named <username>.github.io (a user/org page),
  // then base should be '/'.
  base: '/vishnu-sahasranamam/',
})