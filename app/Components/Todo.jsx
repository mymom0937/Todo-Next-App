import React, { memo } from "react";
import { FaTrash, FaCheck, FaCalendarAlt, FaFlag, FaUndo, FaSpinner } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const Todo = ({
  id,
  title,
  description,
  dueDate,
  priority,
  complete,
  mongoId,
  deleteTodo,
  completeTodo,
  isDisabled
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Get priority styles and icon
  const getPriorityStyles = () => {
    switch (priority) {
      case "high":
        return {
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-700 dark:text-red-400",
          borderColor: "border-red-200 dark:border-red-800"
        };
      case "medium":
        return {
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-700 dark:text-yellow-400",
          borderColor: "border-yellow-200 dark:border-yellow-800"
        };
      case "low":
        return {
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-700 dark:text-green-400",
          borderColor: "border-green-200 dark:border-green-800"
        };
      default:
        return {
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-700 dark:text-gray-400",
          borderColor: "border-gray-200 dark:border-gray-700"
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  return (
    <tr className={`block lg:table-row ${complete ? 'bg-gray-50 dark:bg-gray-800/50' : 'odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-800/80'} border-b-4 lg:border-b border-gray-300 lg:border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition duration-200`}>
      {/* ID Column */}
      <th
        scope="row"
        className="block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap relative lg:static pl-[50%] lg:pl-6 text-left before:content-['ID'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[5%] lg:min-w-[60px]"
      >
        {id}
      </th>

      {/* Title Column */}
      <td
        className={`block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 text-gray-900 dark:text-gray-200 relative lg:static pl-[50%] lg:pl-6 text-left before:content-['TITLE'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[15%] lg:min-w-[150px] ${
          complete ? "line-through opacity-70" : ""
        }`}
      >
        <span className="break-words">{title || "No Title"}</span>
      </td>

      {/* Description Column */}
      <td
        className={`block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 text-gray-900 dark:text-gray-200 relative lg:static pl-[50%] lg:pl-6 text-left before:content-['DESCRIPTION'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[30%] lg:min-w-[300px] ${
          complete ? "line-through opacity-70" : ""
        }`}
      >
        <span className="break-words">{description || "No Description"}</span>
      </td>

      {/* Due Date Column */}
      <td className="block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 text-gray-900 dark:text-gray-200 relative lg:static pl-[50%] lg:pl-6 text-left before:content-['DUE_DATE'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[12%] lg:min-w-[120px]">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          <span className={`${complete ? "line-through opacity-70" : ""}`}>
            {dueDate ? formatDate(dueDate) : "No due date"}
          </span>
        </div>
      </td>

      {/* Priority Column */}
      <td className="block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 text-gray-900 dark:text-gray-200 relative lg:static pl-[50%] lg:pl-6 text-left before:content-['PRIORITY'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[10%] lg:min-w-[100px]">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles.bgColor} ${priorityStyles.textColor} ${priorityStyles.borderColor} border`}>
          <FaFlag />
          {priority || "Medium"}
        </span>
      </td>

      {/* Status Column */}
      <td className="block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 text-gray-900 dark:text-gray-200 relative lg:static pl-[50%] lg:pl-6 text-left before:content-['STATUS'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[8%] lg:min-w-[80px]">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          complete 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }`}>
          {complete ? "Completed" : "Pending"}
        </span>
      </td>

      {/* Actions Column */}
      <td className="block lg:table-cell px-2 lg:px-6 py-2 lg:py-4 text-gray-900 dark:text-gray-200 relative lg:static pl-[50%] lg:pl-6 text-left before:content-['ACTIONS'] before:absolute before:left-2 before:top-2 lg:before:content-none lg:w-[15%] lg:min-w-[180px]">
        <div className="flex flex-nowrap items-center gap-2">
          {isDisabled ? (
            <div className="p-2 rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed">
              <FaSpinner className="animate-spin" />
            </div>
          ) : (
            <>
              <button
                onClick={() => deleteTodo(mongoId)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Delete todo"
                disabled={isDisabled}
              >
                <FaTrash />
              </button>

              {complete ? (
                <button
                  onClick={() => completeTodo(mongoId)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  title="Mark as pending"
                  disabled={isDisabled}
                >
                  <FaUndo />
                </button>
              ) : (
                <button
                  onClick={() => completeTodo(mongoId)}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  title="Mark as completed"
                  disabled={isDisabled}
                >
                  <FaCheck />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Optimize with memo to prevent unnecessary re-renders
// Only re-render if props change
export default memo(Todo, (prevProps, nextProps) => {
  // Custom comparison function to optimize when to re-render
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.dueDate === nextProps.dueDate &&
    prevProps.priority === nextProps.priority &&
    prevProps.complete === nextProps.complete &&
    prevProps.mongoId === nextProps.mongoId &&
    prevProps.isDisabled === nextProps.isDisabled
    // We don't compare the functions as they're created on each render
  );
});