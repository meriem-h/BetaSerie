import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_API_KEY

export default function PhotoEdit(){
    const [preview, setPreview] = useState(false) 
    const token = localStorage.getItem('token');


    useEffect(() => {

        console.log(preview)

    }, [preview])

    const change_avatar = () => {
        let input = document.getElementById("input-photo");
        let photo = new Image();
        photo.src = input.value;
        // console.log(input.value)

        // var canvas = document.createElement("canvas");
        // var url = canvas.toDataURL();

        // fetch(urlPhoto)
        // .then(async res => {
        //     const contentType = res.headers.get('content-type')
        //     const blob = await res.blob()
        //     // const file = new File([blob], fileName, { contentType })
        //     const img = await new Image();
        //     img.src = urlPhoto;
        console.log(API_KEY)
            let info = new FormData()
            // info.append('key', API_KEY)
            // info.append('token', token)
            // info.append('avatar', input.files[0])
            console.log(info)
            // access file here
            fetch(`https://api.betaseries.com/members/avatar`, {
                method: "POST",
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: `key=${API_KEY}&token=${token}&avatar=${input.files[0]}`,
            })
            .then((res) => {
                console.log(res)
            
            })
            .catch(err => console.error(err))
        // })
        
    }

    const preview_avatar = () => {
        let input = document.getElementById("input-url");
        let urlPhoto = input.value;
        setPreview(urlPhoto);
    }

    return (
        <div id="edit-photo-profil">
            <div className="forms-edit">
                <h2 className="title-edit">Modifier la photo de profil</h2>
                <form className="form-edit">

                    <div className="champs">
                        <label>Votre nouvelle photo :</label>
                        <input id="input-photo" type="file" />
                    </div>
                    <div className="img-profil-wrapper preview-wrapper">
                    {(preview) &&
                        <img src={preview} alt="preview de l'avatar" />
                    }
                    </div>

                    <div className="button button-edit" onClick={() => {preview_avatar()}}>
                        Preview
                    </div>

                    <div className="button button-edit" onClick={(e) => {change_avatar()}}>
                        mettre à jour ma photo de profil
                    </div>
                </form>
            </div>
        </div>
    )
}