import { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY

export function Favorite({ id }) {
    const [Favorite, setFavorite] = useState("https://img.icons8.com/metro/26/4a90e2/like.png")
    const [isFavorite, setIsFavorite] = useState(false)
    const [added, setAdded] = useState(false)

    const id_user = localStorage.getItem('id_user');
    const token = localStorage.getItem('token');

    var optionsGet = {
        method: 'GET',
    };
    var optionsPost = {
        method: 'POST',
    };
    var optionDelete = {
        method: 'DELETE',
    };



    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/favorites?client_id=${API_KEY}&id=${id_user}`, optionsGet)
        .then(res => res.json())
        .then(res => {
            res.shows.forEach(element => {
                if (element.id == id) {
                    setFavorite("https://img.icons8.com/material/24/4a90e2/like--v1.png")
                    setIsFavorite(true)
                }
            });
        })
        .catch(err => console.error(err))

        fetch(`https://api.betaseries.com/shows/member?client_id=${API_KEY}&id=${id_user}`, optionsGet)
        .then(res => res.json())
        .then(res => {
            res.shows.forEach(element => {
                if (element.id == id) {
                    setAdded(true)
                }
            });
        })
        .catch(err => console.error(err))

    }, []);


    function dislike() {

        fetch(`https://api.betaseries.com/shows/favorite?client_id=${API_KEY}&token=${token}&id=${id}`, optionDelete)
        .catch(err => console.error(err))

        setFavorite("https://img.icons8.com/metro/26/4a90e2/like.png")
        setIsFavorite(false)
    }

    function like() {

        if (!added) {
            fetch(`https://api.betaseries.com/shows/show?id=${id}&token=${token}&client_id=${API_KEY}`, optionsPost)
            .catch(err => console.error(err))
        }
        
        fetch(`https://api.betaseries.com/shows/favorite?client_id=${API_KEY}&token=${token}&id=${id}`, optionsPost)
        .catch(err => console.error(err))

        setFavorite("https://img.icons8.com/material/24/4a90e2/like--v1.png")
        setIsFavorite(true)
    }

    return (
        <div className="btn_add">
            <img onClick={isFavorite == true ? dislike : like} src={Favorite} className="favorite" alt="favorite" />
        </div>
    )

}