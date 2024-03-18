import { useEffect, useState } from "react"
import bannierHolder from "../honeycomb.png";

const API_KEY = process.env.REACT_APP_API_KEY

export default function ProfilDetail(props){
    const [idUser, setIdUser] = useState(props.id);
    const [data, setData] = useState(null);
    const [timeSpend, setTimeSpend] = useState(null);
    const [timeToSpend, setTimeToSpend] = useState(null);

    useEffect(() => {
        fetch(`https://api.betaseries.com/members/infos?key=${API_KEY}&id=${idUser}`)
        .then(res => res.json())
        .then(res => {
            setData(res.member)
            let timeSpend = res.member.stats.time_on_movies + res.member.stats.time_on_tv;
            let timeToSpend = res.member.stats.time_to_spend_movies + res.member.stats.time_to_spend;
            setTimeSpend(timeSpend);
            setTimeToSpend(timeToSpend)
        })
        .catch(err => console.error(err))
    }, [])

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


    return (
        <div id="modal-detail-profil">
            <div className="close" onClick={() => { props.setId(0) }}>FERMER</div>
            {(data) ?
            <>
                {(data.profile_banner) ?
                    <div className="banner-mini" style={{background : `linear-gradient(rgba(19, 59, 87, 0), rgba(19, 59, 87, 0.5)), url('${data.profile_banner}')`}} />
                :
                    <div className="banner-mini" style={{background : `linear-gradient(rgba(19, 59, 87, 0), rgba(19, 59, 87, 0.5)), url('${bannierHolder}')`}} />
                }
                <div className="info-detail-profil">
                    <div className="info-base">
                        <div className="img-profil-wrapper mini-wrapper">
                            {(data.avatar) ?
                                <img src={data.avatar} alt="Avatar" className="avatar" />
                            :
                                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010" alt="Avatar" className="avatar" />
                            }
                        </div>
                        <p className="login-detail-profil">{data.login}</p>
                    </div>
                    <div className="sub-info-detail-profil">
                            
                        <div className="stats stats-detail-profil">
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
                </div>
            </>
            :
            <>
                <p>Chargement...</p>
            </>
            
            }

        </div>
    )
}