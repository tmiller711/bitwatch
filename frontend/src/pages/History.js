import React, { useEffect, useState } from "react";

const History = ({ fetchVideo }) => {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await fetch('/api/account/history')
            const history = await res.json()
            
            for (let i = 0; i < history.length; i++) {
                const data = await fetchVideo(history[i].id)
                setVideos(current => [...current, data])
            }
        }

        fetchHistory()
    }, [])

    const displayVideos = () => {
        for (let i = 0; i < videos.length; i++) {
            return <h2>{videos[i].title}</h2>
        }
    }

    return (
        <>
        <h1>This is the history page</h1>
        {displayVideos()}
        </>
    )
}

export default History