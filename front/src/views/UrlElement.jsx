import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useState } from 'react';

export default function UrlElement({ url, onRequestDelete }) {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${import.meta.env.VITE_APP_BASE_URL}/${url.short_url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    };

    const handleDelete = () => {
        onDelete(url.short_url);
    };

    const truncateUrl = (longUrl) => {
        try {
            const urlObj = new URL(longUrl);
            return `${urlObj.origin}/...`;
        } catch (error) {
            return longUrl; // Return original if invalid
        }
    };

    return (
        <>
            <tr className="bg-zinc-900 border-b ">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                        <a
                            href={`${import.meta.env.VITE_APP_BASE_URL}/${url.short_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-200"
                        >
                            {url.short_url}
                        </a>
                        <button
                            onClick={handleCopy}
                            className="text-gray-300 hover:text-white"
                            title={copied ? 'Copied!' : 'Copy to clipboard'}
                        >
                            {copied ? (
                                <CheckIcon className="w-5 h-5 text-green-400" />
                            ) : (
                                <DocumentDuplicateIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </th>
                <td className="px-6 py-4">
                    <a href={url.long_url} target="_blank" className="text-primary-bg hover:underline" rel="noopener noreferrer">{truncateUrl(url.long_url)}</a>
                </td>
                <td className="px-6 py-4 flex justify-center">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}/qrcodes/${url.short_url}.svg`} height="100px" width="100px" alt="" />
                </td>
                <td className="px-6 py-4 text-center space-y-2">
                    <NavLink
                        to={`/analytics/${url.short_url}`}
                        className={({ isActive }) =>
                            `text-primary-bg hover:underline ${isActive ? 'font-bold' : ''}`
                        }
                    >Analytics</NavLink>
                    <br /><br />
                    <button
                        onClick={() => onRequestDelete(url.short_url)}
                        className="mt-2 px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
                    >DELETE</button>
                </td>
            </tr>
        </>
    );
}
