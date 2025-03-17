
export default function Button({ children, className }) {
  // Removed => syntax error
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
}