import { useState } from "react";
import MenuCard from "./MenuCard.jsx";
import menu from "../data/menu.js";

function MenuGrid() {
  const [search, setSearch] = useState("");

  const shown = menu.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search dishes..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {shown.length === 0 && (
        <div className="alert alert-warning">No dishes found.</div>
      )}

      <div className="row">
        {shown.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-lg-3 mb-4">
            <MenuCard
              id={item.id}
              name={item.name}
              price={item.price}
              description={item.description}
              emoji={item.emoji}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MenuGrid;
