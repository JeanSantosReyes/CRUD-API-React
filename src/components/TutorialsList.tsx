// Hooks and Types React
import { ChangeEvent, useEffect, useState } from "react";
// React Router DOM
import { Link } from "react-router-dom";
// Services
import { findItemByTitle, getAllItem, removeAllItems } from "../services/TutorialService";
// Interfaces
import ITutorialData from "../types/Tutorial";

export const TutorialsList = () => {

  const [tutorials, setTutorials] = useState<Array<ITutorialData>>([]);
  const [currentTutorial, setCurrentTutorial] = useState<ITutorialData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [searchTitle, setSearchTitle] = useState<string>("");

  useEffect(() => {
    retrieveTutorials();
  }, []);

  const onChangeSearchTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveTutorials = () => {
    getAllItem()
      .then(({ data }) => {
        setTutorials(data);
      })
      .catch((e: Error) => console.log(e))
  };

  const refreshList = () => {
    retrieveTutorials();
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial: ITutorialData, index: number) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const removeAllTutorials = () => {
    removeAllItems()
      .then(() => {
        refreshList();
      })
      .catch((e: Error) => console.log(e));
  };

  const findByTitle = () => {
    findItemByTitle(searchTitle)
      .then(({ data }) => {
        setTutorials(data);
        setCurrentTutorial(null);
        setCurrentIndex(-1);
      })
      .catch((e: Error) => console.log(e))
  };


  return (
    <div className="list row">
      <div className="col-12">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Tutorials List</h4>

        <ul className="list-group">
          {
            tutorials &&
            tutorials.map((tutorial, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTutorial(tutorial, index)}
                key={index}
              >
                {tutorial.title}
              </li>
            ))
          }
        </ul>

        <button
          className="m-3 btn btn-danger"
          onClick={removeAllTutorials}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {
          currentTutorial ? (
            <div>
              <h4>Tutorial</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentTutorial.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="btn btn-warning mt-3"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Tutorial...</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
