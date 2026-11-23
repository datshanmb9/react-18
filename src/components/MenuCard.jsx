import { useState } from "react";
import { Link } from "react-router";

function MenuCard({ id, name, price, description, emoji }) {
  const [count, setCount] = useState(0);

  return (
    <div className="card h-100 shadow-sm">
      <div className="bg-light text-center py-4 fs-1">{emoji}</div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <p className="card-text text-muted">{description}</p>
        <p className="fw-bold mt-auto">₹{price}</p>

        <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
          Add to cart
        </button>
        {count > 0 && (
          <small className="text-success mt-2">Added: {count}</small>
        )}

        <Link className="btn btn-outline-secondary mt-2" to={`/menu/${id}`}>
          View details
        </Link>
      </div>
    </div>
  );
}

export default MenuCard;
