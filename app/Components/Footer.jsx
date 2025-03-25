
export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-3 sm:p-4">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-md font-semibold">© {new Date().getFullYear()}, Seid E.</p>
      </div>
    </footer>
  );
}
