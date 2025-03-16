
export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-3 sm:p-4">
      <div className="container mx-auto text-center">
        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} TodoApp. All rights reserved. Developed
          by Seid.
        </p>
      </div>
    </footer>
  );
}