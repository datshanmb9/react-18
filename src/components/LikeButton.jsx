import { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button
      className="btn btn-sm btn-outline-danger"
      onClick={() => setLikes(likes + 1)}
    >
      ❤️ Like us ({likes})
    </button>
  );
}

export default LikeButton;
