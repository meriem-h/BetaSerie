import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_KEY = process.env.REACT_APP_API_KEY
const API_SECRET_KEY = process.env.REACT_APP_API_SECRET_KEY
const md5 = require('md5');

export default function Connexion(){
    const [openRegister, setOpenRegister] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const navigate = useNavigate();

    const urlAuth = "https://www.betaseries.com/authorize";
    const urlSignUp = "https://api.betaseries.com/members/signup"

    useEffect(() => {
        let register = document.getElementById('inputs');
        // console.log(register);
        if(openRegister){
            register.style.display = "block";
        }else if(register){ 
            register.style.display = "none";
        }
    }, [openRegister, errorMsg])

    const collect_and_send = () => {
        let pseudo = document.getElementById('pseudo').value;
        let mail = document.getElementById('mail').value;
        let password = document.getElementById('password').value;
        password = md5(password);
        fetch(`${urlSignUp}`, {
            method : 'POST', 
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&login=${pseudo}&password=${password}&email=${mail}` 
        })
        .then(res => res.json())
        .then(res => {
            //  console.log(res)
            setErrorMsg(res.errors[0]?.text);
            if(res.token){
                localStorage.setItem('token', res.token);
                localStorage.setItem('id_user', res.user.id);
                navigate("/");
            }
        })
        .catch(err => console.error(err))
    }


    return (
        <>
        <div id="connexion-page">
            <form id="form-user-edit">
                <h1 id="title-connect">Previously On</h1>
                <div className="button button-connect" onClick={() => {setOpenRegister(!openRegister)}} >S'inscrire avec betaseries</div>
                <div id="inputs">
                    <p className="sub-text">/!\ L'inscription via ce formulaire se passe sur un site tiers (betaseries.com) c'est lui qui est responsable de vos données.</p>
                    <div className="champs">
                        <label htmlFor="pseudo">Pseudo</label>
                        <input type="text" name="pseudo" id="pseudo"></input>
                    </div>
                    <div className="champs">
                        <label htmlFor="mail">E-mail</label>
                        <input type="mail" name="mail" id="mail"></input>
                    </div>
                    <div className="champs">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" name="password" id="password"></input>
                    </div>
                    <p className="sub-text">Le remplissage de tout les champs est requis pour l'inscription </p>
                    <p className="error-msg">{errorMsg}</p>
                    <div className="button button-connect" onClick={collect_and_send}>Valider</div>
                </div>
                <a href={`${urlAuth}?client_id=${API_KEY}&redirect_uri=http://localhost:3000/`} className="button button-connect">Se connecter avec betaseries</a>
                <p className="sub-text text-center">Vous redirige temporairement vers le site betaseries</p>
            </form>
        </div>
        </>
    )
}