import React, { useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from '../axios';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCodeSrc, setQrCodeSrc] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosClient.post('/generate-short-url', { url })
      .then((response) => {
        const { data } = response;
        if (data && data.url) {
          const currentDomain = window.location.origin;
          setShortUrl(`${currentDomain}/${data.url}`);
          setQrCodeSrc(`${data.qrcode}`);
        } else {
          setError('Invalid response from server');
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          const finalErrors = Object.values(error.response.data.errors).flat();
          setError(finalErrors.join('<br>'));
        } else {
          setError('Something went wrong.');
        }
      });
  };

  return (
    <PageComponent title="Dashboard">
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-12">
                    <label htmlFor="url" className="block text-sm font-medium leading-6 text-white">
                      Enter Full URL
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        autoComplete="url"
                        className="block w-full bg-theme-secondary rounded-full border-0 outline-0 py-1.5 text-white placeholder:text-gray-400 sm:text-sm sm:leading-6 pl-8"
                      />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="mt-2 bg-red-500 rounded-full py-2 px-3 text-white">
                    <p dangerouslySetInnerHTML={{ __html: error }}></p>
                  </div>
                )}
                {/*  */}
                {shortUrl && (
                  <>
                    <div className="mt-2 bg-green-900  rounded-full py-2 px-3 text-white">
                      <p>Short URL generated: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
                    </div>
                    <div className='text-center mt-5'>
                      <span className='text-white'>OR <br/> Scan this QR Code : </span>
                      <div className='flex justify-center'>
                        <img src={qrCodeSrc} className='' alt="" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="font-bold rounded-full px-10 py-1 pb-2 text-medium leading-6 text-white border-2 border-blue hover:text-primary-bg hover:bg-blue transition-colors duration-300"
              >
                Generate Short Url
              </button>
            </div>
          </form>
        </PageComponent>
  );
}