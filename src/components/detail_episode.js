import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = process.env.REACT_APP_API_KEY

export default function Detail() {
    const [episode, setEpisode] = useState({});
    const [coms, setComs] = useState([]);
    const [text, setText] = useState("");
    const [newCom, setNewCom] = useState(false)
    const { id } = useParams();

    const token = localStorage.getItem('token');

    const items = []
    const img = []

    var optionsPost = {
        method: 'POST',
    };

    useEffect(() => {

        fetch(`https://api.betaseries.com/episodes/display?id=${id}&client_id=${API_KEY}`)
            .then(res => res.json())
            .then(res => {
                fetch(`https://api.betaseries.com/pictures/episodes?id=${id}&client_id=${API_KEY}`)
                    .then(images => {
                        res.episode.picture = images.url
                        setEpisode(res.episode);
                    })
            })

    }, []);

    useEffect(() => {
        if (newCom) {
            fetch(`https://api.betaseries.com/comments/comment?client_id=${API_KEY}&type=episode&id=${id}&token=${token}&text=${text}`, optionsPost)
            setNewCom(false)
        }
        fetch(`https://api.betaseries.com/comments/comments?client_id=${API_KEY}&type=episode&id=${id}&order=desc`)
            .then(res => res.json())
            .then(res => {
                setComs(res.comments)
            })
    }, [newCom])

    return (
        <div className="detai">
            <div className="detail_content">

                <div className="content_left">
                    <p>date de difusion : {episode.date}</p>
                    <p>note : {episode.note?.mean}</p>
                </div>
                <div className="content_center">
                    <div className="path">
                        <Link className="link" to={"/"}>
                            Accueil
                        </Link>
                        →
                        <Link className="link" to={"/s_detail/" + episode.show?.id}>
                            {episode.show?.title}
                        </Link>
                        →
                        <Link className="link" to={"/e_detail/" + id}>
                            {episode.code}
                        </Link>

                    </div>

                    <h2 className="h1_detail">{episode.title}</h2>
                    <p>{episode.description}</p>

                </div>
                <div className="content_right">
                    <img className="detail_poster" src={episode.picture} alt="" />
                </div>
            </div>

            <hr className="hr-episodes" />

            <section id="commentaires">
                <div className="publier-com">
                    <textArea cols="60" rows="10" className="new_coms" placeholder="Votre commentaire" onChange={(e) => setText(e.target.value)} />
                    <button className="button button-publie" onClick={() => setNewCom(true)}>Publier</button>
                </div>
                {coms.map((e) =>
                    <div className="coms_body">
                        <div className="coms_avatar">
                            <img className="coms_img" src={e.avatar == null ? "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010"
                                : e.avatar
                            } alt={e.login} />
                        </div>
                        <div className="coms_text">
                            <div className="coms_info">
                                <p>{e.login}</p>
                                {/* <p>{e.id}</p> */}
                                <p>{e.date}</p>
                            </div>
                            <br />
                            <p>{e.text}</p>
                        </div>
                    </div>
                )}
            </section>

        </div >
    )

}