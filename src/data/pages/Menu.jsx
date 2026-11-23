import MenuGrid from "../components/MenuGrid.jsx";
function Menu() {
    return (
        <div className="bg-light p-s rounded text-center">
            <h1 className="display-5">Menu</h1>
            <p className="lead">Fresh food, made to order, delivered hot.</p>
            <MenuGrid />
        </div>
    );
}