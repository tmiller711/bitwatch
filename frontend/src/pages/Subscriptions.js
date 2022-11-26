import React, { useEffect } from "react";

const Subscriptions = () => {
    useEffect(() => {
        const fetchSubscriptions = async () =>{
            const res = await fetch('/api/account/subscriptions/')
            const data = await res.json()
            console.log(data)
        }

        fetchSubscriptions()
    }, [])

    return (
        <h1>Subscriptions Pages</h1>
    )
}

export default Subscriptions