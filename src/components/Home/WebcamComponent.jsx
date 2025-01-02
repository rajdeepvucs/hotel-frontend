import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Header from "../common/Header";
const videoConstraints = {
  width: 440,
  facingMode: "environment",
};

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = () => {
    // Capture image from webcam and store it in state
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  const onUserMedia = (e) => {
    console.log(e);
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
    <Header title='Image capture' />

    <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
        mirrored={true}
      />
      <button onClick={capture} className='bg-blue-500 text-white py-2 px-4 rounded-md mt-1'>Capture Photo</button>
      <button onClick={()=>{setImageSrc(null)}} className='bg-red-500 text-white py-2 px-4 rounded-md mt-1'>Refresh</button>
      {imageSrc && (
        <div>
          <h3>Captured Image</h3>
          <img src={imageSrc} alt="Captured" />
        </div>
      )}
         {/* <div className="flex justify-center">
            <button type="submit" className='bg-blue-500 text-white py-2 px-4 rounded-md'>
              Submit
            </button>
            </div> */}
    </div>
    </main>
    </div>
  );
};

export default WebcamComponent;
