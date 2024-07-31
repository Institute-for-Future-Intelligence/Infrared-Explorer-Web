interface MenuItemProps {
  stayAfterClick?: boolean;
  fontWeight?: string;
  textSelectable?: boolean;
  update?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  stayAfterClick,
  fontWeight,
  textSelectable = true,
  onClick,
  children,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }
    if (stayAfterClick) {
      e.stopPropagation();
    }
  };

  return (
    <span
      onClick={handleClick}
      style={{
        userSelect: textSelectable ? 'auto' : 'none',
        display: 'inline-block',
        fontWeight: fontWeight,
        width: '100%',
      }}
    >
      {children}
    </span>
  );
};

export default MenuItem;
