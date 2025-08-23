import React from 'react';
import ReactModal from 'react-modal';
import classes from './Modal.module.css';

function Modal({ isOpen, onClose, children }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Создать документ"
            className={classes.modal}
            overlayClassName={classes.modalOverlay}
            ariaHideApp={false}
        >
            <button onClick={onClose} className={classes.modalCloseBtn}>&#10006;</button>
            {children}
        </ReactModal>
    );
}

export default Modal;
