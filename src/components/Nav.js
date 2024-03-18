import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useHistory } from "react-router";
import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY

export default function Nav() {
    const [data, setData] = useState(null);
    const id_user = localStorage.getItem('id_user');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${id_user}`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then((res) => {
            setData(res.member);
        })
        .catch(err => console.error(err))
        
    }, [])

    const handleClick = () => {
        let token = localStorage.getItem('token');

        fetch(`https://api.betaseries.com/members/destroy`, {
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: `token=${token}`,
        })
        .then(() => {
            localStorage.removeItem('token');
            navigate("/")
            window.location.reload();
        })
        .catch(err => console.error(err))
    }

    return (
        <div id="nav">

            <div id="homeLink">
                <Link to="/" className="navLinks" id="Logo" >Previously On</Link>
                <div id="search-barre" style={ (location.pathname == "/search") ? {visibility : "hidden"} : {visibility : "visible"}}>
                    <div className="champs cent">
                        <label>Rechercher une série, un film...</label>
                        <input type="text" id="search-input-nav"></input>
                    </div>

                    <div className="button" onClick={() => {navigate("/search")}}>Rechercher</div>
                    
                </div>
            </div>

            

            <div id="userLinks">
                <Link to="/profil" className="navLinks" >
                    <div className="img-nav-wrapper">
                        {(data && data.avatar) ?
                            <img src={data.avatar} alt="Avatar" className="avatar" />
                            :
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" alt="Avatar" className="avatar" />
                        }
                    </div>
                </Link>

                <Link to="/" className="navLinks" onClick={handleClick} id="deco">Se déconnecter</Link>
            </div>

        </div>
    )
}