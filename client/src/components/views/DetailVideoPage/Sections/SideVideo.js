import React, { useEffect, useState } from 'react';
import axios from 'axios';
function SideVideo(props) {
    const [SideVideos, setSideVideos] = useState([])
    useEffect(() => {
        axios.get('/api/videos/getVideos')
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.videos);
                    setSideVideos(res.data.videos)
                    //setVideos(res.data.videos);
                } else {
                    alert("Failed to fetch videos");
                }
            })
    }, [])

    const sideVideoItem = SideVideos.map((video) => {
        var sec = Math.floor(video.duration % 60);
        var min = Math.floor(video.duration / 60);

        return <div style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }} key={video._id}>
            <div style={{width:'40%',marginRight:'1rem'}}>
                <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
                    <img alt="thumbnail" style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} />
                </a>
            </div>

            <div style={{width:'50%'}}>
                <a href={`/video/${video._id}`} style={{color:'gray'}}>
                    <span style={{ fontSize: '1rem', color: 'black' }}>
                        {video.title}
                    </span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views}</span><br />
                    <span>{min}:{sec}</span>
                </a>
            </div>
        </div>
    })

    return (
        <React.Fragment>
            <div style={{marginTop:'3rem'}}></div>
            {sideVideoItem}
        </React.Fragment>
    );
}

export default SideVideo;