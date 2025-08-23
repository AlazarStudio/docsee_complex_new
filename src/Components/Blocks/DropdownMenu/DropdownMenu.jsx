import React, { useEffect, useRef } from 'react';
import classes from './DropdownMenu.module.css';

function DropdownMenu({ options, onClose, onSelect }) {  // Добавлен onSelect
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleOptionClick = (option) => {
        onSelect(option);  // Передаем выбранный элемент родительскому компоненту
        onClose();         // Закрываем меню после выбора
    };

    return (
        <div ref={menuRef} className={classes.dropdownMenu}>
            {options.map((option, index) => (
                <div 
                    key={index} 
                    className={classes.dropdownMenu_item}
                    onClick={() => handleOptionClick(option)}  // Обработчик клика
                >
                    {option}
                </div>
            ))}
        </div>
    );
}

export default DropdownMenu;
