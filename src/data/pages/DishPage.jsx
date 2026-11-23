import { Link, useParams } from "react-router";
import menu from "../data/menu.json";

function DishPage() {
  const { id } = useParams();
  const dish = menu.find((item) => item.id === Number(id));

  if(!dish) {
    return (
      <div className="alert ">
        <h1 className="display-5">Dish Not Found</h1>
        }
        return (
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
                <div  className="card shadow-sm text-center">
                    <div className="card-body">
            <h1 className="display-5">{dish.emoji}</h1>
            <div classNam
            <p className="lead">{dish.description}</p>