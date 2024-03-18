import {useState, useEffect} from "react";
import {Link} from "react-router-dom"
const API_KEY = process.env.REACT_APP_API_KEY

export default function ListVue(){
    const [series, setSeries] = useState(null);
    const [movies, setMovies] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const user_id = localStorage.getItem('id_user');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`https://api.betaseries.com/episodes/unrated?key=${API_KEY}&token=${token}&nbpp=10000`)
        .then(res => res.json())
        .then(res => {
            let tab = [];
            //Prépare un tableau d'objets représentant chaque serie.saison.episode et set les premières valeurs
            let series = [];
            let j = 0;
            for(let i = 0; i < res.episodes.length; i++){  

                if(!series.includes(res.episodes[i].show.title)){
                    tab[j] = { 'title' : res.episodes[i].show.title, 'id' : res.episodes[i].show.id, 'season' : [...[]]}
                    series.push(res.episodes[i].show.title);
                    j++;
                }  
            }

            //Insert dans l'objet.saison autant de tableau vide que le numero de saison max de chaque série pour pouvoir les remplirs ensuite des épisodes
            let maxSeason = 0;
            for(let j = 0; j < tab.length; j++){

                for(let i = 0; i < res.episodes.length; i++){
                    if(res.episodes[i].season > maxSeason && res.episodes[i].show.title == tab[j].title){
                        maxSeason = res.episodes[i].season 
                    }
                }

                for(let m = 0; m < maxSeason; m++){
                    tab[j].season.push([]);
                }
            }

            //Insert les épisodes dans les tableau vide de l'objet.saison à l'index correspondant à la saison dont est tiré l'épisode
            for(let j = 0; j < tab.length; j++){
                for(let i = 0; i < res.episodes.length; i++){
                    if(res.episodes[i].show.title == tab[j].title){
                        tab[j].season[res.episodes[i].season-1].push(res.episodes[i]);
                    }
                }
            }

            //Tri les épisodes dans chaque saisons et supprime les saisons vides
            let tmp;
            for(let j = 0; j < tab.length; j++){  
                for(let k = 0; k < tab[j].season.length; k++){
                    for(let l = 0; l < tab[j].season[k].length; l++){
                        if(tab[j].season[k][l].id < tab[j].season[k][l-1]?.id){
                            tmp = tab[j].season[k][l-1]
                            tab[j].season[k][l-1] = tab[j].season[k][l];
                            tab[j].season[k][l] = tmp;
                            l=0;
                        }
                    }
                }
                tab[j].season = tab[j].season.filter((saison) => saison.length > 0)
            }
            console.log(tab);
            setSeries(tab)
        })
        .catch(err => console.error(err))


        fetch(`https://api.betaseries.com/movies/member?key=${API_KEY}&id=${user_id}&state=${1}`)
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

    const marque_a_voir_movie = (idMovie) => {
        fetch(`https://api.betaseries.com/movies/movie`, {
            method : 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${idMovie}&state=${0}`
        })
        .then(res => res.json())
        .then(res => setRefresh(!refresh))
        .catch(err => console.error(err))
    }

    const marque_a_voir_episode = (idEpisode) => {
        fetch(`https://api.betaseries.com/episodes/watched`, {
            method : 'DELETE', 
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${idEpisode}`
        })
        .then(res => res.json())
        .then(res => setRefresh(!refresh))
        .catch(err => console.error(err))
    }

    const desarchiver_serie = (idSerie) => {
        fetch(`https://api.betaseries.com/shows/archive`, {
            method : 'DELETE', 
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', 
            }),
            body : `key=${API_KEY}&token=${token}&id=${idSerie}`
        })
        .then(res => res.json())
        .then(res => setRefresh(!refresh))
        .catch(err => console.error(err))
    }

    return (
        <>
        <h1 className="blue">Mes séries vues</h1>
        {
        (series) ?
        <>
        <ul id="seriesList">
            {
                series.map((show, i) => (
                    // console.log(show)
                    <div key={`divSerie${i}`}>
                    <li id={`serie${i+1}`} key={`serie${i+1}`} className="series listProfil" onClick={(e) => handleClick(e)}><Link to={`/s_detail/${show.id}`} key={`title${i}`} className="lien">{show.title}</Link><div className="vu right" key={`archive${i}`} onClick={() => {desarchiver_serie(show.id)}}>Sortir la série des archives</div></li>
                    <ul id={`serie${i+1}List`} key={`serie${i+1}List`} className='none seriesList'>
                    {
                        show.season.map((season, j) => (
                            <div key={`divSeason${j}`}>
                                
                                <li id={`S${i+1}S${j+1}`} key={`S${i+1}S${j+1}`} className="season listProfil" onClick={(e) => handleClick(e)}>Saison {season[j].season}</li>
                                <ul id={`S${i+1}S${j+1}List`} key={`S${i+1}S${j+1}List`} className='none listEpisode'>
                                {
                                    show.season[j].map((episode, k) => (
                                        <li id={`S${i+1}S${j+1}E${k+1}`} key={`S${i+1}S${j+1}E${k+1}`} className="episode">{episode.code} <Link to={`/e_detail/${episode.id}`} className="episode-title lien" key={`episode-title${i}`}>{episode.title}</Link> <div className="vu right" key={`vu${i}`} onClick={() => {marque_a_voir_episode(episode.id)}}>Marquer comme à voir</div></li>
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
        <h1 className="blue">Mes films vus</h1>
        {
            (movies) ?
            <>
            <ul id="moviesList" >
                {
                    movies.map((movie, i) => (
                        
                            <li id={`movie${i}`} key={`movie${i}`} className="movie"><p key={`movieTitle${i}`}>{movie.title}</p><div className="vu right"  key={`vuMovie${i}`} onClick={() => {marque_a_voir_movie(movie.id)}}>Marquer comme à voir</div></li>
                        
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