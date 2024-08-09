import { getBlob, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { firebaseStorage } from '../../services/firebase';

interface CardProps {
  id: string;
  url: string;
  displayName: string;
}

const Card = React.memo(({ id, url, displayName }: CardProps) => {
  const [dataURL, setDataURL] = useState<any>(null);

  const load = async (url: string) => {
    const blob = await getBlob(ref(firebaseStorage, url));
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result;
      setDataURL(res);
      if (res && new Blob([res.toString()]).size < 100000) {
        localStorage.setItem(url, res.toString());
      }
    };
    reader.readAsDataURL(blob);
  };

  useEffect(() => {
    const data = localStorage.getItem(url);
    if (!data) {
      load(url);
    } else {
      setDataURL(data);
    }
  }, [url]);

  if (!dataURL) return <></>;
  return (
    <div className="card">
      <img id={id} src={dataURL} />
      <div className="card-name">{displayName}</div>
    </div>
  );
});

export default Card;
