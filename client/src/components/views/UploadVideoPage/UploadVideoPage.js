import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const Category = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" }
]

function UploadVideoPage(props) {
    const user = useSelector(state => state.user);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [Privacy, setPrivacy] = useState(0);
    const [Categories, setCategories] = useState("Film & Animation");
    const [filePath, setFilePath] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [duration, setDuration] = useState("");

    const handleChangeTitle = (event) => {
        setTitle(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    const handleChangeDescription = (event) => {
        setDescription(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    const handleChangeOne = (event) => {
        setPrivacy(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        console.log(user);

        if (user.userDta && !user.userDta.isAuth) {
            return alert("Log in required!")
        }

        if (title === "" || description == "" ||
            Categories === "" || filePath == "" ||
            duration === "" || thumbnail == ""
        ) {
            return alert("Please fill all the form");
        }

        let variables = {
            writer: user.userData._id,
            title: title,
            description: description,
            privacy: Privacy,
            filePath: filePath,
            category: Categories,
            duration: duration,
            thumbnail: thumbnail
        };
        console.log(variables);
        axios.post('/api/videos/uploadVideo', variables)
            .then(res => {
                if (res.data.success) {
                    alert("Video uploaded!");
                    props.history.push("/");
                }

                else
                    alert("Failed to upload video")
            });
    }

    const onDrop = (files) => {
        console.log(".xlxs" !== ".xlxs");
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files);
        //console.log(path.extname())
        formData.append("file", files[0]);

        axios.post('/api/videos/uploadFiles', formData, config)
            .then(res => {
                if (res.data.success) {
                    console.log(res);
                    let variable = {
                        filePath: res.data.filePath,
                        fileName: res.data.fileName
                    }
                    setFilePath(res.data.filePath);
                    console.log(variable);

                    axios.post('/api/videos/thumbnail', variable)
                        .then(res => {
                            console.log(res);
                            if (res.data.success) {
                                setThumbnail(res.data.thumbsFilePath);
                                setDuration(res.data.fileDuration);
                            } else {
                                alert('Failed to generate thumbnail')
                            }
                        })
                } else {
                    alert("Failed to upload file")
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: '300px',
                                    height: '240px',
                                    border: '1px solid lightgray',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>
                    {thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${thumbnail}`} alt="img" style={{ "maxWidth": "300px" }} />
                        </div>
                    }
                    {/* <div>
                        <img src="http://localhost:5000/uploads/thumbnails/tn_1.png" alt="img" style={{"max-width": "300px"}}/>
                    </div> */}
                </div>
                <br /><br />
                <label>Title</label>
                <Input
                    onChange={handleChangeTitle}
                    value={title}
                />
                <br /><br />
                <label>description</label>
                <TextArea
                    onChange={handleChangeDescription}
                    value={description}
                />
                <br /><br />

                <select
                    onChange={handleChangeOne}
                >
                    {Private.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <select
                    onChange={handleChangeTwo}
                >
                    {Category.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br /><br />
                <Button
                    type="primary"
                    size="large"
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default UploadVideoPage;