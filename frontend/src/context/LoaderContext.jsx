import React, { createContext, useContext, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoaderContext = createContext();

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const LoaderAnimation = () => {
    return (
      <div 
        className={`fixed inset-0 bg-white z-50 flex items-center justify-center ${
          isFadingOut ? 'fade-out-animation' : ''
        }`}
        onAnimationEnd={() => {
          if (isFadingOut) {
            setIsLoading(false);
            setIsFadingOut(false);
          }
        }}
      >
        <div className="w-80 h-80">
          <DotLottieReact
            src="https://lottie.host/048f4679-fe48-443a-938c-725b795bb5e7/dVr7rMcDrj.lottie"
            loop={!isFadingOut}
            autoplay
          />
        </div>
      </div>
    );
  };

  const showLoader = () => {
    setIsFadingOut(false);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsFadingOut(true);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {isLoading && <LoaderAnimation />}
      {children}
    </LoaderContext.Provider>
  );
}; 