import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import {APIContext} from "../../api";


export default function ItemForm(props) {

    const api = useContext(APIContext);

    const [modal, setModal] = useState(false);
    const [item, setItem] = useState(props.item);
    const [quantity, setQuantity] = useState(props.quantity);
    const [itemInvalid, setItemInvalid] = useState(false);
    const [quantityInvalid, setQuantityInvalid] = useState(false);

    let controller;

    function toggleModal() {
        setModal(m => !m);
    }

    function handleChange(e) {
        const target = e.target;
        if (target.name === 'item') {
            setItem(target.value);
            return
        }
        setQuantity(target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setItemInvalid(false); setQuantityInvalid(false);

        if (!validateForm()) {
            return null;
        }

        const endpoint = 'items';
        const body = props.id ? {'name': item, 'quantity': quantity}:
            {'name': item, 'quantity': quantity, 'list': props.listId, 'is_checked': false};

        let response = props.id ? await api.PATCH(endpoint, props.id, body) : await api.POST(endpoint, body);

        let newItem = await response.data;
        controller = response.controller;

        props.callback(newItem);
        setItem(''); setQuantity('');
        toggleModal();
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    function validateForm() {
        const _itemInvalid = !item;
        const _quantityInvalid = !quantity;
        setItemInvalid(_itemInvalid); setQuantityInvalid(_quantityInvalid);
        return !(_itemInvalid || _quantityInvalid);
    }

    return <div>
        {props.id ?
            (
                <a className={"button is-small is-black is-outlined " + (modal ? "is-loading":"")} onClick={toggleModal} data-testid="edit-item-btn">
                    <FontAwesomeIcon className="icon has-text-warning" icon={faPencilAlt}/>
                </a>
            ):(
                <a className={"button is-small is-black is-outlined " + (modal ? "is-loading":"")} onClick={toggleModal} data-testid="add-item-btn">
                    <FontAwesomeIcon className="has-text-info" icon={faPlus}/>
                </a>
            )
        }
        <Modal
            active={modal}
            toggle={toggleModal}
            modalContent={
                <article className="message">
                    <div className="message-header has-background-black">
                       <p>Item</p>
                    </div>
                    <div className="message-body has-background-dark">
                       <form onSubmit={handleSubmit}>
                           <div className="field">
                               <label className="label has-text-white">Item</label>
                               <div className="control">
                                   <input
                                       className={"input has-background-black has-text-white " + (itemInvalid ? "is-danger":"")}
                                       name="item" type="text"
                                       value={item || ''}
                                       onChange={handleChange}
                                       placeholder="e.g. Chicken"
                                   />
                               </div>
                           </div>
                           <div className="field">
                               <label className="label has-text-white">Quantity</label>
                               <div className="control">
                                   <input
                                       className={"input has-background-black has-text-white " + (quantityInvalid ? "is-danger":"")}
                                       name="quantity" type="text"
                                       value={quantity || ''}
                                       onChange={handleChange}
                                       placeholder="e.g. 81"
                                   />
                               </div>
                           </div>
                           <div className="control">
                               <button className="button is-black">Save</button>
                           </div>
                       </form>
                   </div>
                </article>
            }
        />
    </div>;
}
