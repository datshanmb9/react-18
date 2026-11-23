import { link } from "react-router";

function Home() {
  return (
    <div className="bg-light p-s rounded text-center">
        <h1 className="display-5">Welcome to Tasty Bites</h1>
        <p className="lead">Fresh food, made to order, delivered hot.</p>
        <Link className="btn btn-primary btn-lg" to="/menu">See the Menu</Link></div>
  );
}
export default Home;