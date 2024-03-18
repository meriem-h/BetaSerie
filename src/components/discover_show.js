import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AddShow } from "./add_show";
import { Favorite } from "./add_favorite";


const API_KEY = process.env.REACT_APP_API_KEY


export default function Series() {
    const [series, setSeries] = useState([]);
    const [offset, setOffset] = useState(0)

    useEffect(() => {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://api.betaseries.com/shows/discover?client_id=${API_KEY}&limit=5&offset=${offset}`, requestOptions)
        .then(res => res.json())
        .then(res => {
            setSeries(res.shows);
        })
        .catch(err => console.error(err))
        
    }, [offset]);

    return (

        <div>

            <h1 className="cathegories"> À découvrir </h1>

            <div id="discover_body">

                <img className="fleche" src="https://cdn-icons-png.flaticon.com/512/32/32542.png" onClick={() => { offset != 0 ? setOffset(offset - 5) : setOffset(offset) }} />
                {series.map((e) =>
                    <div className="fiche">
                        <Link className="link" to={"/s_detail/" + e.id}>
                            <img className="discover_img" src={e.images.poster} alt="" />
                            <h3 className="titles">{e.title}</h3>
                        </Link>
                        <div className="btn_like">
                            <AddShow id={e.id} />
                            <Favorite id={e.id} />
                        </div>
                    </div>

                )}
                <img className="fleche" src="https://cdn-icons-png.flaticon.com/512/32/32213.png" onClick={() => { setOffset(offset + 5) }} />
            </div>

        </div>
    )
}