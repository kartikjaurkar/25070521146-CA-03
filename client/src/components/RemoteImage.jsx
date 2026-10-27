import { useEffect, useState } from 'react';

export default function RemoteImage({
  src,
  alt,
  className = '',
  fallback = '/fallback-poster.svg',
  ...props
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={!src || failed ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
