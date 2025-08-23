import React, { useState } from 'react';
import classes from './CreateInvoiceFormDogovor.module.css';
import { rubles } from 'rubles';

function formatDate(dateStr) {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month}-${day}`;
}

function formatHumanDate(dateStr) {
    const months = {
        "января": "01",
        "февраля": "02",
        "марта": "03",
        "апреля": "04",
        "мая": "05",
        "июня": "06",
        "июля": "07",
        "августа": "08",
        "сентября": "09",
        "октября": "10",
        "ноября": "11",
        "декабря": "12",
    };

    const [day, monthWord, year] = dateStr.trim().split(" ");
    const month = months[monthWord.toLowerCase()];
    if (!month) return ""; // если месяц не нашли

    return `${year}-${month}-${day.padStart(2, "0")}`;
}

const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return 0;
    // принимает и "1 234,56" и число, и пустоту
    const s = String(v).replace(/\u00A0/g, "").replace(/\s/g, "").replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
};

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;


function CreateInvoiceFormDogovor({ onSubmit, currentContract, onClose }) {
    const [contractNumber, setContractNumber] = useState(currentContract?.contractNumber || '');
    const [creationDate, setCreationDate] = useState(currentContract?.numberDate ? formatDate(currentContract?.numberDate) : '');
    const [contractEndDate, setContractEndDate] = useState(currentContract?.contractEndDate ? formatHumanDate(currentContract?.contractEndDate) : '2025-12-25');

    // const [services, setServices] = useState(currentContract?.services?.length != 0 ? currentContract?.services : [{ serviceId: 1, name: "", quantity: 1, unit: "шт.", pricePerUnit: "", vat: "Без НДС", totalPrice: "" }]);
    const [services, setServices] = useState(
        currentContract?.services?.length
            ? currentContract.services.map((s, i) => ({
                serviceId: s.serviceId ?? i + 1,
                name: s.name ?? "",
                quantity: toNum(s.quantity),
                unit: s.unit ?? "шт.",
                pricePerUnit: toNum(s.pricePerUnit),
                vat: s.vat ?? "Без НДС",
                totalPrice: round2(toNum(s.totalPrice) || (toNum(s.quantity) * toNum(s.pricePerUnit))),
            }))
            : [{ serviceId: 1, name: "", quantity: 1, unit: "шт.", pricePerUnit: 0, vat: "Без НДС", totalPrice: 0 }]
    );

    const [act_stoimostNumber, setAct_stoimostNumber] = useState(currentContract?.act_stoimostNumber || '');
    const [act_writtenAmountAct, setAct_writtenAmountAct] = useState(currentContract?.writtenAmountAct || '');

    function getDate(dateInfo, type = 'numeric') {
        const date = new Date(dateInfo);
        const options = { day: 'numeric', month: type, year: 'numeric' };
        const dateString = date.toLocaleDateString('ru-RU', options).replace(' г.', '');
        return dateString;
    }

    // console.log('currentContract', currentContract);

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
        let writtenAmountDogovor = ''

        const match = act_writtenAmountAct.match(/^(.*?)\s(\d.*)$/);
        if (match) {
            const before = match[1].trim(); // "две тысячи четыреста тридцать пять рублей"
            const after = match[2].trim();  // "00 копеек"

            writtenAmountDogovor = `(${before}) ${after}`;
        }

        onSubmit({
            contractNumber: contractNumber,
            numberDate: getDate(creationDate),
            writtenDate: getDate(creationDate, 'long'),
            services: formattedServices,
            act_stoimostNumber: `${act_stoimostNumber_1},${act_stoimostNumber_2}`,
            act_writtenAmountAct,

            contractJustNumber: `${act_stoimostNumber_1}`,
            writtenAmountDogovor: writtenAmountDogovor,

            contractEndDate: getDate(contractEndDate, 'long')
        });
    };

    const addNewServiceRow = () => {
        const newService = {
            serviceId: services.length + 1,  // Incrementing the row number
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
            <h2>Создание нового договора</h2>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
                <div>
                    <label>Номер договора:</label>
                    <input
                        type="text"
                        value={contractNumber}
                        placeholder='Введите номер договора'
                        onChange={(e) => setContractNumber(e.target.value)}
                    />
                </div>
                <div>
                    <label>Дата:</label>
                    <input
                        type="date"
                        value={creationDate}
                        onChange={(e) => setCreationDate(e.target.value)}
                    />
                </div>
                {/* <div>
                    <label>Дата действия договора (до):</label>
                    <input
                        type="date"
                        value={contractEndDate}
                        onChange={(e) => setContractEndDate(e.target.value)}
                        readOnly
                    />
                </div> */}

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
                            <tr key={service.serviceId}>
                                <td>{service.serviceId}</td>
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

export default CreateInvoiceFormDogovor;
