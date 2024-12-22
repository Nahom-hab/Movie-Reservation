// App.js
import React, { useEffect, useState } from 'react';
import useZustand from '../zustand/useZustand';

const getTelegramUser = () => {
    const { setUsername, setChatID } = useZustand();

    // Function to get query parameters from the URL
    const getQueryParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            username: params.get('username'),
            chatId: params.get('chatId'),
        };
    };

    useEffect(() => {
        const { username, chatId } = getQueryParams();
        setUsername(username);
        setChatID(chatId);
        console.log(chatId);

    }, []);
    return null
};

export default getTelegramUser;