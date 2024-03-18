import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscoverShow from './discover_show'
import Search from "./Search";
import Random from "./carousel";

export default function Home() {

    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
        if (code) {
            navigate('/');
        }

    }, [])

    return (
        <>
            <>
                <Random />
            </>
        </>
    )
}