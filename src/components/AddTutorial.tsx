// Hooks and Types React
import { ChangeEvent, useState } from "react";
// Services
import { createItem } from "../services/TutorialService";
// Interfaces
import ITutorialData from "../types/Tutorial";
// Sweet Alert
import Swal from "sweetalert2";

const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false
};

export const AddTutorial = () => {

    const [tutorial, setTutorial] = useState<ITutorialData>(initialTutorialState);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTutorial({ ...tutorial, [name]: value });
    };

    const saveTutorial = () => {
        var data = {
            title: tutorial.title,
            description: tutorial.description
        };
        createItem(data)
            .then(({ data }) => {
                setTutorial({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    published: data.published
                });
                Swal.fire(`${data.title} successfully added.`, '', 'success')
                setSubmitted(true);
            })
            .catch(err => console.log(err))
    }

    const newTutorial = () => {
        setTutorial(initialTutorialState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {
                submitted
                    ? (
                        <div className="container">
                            <h4>You submitted successfully!</h4>
                            <button className="btn btn-success" onClick={newTutorial}>
                                Add
                            </button>
                        </div>
                    )
                    : (
                        <div className="container">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    required
                                    value={tutorial.title}
                                    onChange={handleInputChange}
                                    name="title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    required
                                    value={tutorial.description}
                                    onChange={handleInputChange}
                                    name="description"
                                />
                            </div>

                            <button onClick={saveTutorial} className="btn btn-success my-3">
                                Submit
                            </button>
                        </div>
                    )
            }
        </div>
    )
}
