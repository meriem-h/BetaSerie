import { useEffect, useState } from "react"
import ProfilEdit from "./ProfilEdit.js";
import bannierHolder from "../honeycomb.png";
import ListNonVue from "./ListNonVue.js";
import ListVue from "./ListVue.js";
import Friends from "./Friends.js";
import PhotoEdit from "./PhotoEdit.js";
import BannerEdit from "./BannerEdit.js";

const API_KEY = process.env.REACT_APP_API_KEY

export default function Profil(){
    const [data, setData] = useState(null);
    const [nbNotif, setNbNotif] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [timeSpend, setTimeSpend] = useState(null);
    const [timeToSpend, setTimeToSpend] = useState(null);
    const [list, setList] = useState('non-vue')
    const id_user = localStorage.getItem('id_user');
    const token = localStorage.getItem('token');
    
    useEffect(() => {

        fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${id_user}`, {
            method : 'GET',
        })
        .then(res => res.json())
        .then((res) => {
            setData(res.member);
            let timeSpend = res.member.stats.time_on_movies + res.member.stats.time_on_tv;
            let timeToSpend = res.member.stats.time_to_spend_movies + res.member.stats.time_to_spend;
            setTimeSpend(timeSpend);
            setTimeToSpend(timeToSpend);

            fetch(`https://api.betaseries.com/members/notifications?key=${API_KEY}&token=${token}&types=friend`, {
                method : 'GET',
            })
            .then(res => res.json())
            .then(res => setNbNotif(res.notifications.length))

        })
        .catch(err => console.error(err))

        
        
    }, [openModal])

    const min_to_more = (mins) => {
        
        if(mins == 0)
            return "0 minutes";

        var units = {
            "année": 24*60*365,
            "mois": 24*60*30,
            "semaine": 24*60*7,
            "jour": 24*60,
            "heure" : 60,
            "minute": 1
        }
        
        var result = []
        
        for(var name in units) {
          var p =  Math.floor(mins/units[name]);
          if(p == 1) result.push(p + " " + name + " ");
          if(p >= 2) result.push(p + " " + name + "s ");
          mins %= units[name]
        
        }
        
        return result;
    }

    const affiche_list = (list) => {
        let component;
        switch(list){
            case "non-vue" :
                component = <ListNonVue />;
            break;
            case "vue" :
                component = <ListVue />;
            break;
            case "friends" :
                component = <Friends />;
            break;
        }
        return component;
    }

    const change_avatar = () => {

    }

    const change_banner = () => {

    }

    const affiche_forms_edit = (form) => {
        let component;
        switch (form){
            case "edit-profil" :
                component = <ProfilEdit />;
            break;
            case "edit-photo-profil" :
                component = <PhotoEdit />
            break;
            case "edit-banner-profil" :
                component = <BannerEdit />
            break;              
        }
        return component;
    }



    return (

        (data) ?
        <>
        <div className="banner-wrapper cursor" onClick={() => setOpenModal('edit-banner-profil')}>
            {(data.profile_banner) ?
                <div className="banner" style={{background : `linear-gradient(rgba(19, 59, 87, 0), rgba(19, 59, 87, 0.5)), url('${data.profile_banner}')`}} />
            :
                <div className="banner" style={{background : `linear-gradient(rgba(19, 59, 87, 0), rgba(19, 59, 87, 0.5)), url('${bannierHolder}')`}} />
            }
        </div>
        <div id="profil">
            <div className="infos-profil">
                <div className="sub-infos-profil">
                    <div className="img-profil-wrapper cursor" onClick={() => setOpenModal('edit-photo-profil')}>
                    {(data.avatar) ?
                        <img src={data.avatar} alt="Avatar" className="avatar" />
                    :
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" alt="Avatar" className="avatar" />
                    }
                    </div>
                    <h2 className="title-name">{data.login}</h2>
                    <div className="button modif" onClick={() => {setOpenModal('edit-profil')}} >Modifier le profil</div>
                </div>
                <div className="stats">
                    <div className="stats-membre">
                        <p><span id='xp'>XP</span> <span className="clock">{data.xp}</span><span className="right">Membre depuis <span className="clock"> {data.stats.member_since_days} </span>jours</span></p>
                        <div className="row-stat">
                            <div className="stat-item section">
                                <p className="blue bold large-font">{data.login}</p>
                                <div className="row-stat">
                                    <p className="stat-item"><span className="blue bold">Badge(s)</span><span className="clock">{data.stats.badges}</span></p>
                                    <hr className="hr-stat"></hr>
                                    <p className="stat-item"><span className="blue bold">Ami(s)</span><span className="clock">{data.stats.friends}</span></p>
                                    <hr className="hr-stat"></hr>
                                    <p className="stat-item"><span className="blue bold">Commentaire(s)</span><span className="clock">{data.stats.comments}</span></p>
                                </div>
                            </div>
                            <div className="row-stat">
                                <div className="stat-item section">
                                    <p className="blue bold large-font">Films</p>
                                    <div className="row-stat">
                                        <p className="stat-item"><span className="blue bold">À voir</span><span className="clock">{data.stats.movies_to_watch}</span></p>
                                        <hr className="hr-stat"></hr>
                                        <p className="stat-item"><span className="blue bold">Vu(s)</span><span className="clock">{data.stats.movies}</span></p>
                                    </div>
                                </div>
                                <div className="stat-item section">  
                                    <p className="blue bold large-font">Séries</p>
                                    <div className="row-stat">
                                        <p className="stat-item"><span className="blue bold">À voir</span><span className="clock">{data.stats.shows_to_watch}</span></p>
                                        <hr className="hr-stat"></hr>
                                        <p className="stat-item"><span className="blue bold">En cours</span><span className="clock">{data.stats.shows_current}</span></p>
                                        <hr className="hr-stat"></hr>
                                        <p className="stat-item"><span className="blue bold">Terminée(s)</span><span className="clock">{data.stats.shows_finished}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="stat-item section">  
                                <p className="blue bold large-font">Épisodes</p>
                                <div className="row-stat">
                                    <p className="stat-item"><span className="blue bold">À voir</span><span className="clock">{data.stats.episodes_to_watch}</span></p>
                                    <hr className="hr-stat"></hr>
                                    <p className="stat-item"><span className="blue bold">Vu(s)</span><span className="clock">{data.stats.episodes}</span></p>
                                    <hr className="hr-stat"></hr>
                                    <p className="stat-item"><span className="blue bold">Vus / mois</span><span className="clock">{data.stats.episodes_per_month}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stat-ecrans">
                        <p className="sub-stat"><span className="blue bold">Temps à passer devant un écran  </span> {min_to_more(timeToSpend)}</p>
                        <p className="sub-stat"><span className="blue bold">Temps passé devant un écran  </span> {min_to_more(timeSpend)}</p>
                    </div>
                </div>
            </div>
            {(openModal) &&
                <div className="modal-wrapper">
                <div className="modal">
                    <div className="button right" onClick={() => {setOpenModal(false)}}>x</div>
                    {
                        affiche_forms_edit(openModal)
                    }
                </div>
                </div>
            }
            <div className="sub-profil">
                <div className="menu">
                    <div className="button menu-item" onClick={() => {setList('non-vue')}}>À voir</div>
                    <div className="button menu-item" onClick={() => {setList('vue')}}>Déjà vus</div>
                    <div className="button menu-item" onClick={() => {setList('friends')}}>Mes Amis {(nbNotif > 0) && "("+nbNotif+")" }</div>
                </div>
                <div className="mes-series">
                {
                    affiche_list(list)
                }
                </div>
            </div>
        </div>
        </>        
        :
        <div>
            <p>Chargement...</p>
        </div>
    )
}