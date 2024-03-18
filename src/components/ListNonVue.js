import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
const API_KEY = process.env.REACT_APP_API_KEY

export default function ListNonVue(){
    const [series, setSeries] = useState(null);
    const [movies, setMovies] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const user_id = localStorage.getItem('id_user');
    const token = localStorage.getItem('token');

    useEffect(() => {

        fetch(`https://api.betaseries.com/episodes/list?key=${API_KEY}&token=${token}`)
        .then(res => res.json())
        .then(res => {
            let tab = [];
            let nbSeason = [];
            // console.log(res)
            //Prépare un tableau d'objets représentant chaque serie.saison.episode, set les premières valeurs et récupère la saison de l'épisode à voir le plus récent
            for(let i = 0; i < res.shows.length; i++){

                tab[i] = { 'title' : res.shows[i].title, 'id' : res.shows[i].id, 'season' : [...[]] }

                for(let j = 0; j < res.shows[i].unseen.length; j++){
                    if(j == res.shows[i].unseen.length-1){
                        nbSeason.push(res.shows[i].unseen[j].season);
                    }   
                }
            }

            //insert un tableau vide pour chaque saison potentielle de la série et le remplis des épisodes correspondant puis retire les tableaux restés vides
            for(let i = 0; i < res.shows.length; i++){

                for(let j = 0; j < nbSeason[i]; j++){

                    tab[i].season.push([])

                    for(let k = 0; k < res.shows[i].unseen.length; k++){

                        if(res.shows[i].unseen[k].season == j+1){

                            tab[i].season[j].push(res.shows[i].unseen[k]);
                        }
                    }
                }
                
                tab[i].season = tab[i].season.filter((saison) => saison.length > 0)
            }

            setSeries(tab);
        })
        .catch(err => console.error(err));

        fetch(`https://api.betaseries.com/movies/member?key=${API_KEY}&id=${user_id}&state=${0}`)
        .then(res => res.json())
        .then(res => {
            setMovies(res.movies)
        })
        .catch(err => console.error(err))

    }, [refresh])  

    const handleClick = (e) => {

        let idList = e.target.id+"List"
        let list = document.getElementById(idList);

        if(list.classList.contains('none')){
            list.classList.remove('none')
        }else{
            list.classList.add('none')
            list.children[1]?.classList.add('none')
        }
    }

    const marque_vu_serie = (idEpisode, idSerie) => {
        fetch(`https://api.betaseries.com/episodes/watched`, {
            method : 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${idEpisode}`
        })
        .then(res => res.json())
        .then(res => {
            setRefresh(!refresh)
        })
        .catch(err => console.error(err))
    }

    const marque_vu_movie = (idMovie) => {
        fetch(`https://api.betaseries.com/movies/movie`, {
            method : 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${idMovie}&state=${1}`
        })
        .then(res => res.json())
        .then(res => {
            setRefresh(!refresh)
        })
        .catch(err => console.error(err))
    }

    const archive_serie = (idSerie) => {
        fetch(`https://api.betaseries.com/shows/archive`, {
            method : 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${idSerie}`
        })
        .then(res => res.json())
        .then(res => {
            setRefresh(!refresh)
        })
        .catch(err => console.error(err))
    }

    return (
        <>
        <h1 className="blue">Mes séries à voir</h1>
        {
        (series) ?
        <>
        <ul id="seriesList">
            {
                series.map((show, i) => (
                    <div key={`divSerie${i}`}>
                    
                    <li id={`serie${i+1}`} key={`serie${i+1}`} className="series listProfil" onClick={(e) => handleClick(e)}><Link to={`/s_detail/${show.id}`} key={`title${i}`} className="lien">{show.title}</Link><div className="vu right" onClick={() => {archive_serie(show.id)}} key={`archive${i}`} >Archiver la série</div></li>
                    <ul id={`serie${i+1}List`} key={`serie${i+1}List`} className='none seriesList'>
                    {
                        show.season.map((season, j) => (
                            <div key={`divSeason${j}`}>
                                <li id={`S${i+1}S${j+1}`} key={`S${i+1}S${j+1}`} className="season listProfil" onClick={(e) => handleClick(e)}>Saison {season[j]?.season}</li>
                                <ul id={`S${i+1}S${j+1}List`} key={`S${i+1}S${j+1}List`} className='none listEpisode'>
                                {
                                    show.season[j].map((episode, k) => (
                                        <li id={`S${i+1}S${j+1}E${k+1}`} key={`S${i+1}S${j+1}E${k+1}`} className="episode">{episode.code} <Link to={`/e_detail/${episode.id}`} className="episode-title lien" key={`episode-title${i}`}>{episode.title}</Link> <div key={`vu${i}`} className="vu right" onClick={() => {marque_vu_serie(episode.id, show.id)}}>Marquer comme vu</div></li>
                                    ))
                                }
                                </ul>
                            </div>
                            
                        ))    
                    }
                    </ul>
                    </div>
                ))
            }
        </ul>
        <br></br>
        
        </>
        :
        <>
            Chargement...
        </>
        }

        <br></br>
        <h1 className="blue">Mes films à voir</h1>
        {
            (movies) ?
            <>
            <ul id="moviesList">
                {
                    movies.map((movie, i) => (
                        <li id={`movie${i}`} key={`movie${i}`} className="movie"><p key={`movieTitle${i}`}>{movie.title}</p><div className="vu right" key={`vuMovie${i}`} onClick={() => {marque_vu_movie(movie.id)}}>Marquer comme vu</div></li>
                    ))
                }
            </ul>
            </>
            :
            <>
            Chargement...
            </>
        }
        </>
    )
}