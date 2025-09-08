import React, { useEffect } from 'https://aistudiocdn.com/react@^19.1.1';

interface AdSenseAdProps {
  slot: string;
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ slot, className = '' }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  const insClasses = `adsbygoogle ${className}`.trim();

  return (
      <ins
        className={insClasses}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1234567890123456" // This is a placeholder, replace with your real publisher ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
  );
};

export default AdSenseAd;