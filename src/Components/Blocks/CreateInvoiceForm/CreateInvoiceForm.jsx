import React, { useState } from 'react';
import classes from './CreateInvoiceForm.module.css';
import { rubles } from 'rubles';

function CreateInvoiceForm({ onSubmit, onClose }) {
    const [creationDate, setCreationDate] = useState('');

    const [services, setServices] = useState([{ id: 1, name: "", quantity: 1, unit: "шт.", pricePerUnit: "", vat: "Без НДС", totalPrice: "" }]);
    const [act_stoimostNumber, setAct_stoimostNumber] = useState('');
    const [act_writtenAmountAct, setAct_writtenAmountAct] = useState('');

    function getDate(dateInfo, type = 'numeric') {
        const date = new Date(dateInfo);
        const options = { day: 'numeric', month: type, year: 'numeric' };
        const dateString = date.toLocaleDateString('ru-RU', options).replace(' г.', '');
        return dateString;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formattedServices = services.map((s) => ({
            ...s,
            pricePerUnit: Number(s.pricePerUnit).toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            totalPrice: Number(s.totalPrice).toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        }));

        let act_stoimostNumber_1 = parseFloat(act_stoimostNumber.split(',')[0]).toLocaleString('ru-RU');
        let act_stoimostNumber_2 = act_stoimostNumber.split(',')[1];

        onSubmit({
            date: getDate(creationDate),
            services: formattedServices,
            act_stoimostNumber: `${act_stoimostNumber_1},${act_stoimostNumber_2}`,
            act_writtenAmountAct
        });
    };

    const addNewServiceRow = () => {
        const newService = {
            id: services.length + 1,  // Incrementing the row number
            name: "",
            quantity: 1,
            unit: "шт.",
            pricePerUnit: "",
            vat: "Без НДС",
            totalPrice: ""
        };
        setServices([...services, newService]);
    };

    const handleServiceChange = (index, field, value) => {
        const newServices = [...services];
        newServices[index][field] = value;

        if (field === 'quantity' || field === 'pricePerUnit') {
            const quantity = parseFloat(newServices[index].quantity) || 0;
            const pricePerUnit = parseFloat(newServices[index].pricePerUnit).toFixed(2) || 0;
            newServices[index].totalPrice = (quantity * pricePerUnit).toFixed(2);
        }

        setServices(newServices);

        const totalAmount = newServices.reduce((sum, service) => {
            return sum + parseFloat(service.totalPrice || 0);
        }, 0).toFixed(2);

        setAct_stoimostNumber(totalAmount.replace('.', ','));

        let sumForDogovor = rubles(totalAmount.replace(' ', ''));

        if (typeof sumForDogovor === 'string') {
            const regex = /(\d{2} копеек?)$/;
            const match = sumForDogovor.match(regex);

            if (match) {
                const kopiekiPart = match[0];
                const rublesPart = sumForDogovor.replace(regex, '').trim();

                const rubStartIndex = rublesPart.indexOf('рубл');
                if (rubStartIndex !== -1) {
                    const beforeRub = rublesPart.slice(0, rubStartIndex).trim();
                    const afterRub = rublesPart.slice(rubStartIndex).trim();
                    const finalSumForDogovor = `${beforeRub} ${afterRub} ${kopiekiPart}`;

                    setAct_writtenAmountAct(finalSumForDogovor);
                } else {
                    setAct_writtenAmountAct(sumForDogovor);
                }
            } else {
                setAct_writtenAmountAct(sumForDogovor);
            }
        } else {
            console.error("Error: sumForDogovor is not a string", sumForDogovor);
        }
    };
    return (
        <>
            <h2>Создание нового счета для документа</h2>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
                <div>
                    <label>Дата:</label>
                    <input
                        type="date"
                        value={creationDate}
                        onChange={(e) => setCreationDate(e.target.value)}
                    />
                </div>

                <table className={classes.serviceTable}>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Наименование товара/услуги</th>
                            <th>Кол-во</th>
                            <th>Ед. изм.</th>
                            <th>Цена за ед., ₽</th>
                            <th>НДС</th>
                            <th>Всего, ₽</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td><input type="text" value={service.name} onChange={(e) => handleServiceChange(index, 'name', e.target.value)} /></td>
                                <td><input type="number" value={service.quantity} onChange={(e) => handleServiceChange(index, 'quantity', e.target.value)} /></td>
                                <td><input type="text" value={service.unit} onChange={(e) => handleServiceChange(index, 'unit', e.target.value)} /></td>
                                <td><input type="number" value={service.pricePerUnit} onChange={(e) => handleServiceChange(index, 'pricePerUnit', e.target.value)} /></td>
                                <td><input type="text" value={service.vat} onChange={(e) => handleServiceChange(index, 'vat', e.target.value)} /></td>
                                <td><input type="number" value={service.totalPrice} readOnly /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={classes.addTableLine}>
                    <button type="button" onClick={addNewServiceRow}>+ Новая строка</button>
                </div>
                <div>
                    <label>Стоимость</label>
                    <input required={false} type="text" value={act_stoimostNumber} readOnly />
                </div>
                <div>
                    <label>Стоимость прописью:</label>
                    <input required={false} type="text" value={act_writtenAmountAct} readOnly />
                </div>
                <button type="submit">Создать</button>
            </form >
        </>
    );
}

export default CreateInvoiceForm;
