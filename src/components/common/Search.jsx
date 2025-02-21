import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/apiClient';
import Header from './Header';
import _ from 'lodash';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const debounceSearch = useRef(
        _.debounce(async (query, page) => {
            try {
                setLoading(true);
                setError(null);
                const res = await apiClient.get('http://localhost:3000/api/booking/search', {
                    params: {
                        query: query,
                        page: page,
                        pageSize: pageSize,
                    },
                });
                const data = res.data.data;
                setResults(Array.isArray(data) ? data : [data]); // Wrap object in an array if not already an array
                setTotalCount(res.data?.totalCount || 0);
            } catch (err) {
                setError(err.message);
                console.error('Error during search:', err);
            } finally {
                setLoading(false);
            }
        }, 500)
    ).current;
console.log("results",results)
    useEffect(() => {
        debounceSearch(query, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, page]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setPage(1);
    };
    const handlePageChange = (page) => {
        setPage(page);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const renderPages = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center mt-4">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        disabled={p === page}
                        className={`px-4 py-2 mx-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                            p === page ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 ">
            <Header title="Search" />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4"> Search</h1>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {loading && <p className="text-gray-600">Loading...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                <ul className="space-y-4">
                    {results?.map((product) => (
                        <li key={product.id} className="border p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-700">{product.mobile}</p>
                            <p className="text-gray-900">{product.address}</p>
                        </li>
                    ))}
                </ul>
                {renderPages()}
            </div>
        </div>
    );
}

export default Search;