export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <p>© {new Date().getFullYear()} FoodDash. All rights reserved.</p>
        <div className="flex gap-4">
          <a className="hover:text-primary-600" href="#">Terms</a>
          <a className="hover:text-primary-600" href="#">Privacy</a>
          <a className="hover:text-primary-600" href="#">Help</a>
        </div>
      </div>
    </footer>
  )
}
