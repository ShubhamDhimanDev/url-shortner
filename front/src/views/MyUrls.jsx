import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import UrlElement from "./UrlElement";
import Pagination from "./Pagination";
import Spinner from "./Spinner";

export default function MyUrls() {
  const [urls, setUrls] = useState([]);
  const [paginate, setPaginate] = useState({});
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/get-url-list?page=${page}`);
      const { data } = response;
      if (data) {
        setPaginate(data);
        setUrls(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (shortUrl) => {
    setToDelete(shortUrl);
  };

  const confirmDelete = async () => {
    try {
      await axiosClient.delete(`/delete-short-url/${toDelete}`);
      setToDelete(null);
      fetchData();
    } catch (e) {
      console.error(e);
      setToDelete(null);
    }
  };

  const cancelDelete = () => setToDelete(null);

  useEffect(() => { fetchData(); }, []);



  return (
    <PageComponent title="My Urls">
      <div className="relative ">
        {/* Show loader while data is loading */}
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs text-white uppercase bg-zinc-800">
                <tr className="">
                  <th scope="col" className="px-6 py-3">Short URL</th>
                  <th scope="col" className="px-6 py-3">Long URL</th>
                  <th scope="col" className="px-6 py-3 text-center">QR Code</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {urls.map((url) => (
                  <UrlElement key={url.id} url={url} onRequestDelete={handleDelete} />
                ))}
              </tbody>
            </table>
            <Pagination paginate={paginate} onPageChange={fetchData} />
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-2xl p-6 w-80">
            <h2 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h2>
            <p className="text-white mb-6">Are you sure you want to delete <span className="font-bold">{toDelete}</span>?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-full border border-gray-500 text-white hover:bg-gray-700"
              >Cancel</button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700"
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </PageComponent>
  );
}