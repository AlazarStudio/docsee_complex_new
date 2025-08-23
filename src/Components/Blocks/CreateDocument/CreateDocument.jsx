import React, { useState } from "react";
import { rubles } from 'rubles';
import classes from './CreateDocument.module.css';
import axios from 'axios';
import DropDownList from '../../Standart/DropDownList/DropDownList';

function CreateDocument({ closeModal, ipList, counterpartyList, openIpModal, openCounterpartyModal, fetchDocuments }) {
    const [contractType, setContractType] = useState('2');
    const [numberDate, setNumberDate] = useState('');
    const [writtenDate, setWrittenDate] = useState('');
    const [amount, setAmount] = useState('');
    const [writtenAmountAct, setWrittenAmountAct] = useState('');
    const [writtenAmountDogovor, setWrittenAmountDogovor] = useState('');
    const [template, setTemplate] = useState('');
    const [templateLabel, setTemplateLabel] = useState('');
    const [ip, setIp] = useState('');
    const [contragent, setContragent] = useState('');
    const [receiver, setReceiver] = useState('');
    const [contractNumber, setContractNumber] = useState('');
    const [contractJustNumber, setContractJustNumber] = useState('');
    const [contractSubjectNom, setContractSubjectNom] = useState('');
    const [contractSubjectGen, setContractSubjectGen] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');
    const [stoimostNumber, setStoimostNumber] = useState('');
    const [services, setServices] = useState([{ id: 1, name: "", quantity: 1, unit: "шт.", pricePerUnit: "", vat: "Без НДС", totalPrice: "" }]);

    const handleContractTypeChange = (event) => {
        setContractType(event);
    };

    function getDate(dateInfo, type = 'numeric') {
        const date = new Date(dateInfo);
        const options = { day: 'numeric', month: type, year: 'numeric' };
        const dateString = date.toLocaleDateString('ru-RU', options).replace(' г.', '');
        return dateString;
    }

    const handleDateChange = (event) => {
        setNumberDate(getDate(event.target.value));
        setWrittenDate(getDate(event.target.value, 'long'));
    };

    const handleContractEndDateChange = (event) => {
        setContractEndDate(getDate(event.target.value, 'long'));
    };

    const handleIpChange = (event) => {
        const selectedIpName = event;
        setIp(selectedIpName);

        const selectedIp = ipList.find(ipItem => ipItem.orgName === selectedIpName);

        if (selectedIp) {
            const lastDocNumber = selectedIp.lastDocNumber || 0;
            let newContractNumber;
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear().toString().slice(-2);
            // const currentYear = '24';

            if (selectedIp.fullName.includes('Уртенов')) {
                newContractNumber = `${+lastDocNumber + 1}-${currentYear}`;
            }

            if (selectedIp.fullName.includes('Джатдоев')) {
                newContractNumber = `${currentMonth < 10 ? '0' + currentMonth : currentMonth}-${+lastDocNumber + 1}`;
            }

            setContractNumber(newContractNumber);
        }
    };

    const handleSumChange = (e) => {
        setAmount(e.target.value)
        let sumForDogovor = rubles(e.target.value.replace(' ', ''));

        setContractJustNumber(String(Number(e.target.value.replace(',', '.')).toLocaleString('ru-RU')).replace('.', ',').split(',')[0])
        setStoimostNumber(String(Number(e.target.value.replace(',', '.')).toLocaleString('ru-RU')).replace('.', ','));
        setWrittenAmountAct(sumForDogovor);
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
                    const finalSumForDogovor = `(${beforeRub}) ${afterRub} ${kopiekiPart}`;

                    setWrittenAmountDogovor(finalSumForDogovor);
                } else {
                    setWrittenAmountDogovor(sumForDogovor);
                }
            } else {
                setWrittenAmountDogovor(sumForDogovor);
            }
        } else {
            console.error("Error: sumForDogovor is not a string", sumForDogovor);
        }
    }

    const handleServiceChange = (index, field, value) => {
        const newServices = [...services];
        newServices[index][field] = value;

        if (field === 'quantity' || field === 'pricePerUnit') {
            const quantity = parseFloat(newServices[index].quantity) || 0;
            const pricePerUnit = parseFloat(newServices[index].pricePerUnit) || 0;
            newServices[index].totalPrice = (quantity * pricePerUnit).toFixed(2);
        }

        setServices(newServices);

        // Calculate the total amount
        const totalAmount = newServices.reduce((sum, service) => {
            return sum + parseFloat(service.totalPrice || 0);
        }, 0).toFixed(2);

        setAmount(totalAmount.toLocaleString('ru-RU'));

        // Generate the sumForDogovor string safely
        let sumForDogovor = rubles(totalAmount.replace(' ', ''));

        // Set the written amount for the Act
        setWrittenAmountAct(sumForDogovor);

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
                    const finalSumForDogovor = `(${beforeRub}) ${afterRub} ${kopiekiPart}`;

                    setWrittenAmountDogovor(finalSumForDogovor);
                } else {
                    setWrittenAmountDogovor(sumForDogovor);
                }
            } else {
                setWrittenAmountDogovor(sumForDogovor);
            }
        } else {
            console.error("Error: sumForDogovor is not a string", sumForDogovor);
        }

        setContractJustNumber(String(Number(totalAmount.replace(',', '.')).toLocaleString('ru-RU')).replace('.', ',').split(',')[0])
        setStoimostNumber(String(Number(totalAmount.replace(',', '.')).toLocaleString('ru-RU')).replace('.', ','));
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const selectedIp = ipList.find(ipItem => ipItem.orgName === ip);
        const selectedContragent = counterpartyList.find(counterparty => counterparty.orgName === contragent);
        const selectedReceiver = counterpartyList.find(counterparty => counterparty.orgName === receiver);

        const formData = {
            contractType,
            template,
            ip: selectedIp ? selectedIp : null,
            contragent: selectedContragent ? selectedContragent : null,
            receiver: contractType === '3' ? selectedReceiver : null,
            contractNumber,
            contractJustNumber,
            numberDate,
            writtenDate,
            contractSubjectNom,
            contractSubjectGen,
            writtenAmountAct,
            writtenAmountDogovor,
            stoimostNumber,
            contractEndDate,
            // services,
        };

        try {
            await axios.post('https://backend.demoalazar.ru/generate-contract', { formData });
            console.log("Form Data: ", formData);
            closeModal();

            fetchDocuments()

            alert(`Договор №${formData.contractNumber} ${formData.receiver ?
                (formData.receiver.type == 'Самозанятый' ? formData.receiver.fullName : formData.receiver.shortName) :
                formData.contragent ?
                    (formData.contragent.type == 'Самозанятый' ? formData.contragent.fullName : formData.contragent.shortName)
                    : ''
                } успешно создан`
            );
            location.reload();
        } catch (error) {
            console.error("Ошибка запроса", error);
            alert('Ошибка при отправке данных123w123');
        }
    };

    let list_2_side = [
        {
            label: "Договор дизайн услуг",
            template: "Template_2_side_document_design",
        },
        {
            label: "Договор логотип и фирстиль",
            template: "Template_2_side_document_firStyleLogo",
        },
        {
            label: "Договор ПО Сайт",
            template: "Template_2_side_document_sitePO",
        },
        {
            label: "Договор реклама",
            template: "Template_2_side_document_marketing",
        },
        {
            label: "Договор по предоставлению серверных мощностей",
            template: "Template_2_side_dogovor_arenda_serverov",
        }
    ]

    let list_3_side = [
        {
            label: "Договор Комплексные Сайт",
            template: "Template_3_side_document",
        },
        {
            label: "Договор Комплексные Дизайн/Инфографика",
            template: "Template_3_side_document_design",
        },
        {
            label: "Договор Комплексные Видео",
            template: "Template_3_side_document_video",
        },
        {
            label: "Договор Комплексные Рекламка",
            template: "Template_3_side_document_marketing",
        },
        {
            label: "Договор Комплексные Фирстиль",
            template: "Template_3_side_document_firStyle",
        },
        {
            label: "Договор Комплексные Фото-контент",
            template: "Template_3_side_document_photoContent",
        }
    ]

    return (
        <>
            <h2>Создание нового документа</h2>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
                <div>
                    <label>Тип договора:</label>
                    <DropDownList
                        width="65%"
                        placeholder="Выберите тип договора"
                        searchable={false}
                        options={["Двухсторонний", "Трехсторонний"]}
                        onSelect={(value) => {
                            value == "Двухсторонний" && handleContractTypeChange("2")
                            value == "Трехсторонний" && handleContractTypeChange("3")
                            setTemplate('')
                            setTemplateLabel('')
                        }}
                    />
                    {/* <select required={false} value={contractType} onChange={handleContractTypeChange}>
                        <option value="" disabled>Выберите тип договора</option>
                        <option value="2">Двухсторонний</option>
                        <option value="3">Трехсторонний</option>
                    </select> */}
                </div>
                {contractType === '2' ?
                    <div>
                        <label>Шаблон договора:</label>
                        <DropDownList
                            width="65%"
                            placeholder="Выберите шаблон"
                            searchable={false}
                            initialValue={templateLabel}
                            options={list_2_side.map((listItem) => listItem.label)}
                            onSelect={(value) => {
                                const selected = list_2_side.find(listItem => listItem.label === value);
                                setTemplate(selected.template)
                                setTemplateLabel(selected.label)
                            }}
                        />
                        {/* <select required={false} value={template} onChange={(e) => setTemplate(e.target.value)}>
                            <option value="" disabled>Выберите шаблон</option>
                            {list_2_side.map((listItem, index) => (
                                <option key={index} value={listItem.template}>{listItem.label}</option>
                            ))}
                        </select> */}
                    </div>
                    :
                    contractType === '3' ?
                        <div>
                            <label>Шаблон договора:</label>
                            <DropDownList
                                width="65%"
                                placeholder="Выберите шаблон"
                                searchable={false}
                                initialValue={templateLabel}
                                options={list_3_side.map((listItem) => listItem.label)}
                                onSelect={(value) => {
                                    const selected = list_3_side.find(listItem => listItem.label === value);
                                    setTemplate(selected.template)
                                    setTemplateLabel(selected.label)
                                }}
                            />
                            {/* <select required={false} value={template} onChange={(e) => setTemplate(e.target.value)}>
                                <option value="" disabled>Выберите шаблон</option>
                                {list_3_side.map((listItem, index) => (
                                    <option key={index} value={listItem.template}>{listItem.label}</option>
                                ))}
                            </select> */}
                        </div>
                        : ''
                }
                <div>
                    <label>Выбор ИП:</label>

                    <div className={classes.modalSelectButton}>
                        <DropDownList
                            width="100%"
                            placeholder="Выберите ИП"
                            searchable={true}
                            options={ipList.map((ipItem) => ipItem.orgName)}
                            onSelect={(value) => {
                                handleIpChange(value)
                            }}
                        />
                        {/* <select required={false} value={ip} onChange={handleIpChange}>
                            <option value="" disabled>Выберите ИП</option>
                            {ipList.map((ipItem, index) => (
                                <option key={index} value={ipItem.orgName}>{ipItem.orgName}</option>
                            ))}
                        </select> */}
                        <button type="button" className={classes.addButton} onClick={openIpModal}>+</button>
                    </div>
                </div>
                <div>
                    <label>Номер договора:</label>
                    <input required={false} type="text" value={contractNumber} placeholder={"1-24"} readOnly />
                </div>
                <div>
                    <label>Выбор контрагента:</label>
                    <div className={classes.modalSelectButton}>
                        <DropDownList
                            width="100%"
                            placeholder="Выберите контрагента"
                            searchable={true}
                            options={counterpartyList.map((ipItem) => ipItem.orgName)}
                            onSelect={(value) => {
                                setContragent(value)
                            }}
                        />

                        {/* <select required={false} value={contragent} onChange={(e) => setContragent(e.target.value)}>
                            <option value="" disabled>Выберите контрагента</option>
                            {counterpartyList.map((ipItem, index) => (
                                <option key={index} value={ipItem.orgName}>{ipItem.orgName}</option>
                            ))}
                        </select> */}
                        <button type="button" className={classes.addButton} onClick={openCounterpartyModal}>+</button>
                    </div>
                </div>
                {contractType === '3' && (
                    <div>
                        <label>Выбор получателей услуг:</label>
                        <div className={classes.modalSelectButton}>
                            <DropDownList
                                width="100%"
                                placeholder="Выберите получателя услуг"
                                searchable={true}
                                options={counterpartyList.map((ipItem) => ipItem.orgName)}
                                onSelect={(value) => {
                                    setReceiver(value)
                                }}
                            />

                            {/* <select required={false} value={receiver} onChange={(e) => setReceiver(e.target.value)}>
                                <option value="" disabled>Выберите получателя услуг</option>
                                {counterpartyList.map((ipItem, index) => (
                                    <option key={index} value={ipItem.orgName}>{ipItem.orgName}</option>
                                ))}
                            </select> */}
                            <button type="button" className={classes.addButton} onClick={openCounterpartyModal}>+</button>
                        </div>
                    </div>
                )}
                <div>
                    <label>Дата договора цифры:</label>
                    <input required={false} type="date" onChange={handleDateChange} />
                </div>
                <div className={classes.hiddenModalBlock}>
                    <label>Дата договора прописью:</label>
                    <input required={false} type="text" value={writtenDate} readOnly />
                </div>
                <div>
                    <label>Предмет договора (именительном падеже):</label>
                    <input required={false} type="text" value={contractSubjectNom} placeholder={'Разработка логотипа и фирменного стиля'} onChange={(e) => setContractSubjectNom(e.target.value)} />
                </div>
                <div>
                    <label>Предмет договора (наименование работ в родительном падеже):</label>
                    <input required={false} type="text" value={contractSubjectGen} placeholder={'Разработке логотипа и фирменного стиля'} onChange={(e) => setContractSubjectGen(e.target.value)} />
                </div>
                <div>
                    <label>Дата действия договора (до):</label>
                    <input required={false} type="date" onChange={handleContractEndDateChange} />
                </div>
                {/* <table className={classes.serviceTable}>
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
                    <input required={false} type="text" value={amount} readOnly />
                </div>
                <div className={classes.hiddenModalBlock}>
                    <label>Стоимость прописью:</label>
                    <input required={false} type="text" value={writtenAmountAct} readOnly />
                </div> 
                */}
                <div>
                    <label>Стоимость</label>
                    <input required={false} type="text" value={amount} onChange={(e) => handleSumChange(e)} />
                </div>
                <div className={classes.hiddenModalBlock}>
                    <label>Стоимость прописью:</label>
                    <input required={false} type="text" value={writtenAmountAct} readOnly />
                </div>

                <button type="submit">Создать</button>
            </form >
        </>
    );
}

export default CreateDocument;
