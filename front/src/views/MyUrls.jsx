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

  const deleteShortUrl = async (shortUrl) => {
    try {
      const response = await axiosClient.delete(`/delete-short-url/${shortUrl}`);
      if (response.status === 200) {
        alert('QR code deleted successfully.');
        fetchData(); // Refresh the URL list after deletion
      } else {
        alert('Failed to delete the QR code.');
      }
    } catch (error) {
      console.error('There was an error deleting the QR code!', error);
      alert('There was an error deleting the QR code.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



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
                  {/* <th scope="col" className="px-6 py-3 text-center"></th> */}
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                  {/* <th scope="col" className="px-6 py-3 text-center"></th> */}
                </tr>
              </thead>
              <tbody className="">
                {urls.map((url) => (
                  <UrlElement key={url.id} url={url} onDelete={deleteShortUrl} />
                ))}
              </tbody>
            </table>
            <Pagination paginate={paginate} onPageChange={fetchData} />
          </>
        )}
      </div>
    </PageComponent>
  );
}