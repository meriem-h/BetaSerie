import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


const API_KEY = process.env.REACT_APP_API_KEY
const API_SECRET_KEY = process.env.REACT_APP_API_SECRET_KEY

export default function ProfilEdit() {

    const [erase, setErase] = useState(false)
    const [email, setEmail] = useState(false)
    const [password, setPassword] = useState(false)
    const [new_email, setNewEmail] = useState("")
    const [confirm_email, setConfirmEmail] = useState("")
    const [current_pass, setCurenPass] = useState("")
    const [new_pass, setNewPass] = useState("")
    const [confirmed_pass, setConfirmedPass] = useState("")

    const token = localStorage.getItem('token');

    useEffect(() => {

        var requestOptions = {
            method: 'POST',
        };

        if (erase) {
            fetch(`https://api.betaseries.com/members/delete?token=${token}&client_id=${API_KEY}`, requestOptions)
            .catch(err => console.error(err))
            alert("un email de confirmation vous a était envoyer")
            setErase(false)
        }
        if (email && confirm_email == new_email) {
            fetch(`https://api.betaseries.com/members/email?email=${new_email}token=${token}&client_id=${API_KEY}`, requestOptions)
            .catch(err => console.error(err))
            alert(`votre adress email a etait changer pour ${new_email}`)
            setEmail(false)
        }
        if (password) {
            fetch(`https://api.betaseries.com/members/password?token=${token}&client_id=${API_KEY}&current_password=${current_pass}&new_password=${new_pass}&confirmed_password=${confirmed_pass}`, requestOptions)
            .catch(err => console.error(err))
            alert(`votre mot de passe a etait changer`)
            setPassword(false)
        }


    }, [erase, email, password])

    return (
        <div id="edit_body">

            <div className="forms-edit">
                <h2 className="title-edit">Modifier mon adresse mail</h2>
                <form className="form-edit">

                    <div className="champs">
                        <label>Votre nouvelle adresse e-mail :</label>
                        <input className="input-edit" type="email" placeholder="nouveau mail" onChange={(e) => setNewEmail(e.target.value)} />
                    </div>

                    <div className="champs">
                        <label>confirmer nouvelle adresse e-mail :</label>
                        <input className="input-edit" type="email" placeholder="confirmer nouveau mail" onChange={(e) => setConfirmEmail(e.target.value)} />
                    </div>

                    <input className="button button-edit" type="submit" onClick={(e) => { setEmail(true) }} value="mettre a jours l'adress e-mail" />
                </form>

                <h2 className="title-edit">Modifier mon mot de passe</h2>
                <form className="form-edit"> 
                    <div className="champs">
                        <label>Votre mot de passe actuelle :</label>
                        <input className="input-edit" type="password" placeholder="mot de passe actuelle" onChange={(e) => setCurenPass(e.target.value)} />
                    </div>

                    <div className="champs">
                        <label>Votre nouveau mot de passe :</label>
                        <input className="input-edit" type="password" placeholder="nouveau mot de passe" onChange={(e) => setNewPass(e.target.value)} />
                    </div>

                    <div className="champs">
                        <label>Confirmer votre nouveau mode de passe :</label>
                        <input className="input-edit" type="password" placeholder="confirmer nouveau mot de passe" onChange={(e) => setConfirmedPass(e.target.value)} />
                    </div>

                    <input className="button button-edit" type="submit" onClick={(e) => { setPassword(true) }} value="mettre a jours le mot de passe" />

                </form>

                <button className="button margin-auto delete-user-button" onClick={() => { setErase(true) }}> supprimer mon compte </button>
            </div>

        </div>
    )
}