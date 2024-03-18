import { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY

export function AddShow({ id }) {
    const [addIcon, setAdd] = useState("https://img.icons8.com/external-becris-lineal-becris/64/4a90e2/external-add-mintab-for-ios-becris-lineal-becris-2.png")
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
        fetch(`https://api.betaseries.com/shows/member?client_id=${API_KEY}&id=${id_user}`, optionsGet)
        .then(res => res.json())
        .then(res => {
            res.shows.forEach(element => {
                if (element.id == id) {
                    setAdd("https://img.icons8.com/fluency-systems-regular/48/4a90e2/checkmark--v1.png")
                    setAdded(true)
                }
            });
        })
        .catch(err => console.error(err))

}, []);

    function add() {

        fetch(`https://api.betaseries.com/shows/show?id=${id}&token=${token}&client_id=${API_KEY}`, optionsPost)
        .catch(err => console.error(err))

        setAdd("https://img.icons8.com/fluency-systems-regular/48/4a90e2/checkmark--v1.png")
        setAdded(true)
    }

    function remove() {

        fetch(`https://api.betaseries.com/shows/show?id=${id}&token=${token}&client_id=${API_KEY}`, optionDelete)
        .catch(err => console.error(err))
        
        setAdd("https://img.icons8.com/external-becris-lineal-becris/64/4a90e2/external-add-mintab-for-ios-becris-lineal-becris-2.png")
        setAdded(false)

    }

    return (
        <div  className="btn_add added">
            <img alt="add" onClick={added == true ? remove : add} src={addIcon} />
        </div>
    )
}
