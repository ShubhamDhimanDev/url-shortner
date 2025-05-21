import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";

export default function Auth() {
  const [counter, setCounter] = useState(120);

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  return (
    <div>
        <Outlet/>
    </div>
  )
}
