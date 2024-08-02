import { getBlob, ref } from 'firebase/storage';
import React, { useEffect, useMemo, useState } from 'react';
import { firebaseStorage } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  id: string;
  url: string;
  displayName: string;
}

const Card = React.memo(({ id, url, displayName }: CardProps) => {
  const [dataURL, setDataURL] = useState<any>(null);

  const reader = useMemo(() => new FileReader(), []);

  reader.onloadend = () => {
    setDataURL(reader.result);
    if (reader.result) {
      localStorage.setItem(url, reader.result.toString());
    }
  };

  const load = async (url: string) => {
    console.log('fetch');
    const blob = await getBlob(ref(firebaseStorage, url));
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

  const navigate = useNavigate();

  const onClickCard = () => {
    navigate(`experiments/${id}`);
  };

  if (!dataURL) return <></>;
  return (
    <div className="card" onClick={onClickCard}>
      <img src={dataURL} />
      <div className="card-name">{displayName}</div>
    </div>
  );
});

export default Card;
