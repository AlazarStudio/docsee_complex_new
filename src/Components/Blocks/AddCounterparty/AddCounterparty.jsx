import React, { useState } from "react";
import classes from './AddCounterparty.module.css';
import GosCounterpartyForm from '../GosCounterpartyForm/GosCounterpartyForm';
import MSPCounterpartyForm from '../MSPCounterpartyForm/MSPCounterpartyForm';
import IPCounterpartyForm from '../IPCounterpartyForm/IPCounterpartyForm';
import SelfEmployedCounterpartyForm from '../SelfEmployedCounterpartyForm/SelfEmployedCounterpartyForm';
import axios from 'axios';

function AddCounterparty({ onSubmit }) {
    const [counterpartyType, setCounterpartyType] = useState('');

    // Состояние для Гос контрагента
    const [gosCounterpartyData, setGosCounterpartyData] = useState({
        orgName: '',
        fullName: '',
        shortName: '',
        orgNameGen: '',
        basis: 'Устава',
        print: 'да',
        post: '',
        directorName: '',
        directorFullNameGen: '',
        initials: '',
        address: '',
        INN: '',
        KPP: '',
        OKTMO: '',
        OKATO: '',
        OKPO: '',
        OKOPF: '',
        OGRN: '',
        LSCH: '',
        RSCH: '',
        KSCH: '',
        NKAZCH: '',
        EKAZSCH: '',
        bankName: '',
        BIK: '',
        OKOGU: '',
        email: '',
        phone: '',
        type: counterpartyType,
    });

    // Состояние для МСП контрагента
    const [mspCounterpartyData, setMspCounterpartyData] = useState({
        orgName: '',
        fullName: '',
        shortName: '',
        orgNameGen: '',
        basis: 'Устава',
        print: 'да',
        post: '',
        directorName: '',
        directorFullNameGen: '',
        initials: '',
        address: '',
        INN: '',
        KPP: '',
        OGRN: '',
        RSCH: '',
        KSCH: '',
        bankName: '',
        BIK: '',
        email: '',
        phone: '',
        type: counterpartyType,
    });

    // Состояние для ИП контрагента
    const [ipCounterpartyData, setIpCounterpartyData] = useState({
        orgName: '',
        fullName: '',
        shortName: '',
        orgNameGen: '',
        basis: 'ОРГНИП',
        print: 'да',
        post: '',
        directorName: '',  // Для ИП это будет ФИО
        directorFullNameGen: '',  // ФИО в род. падеже
        initials: '',
        address: '',
        INN: '',
        OGRNIP: '',  // ОГРНИП для ИП
        RSCH: '',
        KSCH: '',
        bankName: '',
        BIK: '',
        email: '',
        phone: '',
        type: counterpartyType,
    });

    // Состояние для Самозанятого контрагента
    const [selfEmployedCounterpartyData, setSelfEmployedCounterpartyData] = useState({
        orgName: '',
        fullName: '',
        orgNameGen: '',
        basis: 'зарегистрирован(а) в ФНС в качестве налогоплательщика налога на профессиональный доход в соответствии с ФЗ от 27.11.2018 №422-ФЗ)',
        print: 'нет',
        post: '',
        directorFullNameGen: '',
        initials: '',
        address: '',
        INN: '',
        passportSeries: '',
        passportNumber: '',
        RSCH: '',
        KSCH: '',
        bankName: '',
        BIK: '',
        email: '',
        phone: '',
        type: counterpartyType,
    });

    const handleChange = (e, setData) => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        setGosCounterpartyData(prevState => ({ ...prevState, type: counterpartyType }))

        setMspCounterpartyData(prevState => ({ ...prevState, type: counterpartyType }))

        setIpCounterpartyData(prevState => ({ ...prevState, type: counterpartyType }))

        setSelfEmployedCounterpartyData(prevState => ({ ...prevState, type: counterpartyType }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedData;
        if (counterpartyType === 'Гос') {
            updatedData = {
                ...gosCounterpartyData,
                orgName: gosCounterpartyData.shortName + ' ' + gosCounterpartyData.bankName
            };
            setGosCounterpartyData(updatedData);
        } else if (counterpartyType === 'МСП') {
            updatedData = {
                ...mspCounterpartyData,
                orgName: mspCounterpartyData.shortName + ' ' + mspCounterpartyData.bankName
            };
            setMspCounterpartyData(updatedData);
        } else if (counterpartyType === 'ИП') {
            updatedData = {
                ...ipCounterpartyData,
                orgName: ipCounterpartyData.shortName + ' ' + ipCounterpartyData.bankName
            };
            setIpCounterpartyData(updatedData);
        } else if (counterpartyType === 'Самозанятый') {
            updatedData = {
                ...selfEmployedCounterpartyData,
                orgName: selfEmployedCounterpartyData.fullName + ' ' + selfEmployedCounterpartyData.bankName
            };
            setSelfEmployedCounterpartyData(updatedData);
        }
        onSubmit(updatedData);

        const CREATE_REQUEST = `
            mutation CreateRequest($input: RequestInput!) {
                createRequest(input: $input) {
                    id
                }
            }
        `;

        try {
            axios.post("https://complexbackend.demoalazar.ru/", {
                query: CREATE_REQUEST,
                variables: {
                    input: updatedData,
                },
                
            })
            // await axios.post('https://backend.demoalazar.ru/add-contragent', { formData: updatedData });
            console.log("Form Data: ", updatedData);
            alert(`Контрагент успешно создан`);
        } catch (error) {
            console.error("Ошибка запроса", error);
            alert('Ошибка при отправке данных');
        }
    };

    return (
        <>
            <h2>Добавление нового контрагента</h2>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
                <div>
                    <label>Тип контрагента</label>
                    <select
                        required
                        className={classes.input}
                        value={counterpartyType}
                        onChange={(e) => setCounterpartyType(e.target.value)}
                    >
                        <option value="" disabled>Выберите тип контрагента</option>
                        {/* <option value="Гос">Гос</option> */}
                        <option value="МСП">МСП</option> 
                        <option value="ИП">ИП</option>
                        {/* <option value="Самозанятый">Самозанятый</option> */}
                    </select>
                </div>

                {counterpartyType === 'Гос' && (
                    <GosCounterpartyForm
                        formData={gosCounterpartyData}
                        handleChange={(e) => handleChange(e, setGosCounterpartyData)}
                    />
                )}

                {counterpartyType === 'МСП' && (
                    <MSPCounterpartyForm
                        formData={mspCounterpartyData}
                        handleChange={(e) => handleChange(e, setMspCounterpartyData)}
                    />
                )}

                {counterpartyType === 'ИП' && (
                    <IPCounterpartyForm
                        formData={ipCounterpartyData}
                        handleChange={(e) => handleChange(e, setIpCounterpartyData)}
                    />
                )}

                {counterpartyType === 'Самозанятый' && (
                    <SelfEmployedCounterpartyForm
                        formData={selfEmployedCounterpartyData}
                        handleChange={(e) => handleChange(e, setSelfEmployedCounterpartyData)}
                    />
                )}

                <button className={classes.button} type="submit">Сохранить</button>
            </form>
        </>
    );
}

export default AddCounterparty;
