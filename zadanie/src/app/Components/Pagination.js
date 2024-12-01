'use client';

export default function Pagination({ totalItems, currentPage, itemsPerPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex items-center justify-center mt-4">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-l ${
                    currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
                &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 border ${
                        currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-r ${
                    currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
                &gt;
            </button>
        </div>
    );
}
