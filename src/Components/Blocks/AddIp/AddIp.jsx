import React, { useState } from "react";
import classes from './AddIp.module.css';
import axios from 'axios';

function AddIp({ onSubmit }) {
    const [ipData, setIpData] = useState({
        lastDocNumber: '',
        fullName: '',
        shortName: '',
        basis: '',
        print: 'да',
        post: '',
        fio: '',
        initials: '',
        address: '',
        ogrnip: '',
        inn: '',
        rs: '',
        bank: '',
        bik: '',
        ks: '',
        email: '',
        phone: '',
        orgName: '',
    });

    const handleIpDataChange = (event) => {
        const { name, value } = event.target;
        setIpData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedIpData = {
            ...ipData,
            orgName: ipData.shortName + ' ' + ipData.bank,
        };

        onSubmit(updatedIpData);

        try {
            await axios.post('https://backend.demoalazar.ru/add-ip', { formData: updatedIpData });
            console.log("Form Data: ", updatedIpData);
            alert(`ИП успешно создано`);
        } catch (error) {
            console.error("Ошибка запроса", error);
            alert('Ошибка при отправке данных');
        }

        setIpData({
            fullName: '',
            shortName: '',
            basis: '',
            print: 'да',
            post: '',
            fio: '',
            address: '',
            ogrnip: '',
            inn: '',
            rs: '',
            bank: '',
            bik: '',
            ks: '',
            email: '',
            phone: '',
            orgName: '',
        });
    };

    console.log(ipData)

    return (
        <>
            <h2>Добавление нового ИП</h2>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
                <div>
                    <label>Полное наименование:</label>
                    <input
                        required
                        type="text"
                        name="fullName"
                        value={ipData.fullName}
                        onChange={handleIpDataChange}
                        placeholder="Индивидуальный предприниматель Уртенов Азамат Заурович"
                    />
                </div>
                <div>
                    <label>Сокращенное название:</label>
                    <input
                        required
                        type="text"
                        name="shortName"
                        value={ipData.shortName}
                        onChange={handleIpDataChange}
                        placeholder="ИП Уртенов А.З."
                    />
                </div>
                <div>
                    <label>Действует на основании</label>
                    <input
                        required
                        className={classes.input}
                        type="text"
                        name="basis"
                        value={ipData.basis}
                        onChange={handleIpDataChange}
                        placeholder='ОРГНИП'
                    />
                </div>
                <div>
                    <label>Печать</label>
                    <select name="print" required className={classes.input} value={ipData.print} onChange={handleIpDataChange}>
                        <option value="да">Да</option>
                        <option value="нет">Нет</option>
                    </select>
                </div>
                <div>
                    <label>Должность</label>
                    <input
                        required
                        className={classes.input}
                        type="text"
                        name="post"
                        value={ipData.post}
                        onChange={handleIpDataChange}
                        placeholder='Индивидуальный предприниматель'
                    />
                </div>
                <div>
                    <label>ФИО:</label>
                    <input
                        required
                        type="text"
                        name="fio"
                        value={ipData.fio}
                        onChange={handleIpDataChange}
                        placeholder="Уртенов Азамат Заурович"
                    />
                </div>
                <div>
                    <label>И.О. Фамилия</label>
                    <input
                        required
                        className={classes.input}
                        type="text"
                        name="initials"
                        value={ipData.initials}
                        onChange={handleIpDataChange}
                        placeholder='А.З. Уртенов'
                    />
                </div>
                <div>
                    <label>Адрес:</label>
                    <input
                        required
                        type="text"
                        name="address"
                        value={ipData.address}
                        onChange={handleIpDataChange}
                        placeholder="369300, Карачаево-Черкесская Республика, г. Усть-Джегута, ул. Пионерская, д. 15"
                    />
                </div>
                <div>
                    <label>ОГРНИП:</label>
                    <input
                        required
                        type="text"
                        name="ogrn"
                        value={ipData.ogrnip}
                        onChange={handleIpDataChange}
                        placeholder="323909000029290"
                    />
                </div>
                <div>
                    <label>ИНН:</label>
                    <input
                        required
                        type="text"
                        name="inn"
                        value={ipData.inn}
                        onChange={handleIpDataChange}
                        placeholder="091690249248"
                    />
                </div>
                <div>
                    <label>Р/сч:</label>
                    <input
                        required
                        type="text"
                        name="rs"
                        value={ipData.rs}
                        onChange={handleIpDataChange}
                        placeholder="40802810863010007883"
                    />
                </div>
                <div>
                    <label>БАНК:</label>
                    <input
                        required
                        type="text"
                        name="bank"
                        value={ipData.bank}
                        onChange={handleIpDataChange}
                        placeholder="в Ставропольском Отделении №5230 ПАО Сбербанка"
                    />
                </div>
                <div>
                    <label>БИК:</label>
                    <input
                        required
                        type="text"
                        name="bik"
                        value={ipData.bik}
                        onChange={handleIpDataChange}
                        placeholder="040702615"
                    />
                </div>
                <div>
                    <label>К/сч:</label>
                    <input
                        required
                        type="text"
                        name="ks"
                        value={ipData.ks}
                        onChange={handleIpDataChange}
                        placeholder="30101810907020000615"
                    />
                </div>
                <div>
                    <label>E-mail:</label>
                    <input
                        required
                        type="text"
                        name="email"
                        value={ipData.email}
                        onChange={handleIpDataChange}
                        placeholder="me@urtenov.ru"
                    />
                </div>
                <div>
                    <label>Телефон:</label>
                    <input
                        required
                        type="text"
                        name="phone"
                        value={ipData.phone}
                        onChange={handleIpDataChange}
                        placeholder="+7 (928) 387-44-97"
                    />
                </div>
                <button type="submit">Добавить ИП</button>
            </form>
        </>
    );
}

export default AddIp;
