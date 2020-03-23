import React, {useContext, useEffect, useState} from "react";
import Tile from "./Tile";
import {faSpinner, faFrown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {APIContext} from "../api";
import AddListForm from "./forms/AddListForm";


export default function Tiles() {

    const api = useContext(APIContext);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    let controller;

    async function fetchData() {
        setLoading(true);
        try {
            let response = await api.GET('shopping-lists');
            controller = response.controller;
            setData(response.data); setLoading(false);
        } catch (e) {
            setError(true); setLoading(false);
        }
    }

    function addList(newList) {
        let _data = [...data];
        _data.unshift(newList);
        setData(_data);
    }

    function deleteList(id) {
        const _data = data.filter((l) => l.id !== id);
        setData(_data);
    }

    useEffect(() => {
        let _isMounted = true;

        _isMounted && fetchData();

        return (() => {
            _isMounted = false;
            controller && controller.abort();
        })
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
        <AddListForm callback={addList}/>
        <section className="section">
            <div className="container">
                <div className="tile is-ancestor flex-wrap">
                    {data.map(list => <Tile key={list.id} instance={list} id={list} deleteCallback={deleteList}/>)}
                </div>
            </div>
        </section>
    </div>
}
