import { useState, useEffect } from "react";
const Popup = () => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    // Hide the popup after 3 seconds (adjust duration as needed)
    const timeoutId = setTimeout(() => {
      setShowPopup(false);
    }, 1000);

    // Clean up the timeout when the component is unmounted
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-6 py-4 rounded shadow">
            <p className="text-lg font-bold">Contest Start</p>
          </div>
        </div>
      )}
    </>
  );
};
export default Popup;
