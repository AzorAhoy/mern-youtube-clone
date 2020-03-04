import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Subscriber(props) {
    const userTo = props.userTo;
    const userFrom = props.userFrom;
    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }
        axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('Failed to get subscriber Number')
                }
            })

        axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setSubscribed(response.data.subscribed);
                    console.log(Subscribed);
                } else {
                    alert('Failed to get Subscribed Information')
                }
            })

    }, [])

    const onSubscribe = () => {
        let subscribeVariable = {
            userTo,
            userFrom
        }

        if (Subscribed) {
            //already subscibed
            axios.post('/api/subscribe/unsubscribe', subscribeVariable)
                .then((res) => {
                    if (res.data.success) {
                        console.log(res.data);
                        setSubscribed(!Subscribed);
                        setSubscribeNumber(SubscribeNumber - 1);
                    } else {
                        alert('Failed to Unsubscribe')
                    }
                })
        } else {
            //Not subscribed
            axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then((res) => {
                    if (res.data.success) {
                        console.log(res.data);
                        setSubscribed(true);
                        setSubscribeNumber(SubscribeNumber + 1);
                    } else {
                        alert('Failed to Subscribe')
                    }
                })
        }
    }

    return (
        <div>
            <button style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px',
                color: 'white',
                padding: '10px 16px',
                fontWeight: '500',
                fontSize: '1rem',
                textTransform: 'uppercase'
            }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
}

export default Subscriber;