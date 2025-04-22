import { useState } from "react";
import axios from "axios";

function CreateFundraiser() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append("upload_preset", "unsigned-goali");
        const cloudName = "dgvc3mvc5";

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
            , formData)

        return response.data.secure_url;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let uploadedImageURL = imageURL;
        if (image && !imageURL) {
            uploadedImageURL = await handleImageUpload(image);
            setImageURL(uploadedImageURL);
        }

        // Submit to your backend
        const fundraiserData = {
            title,
            description,
            image_url: uploadedImageURL,
        };

        await axios.post("http://localhost:5000/fundraisers", fundraiserData, {
            withCredentials: true,
        });

        alert("Fundraiser created!");
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Create a Fundraiser</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Fundraiser Title"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full"
                    required
                />
                {imageURL && (
                    <img src={imageURL} alt="Uploaded preview" className="h-40 object-cover rounded" />
                )}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Create Fundraiser
                </button>
            </form>
        </div>
    );
}
export default CreateFundraiser;