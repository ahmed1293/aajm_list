import React, {useEffect, useState} from "react";
import Tile from "./Tile";
import ListForm from "./forms/ListForm";
import {faSpinner, faFrown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default function Tiles() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function fetchData() {
        setLoading(true);
        let response = await fetch('api/shopping-lists/');
        if (response.status !== 200) {
            setError(true);
            setLoading(false);
        }
        else {
            let data = await response.json();
            setData(data); setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="container hero-body has-text-centered is-size-1 has-text-white" data-testid='spinner'>
            <FontAwesomeIcon className="fa-spin" icon={faSpinner}/>
        </div>
    }
    else if (error) {
        return <div className="container hero-body has-text-centered is-size-1 has-text-danger" data-testid='sad-face'>
            <FontAwesomeIcon icon={faFrown}/>
        </div>
    }
    return <div>
        <ListForm callback={fetchData}/>
        <section className="section">
            <div className="container">
                <div className="tile is-ancestor flex-wrap">
                    {data.map(list => <Tile key={list.id} instance={list} id={list} fetchLists={fetchData}/>)}
                </div>
            </div>
        </section>
    </div>
}
