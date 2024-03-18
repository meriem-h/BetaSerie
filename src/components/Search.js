import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


const API_KEY = process.env.REACT_APP_API_KEY


export default function Search() {
    const location = useLocation()

    const [result, setResult] = useState([]);
    const [text, setText] = useState("");
    const [offset, setOffset] = useState(0);
    const [genres, setGenres] = useState("");
    const [creations, setCreations] = useState("");
    const [pays, setPays] = useState("");

    useEffect(() => {

        let input = document.getElementById("search-input-nav");
        if (input.value.length > 0) {
            setText(input.value)
            input.value = "";
        }


        var requestOptions = {
            method: 'GET',
        };

        fetch(`https://api.betaseries.com/search/shows?client_id=${API_KEY}&text=${text}&offset=${offset}&genres=${genres}&creations=${creations}&pays=${pays}`, requestOptions)
            .then(res => res.json())
            .then(res => {
                setResult(res.shows);
            })
            .catch(err => console.error(err))

    }, [text, offset, genres, creations, pays]);


    const handleSelect = (choix) => {
        if (choix == "-- Genre --") {
            setGenres("");
        } else {
            setGenres(choix);
        }

    }
    return (

        <div className="search_body">

            <div className="search_column_left">
                <h2 className="title-filtres">Filtres</h2>
                <form id="filtres">

                    <div className="champs">
                        <label>Nom</label>
                        <input id="search-name" type="text" placeholder="par nom" onChange={(e) => setText(e.target.value)} />
                    </div>

                    {/* <input type="text" placeholder="par genre" onChange={(e) => setGenres(e.target.value)} /> */}

                    <div className="champs">
                        <label>Date de création</label>
                        <input type="text" placeholder="par date de creation" onChange={(e) => setCreations(e.target.value)} />
                    </div>

                    <div className="champs">
                        <label>Pays</label>
                        <input type="text" placeholder="par pays" onChange={(e) => setPays(e.target.value)} />
                    </div>

                    <div className="champs">
                        <label>Genre</label>

                        <select onChange={(e) => { handleSelect(e.target.value) }} className="search_select">
                        <option selected="true">-- Genre --</option>
                            <option valeur="Action">Action</option>
                            <option valeur="Animation">Animation</option>
                            <option valeur="Anime">Anime</option>
                            <option valeur="Aventure">Adventure</option>
                            <option valeur="Comédie">Comedy</option>
                            <option valeur="Comédie musicale">Musical</option>
                            <option valeur="Crime">Crime</option>
                            <option valeur="Documentaire">Documentary</option>
                            <option valeur="Drame">Drama</option>
                            <option valeur="Enfant">Children</option>
                            <option valeur="Famille">Family</option>
                            <option valeur="Fantastique">Fantasy</option>
                            <option valeur="Game Show">Game Show</option>
                            <option valeur="Histoire">History</option>
                            <option valeur="Horreur">Horror</option>
                            <option valeur="Mystère">Mystery</option>
                            <option valeur="Romance">Romance</option>
                            <option valeur="Sport">Sport</option>
                            <option valeur="Thriller">Thriller</option>

                        </select>
                    </div>
                </form>
            </div>

            <div className="search_column_right">
                <div className="search_list">

                    {result.map((e, i) =>
                        <div className="fiche" key={i}>
                            <Link className="link" to={"/s_detail/" + e.id}>
                                <img className="discover_img img_search" src={e.poster == null ? "https://rukminim1.flixcart.com/image/416/416/k2p1q4w0/poster/t/v/q/medium-poster-for-room-and-office-motivational-poster-for-walls-original-imafen2z5gejnuzq.jpeg?q=70" : e.poster} alt="" />
                                <h3 className="titles">{e.title}</h3>
                            </Link>
                        </div>
                    )}

                </div>

                <div className="btn_search">

                    <button className="button" onClick={() => { offset != 0 ? setOffset(offset - 20) : setOffset(offset) }}>previous</button>
                    <button className="button" onClick={() => { setOffset(offset + 20) }}>next</button>
                </div>
            </div>


        </div>
    )
}