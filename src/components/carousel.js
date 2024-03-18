import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const API_KEY = process.env.REACT_APP_API_KEY
const id_user = localStorage.getItem('id_user');


export default function Random() {
    const [rand, setRand] = useState([]);
    const [discovery, setDiscovery] = useState([])
    const [favorite, setFavorite] = useState([])

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            slidesToSlide: 2 
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };

    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/favorites?client_id=${API_KEY}&id=${id_user}`)
            .then(res => res.json())
            .then(res => {
                setFavorite(res.shows);
            })
    }, []);
    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/random?client_id=${API_KEY}&nb=50`)
            .then(res => res.json())
            .then(res => {
                setRand(res.shows);
            })
    }, []);
    useEffect(() => {
        fetch(`https://api.betaseries.com/shows/discover?client_id=${API_KEY}&offset=50`)
            .then(res => res.json())
            .then(res => {
                setDiscovery(res.shows);
            })
    }, []);

    return (

        <div className="discover_body">
            
            <div className="discover_list">
                <h1 >Mes séries favorites</h1>
                <Carousel
                    swipeable={true}
                    draggable={true}
                    responsive={responsive}  
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                >

                    {favorite.map((e) =>
                        <div className="caroussel_item" >
                            <Link className="link" to={"/s_detail/" + e.id}>
                                <img className="carousel_img" src={e.images.poster == null ? "https://rukminim1.flixcart.com/image/416/416/k2p1q4w0/poster/t/v/q/medium-poster-for-room-and-office-motivational-poster-for-walls-original-imafen2z5gejnuzq.jpeg?q=70" : e.images.poster} alt="" />
                                <h3 className="titles">{e.title}</h3>
                            </Link>

                        </div>

                    )}
                </Carousel>
            </div>

            <div className="discover_list">
                <h1>À découvrir</h1>
                <Carousel
                    swipeable={false}
                    draggable={true}
                    responsive={responsive}
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                >
                    {discovery.map((e) =>
                        <div className="caroussel_item">
                            <Link className="link" to={"/s_detail/" + e.id}>
                                <img className="carousel_img" src={e.images.poster == null ? "https://rukminim1.flixcart.com/image/416/416/k2p1q4w0/poster/t/v/q/medium-poster-for-room-and-office-motivational-poster-for-walls-original-imafen2z5gejnuzq.jpeg?q=70" : e.images.poster} alt="" />
                                <h3 className="titles">{e.title}</h3>
                            </Link>

                        </div>

                    )}
                </Carousel>
            </div>
               
            <div className="discover_list">
                <h1>Séries aléatoires</h1>
                <Carousel
                    swipeable={false}
                    draggable={true}
                    responsive={responsive}
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                >
                    {rand.map((e) =>
                        <div className="caroussel_item">
                            <Link className="link" to={"/s_detail/" + e.id}>
                                <img className="carousel_img" src={e.images.poster == null ? "https://rukminim1.flixcart.com/image/416/416/k2p1q4w0/poster/t/v/q/medium-poster-for-room-and-office-motivational-poster-for-walls-original-imafen2z5gejnuzq.jpeg?q=70" : e.images.poster} alt="" />
                                <h3 className="titles">{e.title}</h3>
                            </Link>
                        </div>
                    )}
                </Carousel>
            </div>

        </div>
    )
}