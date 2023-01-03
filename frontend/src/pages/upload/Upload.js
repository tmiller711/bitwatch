import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import LongVideoPreview from "../../components/videos/longvideopreview/LongVideoPreview";
import "./upload.css"

const Upload = ({ getCookie, showAlert }) => {
    const [title, setTitle] = useState('')
    const [video, setVideo] = useState()
    const [thumbnail, setThumbnail] = useState()
    const [description, setDescription] = useState('')
    const [tag, setTag] = useState('')
    const [uploadStatus, setUploadStatus] = useState('none')

    const [uploadedVideo, setUploadedVideo] = useState()

    const onSubmit = async (e) => {
        e.preventDefault()

        const csrftoken = getCookie('csrftoken')
        const uploadData = new FormData();
        uploadData.append('title', title);
        uploadData.append('description', description)
        uploadData.append('tags', [tag])
        uploadData.append('video', video, video.name)
        uploadData.append('thumbnail', thumbnail, thumbnail.name)
        setUploadStatus('uploading')
        
        const res = await fetch("/api/video/upload", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
            body: uploadData
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setUploadedVideo(data)
                setUploadStatus('done')
                showAlert("Successfully uploaded")
            } else if (res.status == 403) {
                showAlert("You must be signed in to upload")
            } else {
                showAlert("Error uploading video")
            }
        })
        .catch(error => console.log(error))
    }

    if (uploadStatus == 'none') {
        return (
            <div className="upload">
                <Form className="upload-form" onSubmit={onSubmit}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Form.Label>Video</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".mp4"
                        required
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                    <Form.Label>Thumbnail</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".png, .jpeg, .jpg"
                        required
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Form.Label>Tags</Form.Label>
                    <Form.Select required onChange={(e) => setTag(e.target.value)}>
                        <option>Select a Tag</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Education">Education</option>
                        <option value="Cooking">Cooking</option>
                    </Form.Select>

                    <Button type="submit">Upload</Button>
                </Form>
            </div>
        )
    } else if (uploadStatus == 'uploading') {
        return (
            <div className="uploading">
                <h3>Uploading</h3>
                <Spinner animation="border" role="status" className="spinner" />
            </div>
        )
    } else if (uploadStatus == 'done' && uploadedVideo != undefined) {
        return (
            <div className="uploaded">
                <h3>Done Uploading</h3>
                <LongVideoPreview video={uploadedVideo} uploader_info={uploadedVideo.uploader_info} />
            </div>
        )
    }
}

export default Upload