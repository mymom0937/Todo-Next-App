
import React from "react";

const Todo = ({
  id,
  title,
  description,
  complete,
  mongoId,
  deleteTodo,
  completeTodo,
}) => {
  return (
    <tr className="block lg:flex lg:flex-nowrap odd:bg-white even:bg-gray-50 border-b-4 border-gray-300 lg:border-b lg:odd:bg-white lg:even:bg-gray-50 hover:bg-gray-100 transition duration-200 w-full">
      {/* ID Column with Padding */}
      <th
        scope="row"
        className="block lg:flex lg:items-center px-2 py-2 font-medium text-gray-900 whitespace-nowrap relative lg:static pl-[50%] lg:pl-4 text-left before:content-['ID'] before:absolute before:left-2 before:top-2 lg:before:content-['ID:'] lg:before:pr-2 lg:before:font-bold lg:w-[5%] lg:min-w-[60px]"
      >
        {id}
      </th>

      {/* Title Column */}
      <td
        className={`block lg:flex lg:items-start px-2 py-2 text-gray-900 relative lg:static pl-[50%] lg:pl-4 text-left before:content-['TITLE'] before:absolute before:left-2 before:top-2 lg:before:content-['TITLE:'] lg:before:pr-2 lg:before:font-bold lg:w-[20%] lg:min-w-[150px] ${
          complete ? "line-through" : ""
        }`}
      >
        <span className="break-words">{title || "No Title"}</span>
      </td>

      {/* Description Column */}
      <td
        className={`block lg:flex lg:items-start px-2 py-2 text-gray-900 relative lg:static pl-[50%] lg:pl-4 text-left before:content-['DESCRIPTION'] before:absolute before:left-2 before:top-2 lg:before:content-['DESCRIPTION:'] lg:before:pr-2 lg:before:font-bold lg:w-[45%] lg:min-w-[300px] ${
          complete ? "line-through" : ""
        }`}
      >
        <span className="break-words">{description || "No Description"}</span>
      </td>

      {/* Status Column */}
      <td className="block lg:flex lg:items-center px-2 py-2 text-gray-900 relative lg:static pl-[50%] lg:pl-4 text-left before:content-['STATUS'] before:absolute before:left-2 before:top-2 lg:before:content-['STATUS:'] lg:before:pr-2 lg:before:font-bold lg:w-[10%] lg:min-w-[100px]">
        {complete ? "Completed" : "Pending"}
      </td>

      {/* Actions Column */}
      <td className="block lg:flex lg:items-center px-2 py-2 relative lg:static pl-[50%] lg:pl-4 text-left before:content-['ACTIONS'] before:absolute before:left-2 before:top-2 lg:before:content-['ACTIONS:'] lg:before:pr-2 lg:before:font-bold lg:w-[20%] lg:min-w-[180px]">
        <div className="flex flex-nowrap items-center gap-2">
          <button
            onClick={() => deleteTodo(mongoId)}
            className="py-1 sm:py-2 px-2 sm:px-4 border-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200 whitespace-nowrap"
          >
            Delete
          </button>

          {!complete && (
            <button
              onClick={() => completeTodo(mongoId)}
              className="py-1 sm:py-2 px-2 sm:px-4 border-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-200 whitespace-nowrap"
            >
              Done
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default Todo;