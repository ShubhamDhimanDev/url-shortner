import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function Pagination({ paginate, onPageChange }) {
    const { current_page, last_page, next_page_url, prev_page_url, from, to, total } = paginate;

    const handlePageChange = (url) => {
        if (url) {
            const page = new URL(url).searchParams.get("page");
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-zinc-800 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(prev_page_url)}
                    disabled={!prev_page_url}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(next_page_url)}
                    disabled={!next_page_url}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-white">
                        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(prev_page_url)}
                            disabled={!prev_page_url}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary-bg hover:text-black focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: last_page }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(`${paginate.path}?page=${index + 1}`)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${current_page === index + 1
                                    ? 'bg-primary-bg text-black'
                                    : 'text-white ring-1 ring-inset ring-gray-300 hover:bg-primary-bg hover:text-black focus:z-20 focus:outline-offset-0'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(next_page_url)}
                            disabled={!next_page_url}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary-bg hover:text-black focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
