import React, { memo } from 'react';
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems,
  showItemsPerPage = true,
  className = ''
}) => {
  // Calculate the range of items being displayed
  const startItem = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);
  
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    // Maximum page buttons to show (excluding navigation buttons)
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  const pageNumbers = getPageNumbers();
  
  // Don't render pagination if there's only 1 page
  if (totalPages <= 1) return null;
  
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 mt-6 ${className}`}>
      {/* Items per page info */}
      {showItemsPerPage && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> items
        </div>
      )}
      
      {/* Pagination buttons */}
      <div className="flex items-center space-x-1">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Go to first page"
        >
          <FaAngleDoubleLeft className="text-sm" />
        </button>
        
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Go to previous page"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        
        {/* Show ellipsis for start if needed */}
        {pageNumbers[0] > 1 && (
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            1
          </button>
        )}
        
        {pageNumbers[0] > 2 && (
          <span className="px-2 py-1 text-gray-600 dark:text-gray-400">
            ...
          </span>
        )}
        
        {/* Page number buttons */}
        {pageNumbers.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === pageNumber
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* Show ellipsis for end if needed */}
        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
          <span className="px-2 py-1 text-gray-600 dark:text-gray-400">
            ...
          </span>
        )}
        
        {/* Show last page if not included in page numbers */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {totalPages}
          </button>
        )}
        
        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentPage === totalPages
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Go to next page"
        >
          <FaChevronRight className="text-sm" />
        </button>
        
        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            currentPage === totalPages
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Go to last page"
        >
          <FaAngleDoubleRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default memo(Pagination); 