import { useEffect } from "react";
import axiosClient from '../axios.js'; 

export default function Test() {

    console.log('tyesting');

    

    useEffect(()=>{
      
            axiosClient.post(`/get-long-url/nWtFBEy0`)
                .then(response => {
                    const { data } = response;
                    if (data && data.url) {
                        console.log(data)
                    } else {
                        console.log('err')
                    }
                })
                .catch(error => {
                    console.error('Error fetching short URL:', error);
                });
    },[])

    return (
        <div>
            Testing
        </div>
    )
}
