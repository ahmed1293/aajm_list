import React, {useEffect, useState} from "react";
import Tile from "./Tile";
import ListForm from "./forms/ListForm";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
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
        }
        else {
            let data = await response.json();
            setData(data); setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading || error) {
        return <div className="container hero-body has-text-centered is-size-1 has-text-white">
            <FontAwesomeIcon className="fa-spin" icon={faSpinner}/>
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
