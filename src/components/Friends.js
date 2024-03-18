import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilDetail from "./ProfilDetail";

const API_KEY = process.env.REACT_APP_API_KEY

export default function Friends(){
    const [data, setData] = useState(null);
    const [dataBlocked, setDataBlocked] = useState(null)
    const [notif, setNotif] = useState([]);
    const [loginFriends, setLoginFriends] = useState([]);
    const [loginBlocked, setLoginBlocked] = useState([]);
    const [dataRecherche, setDataRecherche] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [openBlocked, setOpenBlocked] = useState(false);
    const [openProfilDetail, setOpenProfilDetail] = useState(false)
    const [idProfilDetail, setIdProfilDetail] = useState(0)

    const id_user = localStorage.getItem('id_user');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    
    useEffect(() => {
        let tab = [];
        let tab_blocked = [];
        let tab_members_notif = [];

        let tabLogins = [];
        let tabLoginsBlocked = [];
        
        //Récupére la liste des amis et va chercher grace a une boucle individuelement les infos de chaques membres
        fetch(`https://api.betaseries.com/friends/list?key=${API_KEY}&id=${id_user}&token=${token}&blocked=false`)
        .then(res => res.json())
        .then(async res => {
            let users = res.users
            // console.log(users);
            for(let i = 0; i < users.length; i++){
                res = await fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${users[i].id}`)
                res = await res.json()
                tab[i] = res.member
                tabLogins.push(res.member.login);
            }
            // console.log(tab)
            setData(tab)
            setLoginFriends(tabLogins);
        })
        .catch(err => console.error(err))

        //Récupére la liste des membres bloqués et va chercher grace a une boucle individuelement les infos de chaques membres
        fetch(`https://api.betaseries.com/friends/list?key=${API_KEY}&token=${token}&blocked=true`)
        .then(res => res.json())
        .then(async res => {
            let users = res.users
            // console.log(users);
            for(let i = 0; i < users.length; i++){
                res = await fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${users[i].id}`)
                res = await res.json()
                tab_blocked[i] = res.member
                tabLoginsBlocked.push(res.member.login);
            }
            // console.log(tab)
            setDataBlocked(tab_blocked)
            setLoginBlocked(tabLoginsBlocked);
        })
        .catch(err => console.error(err))

        //Récupère la liste des notifications
        fetch(`https://api.betaseries.com/members/notifications?key=${API_KEY}&token=${token}&types=friend`, {
            method : 'GET',
        })
        .then(res => res.json())
        .then(async res => {
            console.log(res);
            let notifications = res.notifications;
            for(let i = 0; i < notifications.length; i++){
                res = await fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${notifications[i].ref_id}`)
                res = await res.json()
                console.log(res)
                tab_members_notif[i] = { id_notif : notifications[i].ref_id, member : res.member }
            }
            setNotif(tab_members_notif);

        })
        
    }, [dataRecherche, refresh, idProfilDetail])

    const recherche_membre = (login) => {

        login = "%"+login+"%";
        let tab = [];
        fetch(`https://api.betaseries.com/members/search?key=${API_KEY}&login=${login}`)
        .then(res => res.json())
        .then(async res => {
            let users = res.users
            // console.log(users)
            for(let i = 0; i < users.length; i++){
                res = await fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${users[i].id}`)
                res = await res.json()
                // console.log(res)
                tab[i] = res.member
            }
            setDataRecherche(tab)
        })
        .catch(err => console.error(err))
    }

    const handleRecherche = () => {
        let input = document.getElementById('input-recherche-amis');
        recherche_membre(input.value);
    }

    const handleDetailProfil = async (id) => {
        // console.log(id)
        await setIdProfilDetail(id);
        // setOpenProfilDetail(true);
        setRefresh(!refresh);
    }

    const handleNotif = (id_notif) => {
        fetch(`https://api.betaseries.com/members/notification`, {
            method : 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${id_notif}`
        })
        .then(setRefresh(!refresh))
        .catch(err => console.error(err))
    }

    const ajouter_ami = (id) => {
        fetch(`https://api.betaseries.com/friends/friend`, {
            method : 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${id}`
        })
        .then(setRefresh(!refresh))
        .catch(err => console.error(err))

    }

    const delete_ami = (id) => {
        fetch(`https://api.betaseries.com/friends/friend`, {
            method : 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${id}`
        })
        .then(setRefresh(!refresh))
        .catch(err => console.error(err))

    }

    const unblock_membre = (id) => {
        fetch(`https://api.betaseries.com/friends/block`, {
            method : 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${id}`
        })
        .then(setRefresh(!refresh))
        .catch(err => console.error(err))
    }

    const block_membre = (id) => {
        delete_ami(id);

        fetch(`https://api.betaseries.com/friends/block`, {
            method : "POST", 
            headers: new Headers({
                'Content-Type' : 'application/x-www-form-urlencoded',
            }),
            body : `key=${API_KEY}&token=${token}&id=${id}`
        })
        .then(setRefresh(!refresh))
        .catch(err => console.error(err))
    }
    
    return (
        <>
        {/* { console.log(openProfilDetail)} */}
        {(data && notif) ?
            <>
            <div id="friends-page">
                <div className="title-friend">
                    <h1 className="blue title-h1"> Mes Amis </h1>
                    {(openBlocked)?
                        <span className="blue block-link" onClick={() => {setOpenBlocked(false)}}>Revenir à mes amis</span>
                    :
                        <span className="blue block-link" onClick={() => {setOpenBlocked(true)}}>Voir les membres que j'ai bloqué</span>
                    }
                </div>
                {(idProfilDetail > 0) &&
                    <ProfilDetail setId={setIdProfilDetail} id={idProfilDetail} />
                }
                {(openBlocked)?
                    <div id="list-blocked">
                        <h4 className="blue bold margin-auto width-fit-content">Liste des membres que j'ai bloqué</h4>
                        {/* {console.log(dataBlocked)} */}
                        {(dataBlocked)?
                            dataBlocked.map((user, i) => (
                                <div className="thumbnail-friend" key={i}>
                                    <div id={user.id} className="amis" onClick={(e) => {handleDetailProfil(e.target.id)}}>
                                        <div className="img-friend-wrapper">
                                        {(data.avatar) ?
                                            <img src={data.avatar} alt="Avatar" className="avatar" />
                                        :
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" alt="Avatar" className="avatar" />
                                        }
                                        </div>
                                        <p className="friend-login">{user.login}</p>
                                    </div>
                                        <p className="stats-friend">Ami(s) : {user.stats.friends}</p>
                                        <p className="stats-friend">xp : {user.xp}</p>
                                    <br></br>
                                    <div id={user.id} className="button" onClick={(e) => unblock_membre(e.target.id)} >Débloquer le membre</div>
                                </div>
                            ))
                            
                        :
                            <p>Chargement...</p>
                        }
                    </div>
                
                :
                <>
                {console.log(notif)}
                    <ul>
                    {(notif.length > 0) &&
                        notif.map((user, i) => (
                            <li id={user.id_notif} className="notif" key={i} ><p><b>{user.member.login}</b> souhaite être votre ami !</p> <div className="choix"><div className="button" id={user.member.id} onClick={(e) => {ajouter_ami(e.target.id); handleNotif(e.target.parentNode.parentNode.id)}}>Ajouter comme ami</div><p className="ignorer"  onClick={(e) => {handleNotif(e.target.parentNode.parentNode.id)}}>Ignorer</p></div></li>

                        ))
                    }
                    </ul>
                    <div id="mes-amis">
                        
                        {
                            // console.log(data),
                            data.map((user, i) => (
                                <div className="thumbnail-friend" id={user.id} key={i}>
                                    {/* {console.log(user.id)} */}
                                    <div id={`${user.id}`} className="amis" onClick={(e) => {handleDetailProfil(e.target.parentNode.parentNode.id)}}>
                                        <img id={user.id} src="./block.png" alt="bloquer" className="block-icon" onClick={(e) => { block_membre(e.target.id) }}/>
                                        <div className="img-friend-wrapper">
                                        {(user.avatar) ?
                                            <img src={user.avatar} alt="Avatar" className="avatar" />
                                        :
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" alt="Avatar" className="avatar" />
                                        }
                                        </div>
                                        <p className="friend-login">{user.login}</p>
                                    </div>
                                        <p className="stats-friend">Ami(s) : {user.stats.friends}</p>
                                        <p className="stats-friend">xp : {user.xp}</p>
                                    <br></br>
                                    <div id={user.id} className="button" onClick={(e) => delete_ami(e.target.id)} >Retirer des amis</div>
                                </div>
                            ))
                        }
                    </div>
                    <h1 className="blue">Rechercher des amis</h1>
                    <div className="zone-recherche">
                        <input type="text" id="input-recherche-amis"/>
                        <div className="button-recherche blue" onClick={handleRecherche}>Recherche</div>
                    </div>
                    
                    <div id="recherche-amis">
                    {(dataRecherche.length > 0) && 
                        dataRecherche.map((user, i) => (
                            <div key={i}>
                                {(!loginBlocked.includes(user.login)) &&
                                <div className="thumbnail-friend" id={i}>
                                    <div id={user.id} className="amis" onClick={(e) => {handleDetailProfil(e.target.parentNode.parentNode.id)}}>
                                        <img id={user.id} src="./block.png" alt="bloquer" className="block-icon" onClick={(e) => { block_membre(e.target.id) }}/>
                                        <div className="img-friend-wrapper">
                                        {(user.avatar) ?
                                            <img src={user.avatar} alt="Avatar" className="avatar" />
                                        :
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" alt="Avatar" className="avatar" />
                                        }
                                        </div>
                                        <p className="friend-login">{user.login}</p>
                                    </div>
                                        <p className="stats-friend">Ami(s) : {user.stats.friends}</p>
                                        <p className="stats-friend">xp : {user.xp}</p>
                                    <br></br>
                                    {(loginFriends.includes(user.login)) ?
                                        <p className="ami-legende">Ami</p>
                                    :
                                        <div id={user.id} className="button" onClick={(e) => ajouter_ami(e.target.id)}>Ajouter comme amis</div>
                                    }   
                                </div>
                                }
                            </div>
                        ))
                    }
                    </div>
                </>
                }
            </div>
        </>  
        :
        <>
            <p>Chargement...</p>
        </>
        }
        </>
    )
}