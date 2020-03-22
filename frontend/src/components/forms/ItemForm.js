import React, {useState} from "react";
import {fetchDjango, itemsUrl} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../common/Modal";


export default function ItemForm(props) {

    const [modal, setModal] = useState(false);
    const [item, setItem] = useState(props.item);
    const [quantity, setQuantity] = useState(props.quantity);
    const [itemInvalid, setItemInvalid] = useState(false);
    const [quantityInvalid, setQuantityInvalid] = useState(false);

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

        let response = await fetchDjango(
            itemsUrl(props.id), {
                method: props.id ? 'PATCH':'POST',
                body: props.id ? {
                        "name": item,
                        "quantity": quantity,
                    } : {
                        "name": item,
                        "quantity": quantity,
                        "list": props.listId,
                        "is_checked": false
                    }
        });

        let newItem = await response.json();
        props.callback(newItem);
        setItem(''); setQuantity('');
        toggleModal();
    }

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
                <article className="message is-dark">
                    <div className="message-header">
                       <p>Item</p>
                    </div>
                    <div className="message-body">
                       <form onSubmit={handleSubmit}>
                           <div className="field">
                               <label className="label">Item</label>
                               <div className="control">
                                   <input
                                       className={itemInvalid ? "input is-danger":"input"}
                                       name="item" type="text"
                                       value={item || ''}
                                       onChange={handleChange}
                                       placeholder="e.g. Chicken"
                                   />
                               </div>
                           </div>
                           <div className="field">
                               <label className="label">Quantity</label>
                               <div className="control">
                                   <input
                                       className={quantityInvalid ? "input is-danger":"input"}
                                       name="quantity" type="text"
                                       value={quantity || ''}
                                       onChange={handleChange}
                                       placeholder="e.g. 81"
                                   />
                               </div>
                           </div>
                           <div className="control">
                               <button className="button is-dark">Save</button>
                           </div>
                       </form>
                   </div>
                </article>
            }
        />
    </div>;
}
