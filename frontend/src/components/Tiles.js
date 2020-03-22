import React, {useEffect, useState} from "react";
import List from "./List";
import ListForm from "./forms/ListForm";


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
        return <progress
            className={"progress is-small " + (error ? "is-danger":"is-dark")}
            max="100"
            data-testid={error ? "error-bar":"progress-bar"}
        />
    }
    return <div>
        <ListForm callback={fetchData}/>
        <section className="section">
            <div className="container">
                <div className="tile is-ancestor flex-wrap">
                    {data.map(list => <List key={list.id} instance={list} id={list} fetchLists={fetchData}/>)}
                </div>
            </div>
        </section>
    </div>
}
