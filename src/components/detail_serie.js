import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AddShow } from "./add_show";
import { Favorite } from "./add_favorite";

const API_KEY = process.env.REACT_APP_API_KEY

export default function Detail() {
    const [series, setSeries] = useState([]);
    const [detail, setDetail] = useState([]);
    const [saisons, setSaison] = useState(1);
    const { id } = useParams();

    const id_user = localStorage.getItem('id_user');
    const token = localStorage.getItem('token');

    const items = []
    const img = []
    const genre_tab = []
    const genre = ""

    var optionsGet = {
        method: 'GET',
    };

    //fetch for show detail
    // -----------------------------------

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/display?client_id=${API_KEY}&id=${id}`, optionsGet)
            .then(res => res.json())
            .then(res => {
                setSeries(res.show);
            })
            .catch(err => console.error(err))

    }, []);

    //fetch for episode
    // -----------------------------------

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/episodes?id=${id}&client_id=${API_KEY}&season=${saisons}`, optionsGet)
            .then(res => res.json())
            .then(res => {

                res.episodes.forEach(element => {
                    img.push(fetch(`https://api.betaseries.com/pictures/episodes?id=${element.id}&client_id=${API_KEY}`, optionsGet)
                        .then(images => element.picture = images.url))
                });

                Promise.all(img).then(() => {
                    setDetail(res.episodes);
                })

            })
            .catch(err => console.error(err))


    }, [saisons]);

    for (let index = 1; index <= series.seasons; index++) {
        items.push(<option value={index}>saison {index}</option>)
    }


    return (
        <div className="detai">
            <>
                {(series.length > 0) ? (
                    <div className="detail_content">
                        <div className="content_left">
                            <p>saison : {series.seasons}</p>
                            <p>episodes : {series.episodes}</p>
                            <p>note : {series.notes.mean}</p>
                            <p>genre : {Object.values(series.genres).map((val) => {
                                    return (<p>{val}</p>)
                                })}</p>
                        </div>
                        <div className="content_center">

                            <h1 className="h1_detail">{series.title}</h1>
                            <p>{series.description}</p>

                            <div className="btn_like">
                                <AddShow id={id} />
                                <Favorite id={id} />
                            </div>

                        </div>
                        <div className="content_right">
                            <img className="detail_poster" src={series.images.poster} alt="" />
                        </div>
                    </div>
                ) : (
                    <div>
                        "EN CHARGEMENT"
                    </div>
                )
                }

            </>

            <select name="saison" onChange={(ev) => setSaison(ev.target.value)} >
                {items}
            </select>
            {detail.map((e) =>
                <Link className="link" to={"/e_detail/" + e.id}>
                    <div className="detail_episode">
                        <div >
                            <img src={e.picture} />
                        </div>
                        <div className="detail_resume">
                            <h3>{e.title}</h3>
                            <h4>episode : {e.episode}</h4>
                            < p > {e.description}</p>
                        </div>
                    </div>
                </Link>
            )}
        </div >
    )






}