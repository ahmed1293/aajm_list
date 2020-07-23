import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import List from "./List";
import Modal from "./Modal";
import {APIContext} from "../api";
import {ACTIONS, DataContext} from "../dataReducer";

export default function Tile(props) {

	const api = useContext(APIContext);
	const dispatch = useContext(DataContext);

	const [modal, setModal] = useState(false);

	function toggleDeleteModal() {
		setModal(m => !m);
	}

	async function _delete(e) {
		e.preventDefault();
		await api.DELETE('shopping-lists', props.list.id);
		setModal(false);
		dispatch({type: ACTIONS.deleteList, listId: props.list.id});
	}

	return <div className="tile is-parent is-vertical is-4" data-testid='tile'>
		<article className="tile is-child notification is-dark" style={{padding: '10px'}}>
			<nav className="level is-mobile">
				<div className="level-left level-is-shrinkable">
					<p className="subtitle">{props.list.created_at}</p>
				</div>
				<div className="buttons level-right">
					<a className="button is-black is-outlined" onClick={toggleDeleteModal} data-testid='delete-list'>
						<FontAwesomeIcon className="has-text-danger" icon={faTimes}/>
					</a>
				</div>
			</nav>
			<List items={props.list.items} listId={props.list.id} canAddItem={props.isLatest}/>
		</article>
		{modal && <Modal toggle={toggleDeleteModal} modalContent={
			<article className="message">
				<div className="message-header has-background-black has-text-danger">
					<p>Delete List</p>
				</div>
				<div className="message-body has-background-dark has-text-white">
					<form onSubmit={_delete}>
						Are you sure?
						<div className="control has-text-centered">
							<button className="button is-danger">Delete</button>
						</div>
					</form>
				</div>
			</article>
		}/>}
	</div>;
}
