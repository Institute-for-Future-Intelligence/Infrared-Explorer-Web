import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const CardListWrapper = ({ children }: Props) => {
  return (
    <div className="card-list-wrapper">
      <div className="card-list">{children}</div>
    </div>
  );
};

export default CardListWrapper;
