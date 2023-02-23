// Hooks and Types React
import { ChangeEvent, useEffect, useState } from "react";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Services
import { getItem, removeItem, updateItem } from "../services/TutorialService";
// Interfaces
import ITutorialData from "../types/Tutorial";
// Sweet Alert
import Swal from "sweetalert2";

export const Tutorial = () => {

    const { id } = useParams();
    let navigate = useNavigate();

    const initialTutorialState: ITutorialData = {
        id: null,
        title: "",
        description: "",
        published: false
    };

    const [currentTutorial, setCurrentTutorial] = useState<ITutorialData>(initialTutorialState);

    const getTutorial = (id: string) => {
        getItem(id)
            .then((response: any) => {
                setCurrentTutorial(response.data);
            })
            .catch((e: Error) => {
                Swal.fire('Error', `Can't get data`, 'error');
                console.log(e);
            });
    };

    useEffect(() => {
        if (id)
            getTutorial(id);
    }, [id]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCurrentTutorial({ ...currentTutorial, [name]: value });
    };

    const updatePublished = (status: boolean) => {
        var data = {
            id: currentTutorial.id,
            title: currentTutorial.title,
            description: currentTutorial.description,
            published: status
        };
        updateItem(currentTutorial.id, data)
            .then(() => {
                setCurrentTutorial({ ...currentTutorial, published: status });
                Swal.fire('status changed successfully', '', 'success')
            })
            .catch((e: Error) => {
                Swal.fire('Error', e.message, 'error');
                console.log(e);
            });
    };

    const updateTutorial = () => {
        updateItem(currentTutorial.id, currentTutorial)
            .then(() => {
                Swal.fire(`${currentTutorial.title} Updated Successfully.`, '', 'success');
                navigate("/tutorials");
            })
            .catch((e: Error) => {
                Swal.fire('Error', e.message, 'error');
                console.log(e);
            });
    };

    const deleteTutorial = () => {
        removeItem(currentTutorial.id)
            .then(() => {
                Swal.fire(`${currentTutorial.title} successfully deleted.`, '', 'success');
                navigate("/tutorials");
            })
            .catch((e: Error) => {
                Swal.fire('Error', e.message, 'error');
                console.log(e);
            });
    };

    return (
        <>
            {
                currentTutorial ? (
                    <div className="edit-form">
                        <h4>Tutorial</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={currentTutorial.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={currentTutorial.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <strong>Status:</strong>
                                </label>
                                {currentTutorial.published ? "Published" : "Pending"}
                            </div>
                        </form>

                        {currentTutorial.published ? (
                            <button
                                className="btn btn-primary m-2"
                                onClick={() => updatePublished(false)}
                            >
                                UnPublish
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary m-2"
                                onClick={() => updatePublished(true)}
                            >
                                Publish
                            </button>
                        )}

                        <button className="btn btn-danger m-2" onClick={deleteTutorial}>
                            Delete
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success m-2"
                            onClick={updateTutorial}
                        >
                            Update
                        </button>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Please click on a Tutorial...</p>
                    </div>
                )
            }
        </>
    )
}
