import React, {useContext, useEffect, useReducer, useState} from "react";
import Tile from "./Tile";
import {faSpinner, faFrown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {APIContext} from "../api";
import ListForm from "./forms/ListForm";
import {dataReducer, DataContext, ACTIONS} from "../dataReducer";


export default function Tiles() {

    const api = useContext(APIContext);

    const [state, dispatch] = useReducer(dataReducer, {data: []})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    let controller;

    async function fetchData() {
        setLoading(true);
        try {
            let response = await api.GET('shopping-lists');
            controller = response.controller;
            dispatch({type: ACTIONS.setData, data: response.data})
            setLoading(false);
        } catch (e) {
            setError(true); setLoading(false);
        }
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
        <DataContext.Provider value={dispatch}>
            <ListForm/>
            <section className="section">
                <div className="container">
                    <div className="tile is-ancestor flex-wrap">
                        {state.data.map(list => <Tile key={list.id} list={list}/>)
                        }
                    </div>
                </div>
            </section>
        </DataContext.Provider>
    </div>
}
