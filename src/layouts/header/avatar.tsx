interface AvatarProps {
  userPhotoURL: string | null;
}

const Avatar = ({ userPhotoURL }: AvatarProps) => {
  return <>{userPhotoURL ? <img src={userPhotoURL} /> : <></>}</>;
};

export default Avatar;
