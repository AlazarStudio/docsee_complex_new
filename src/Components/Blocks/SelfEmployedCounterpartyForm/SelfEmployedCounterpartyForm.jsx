import React from "react";
import classes from './SelfEmployedCounterpartyForm.module.css';

function SelfEmployedCounterpartyForm({ formData, handleChange }) {
    return (
        <>
            <div>
                <label>ФИО</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder='Уртенов Азамат Заурович'
                />
            </div>
                        
            <div>
                <label>Действует на основании</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="basis"
                    value={formData.basis}
                    onChange={handleChange}
                    placeholder='зарегистрирован(а) в ФНС в качестве налогоплательщика налога на профессиональный доход в соответствии с ФЗ от 27.11.2018 №422-ФЗ)'
                />
            </div>
            
            <div>
                <label>Наименование организации</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="orgNameGen"
                    value={formData.orgNameGen}
                    onChange={handleChange}
                    placeholder='Уртенов Азамат Заурович'
                />
            </div>

            <div>
                <label>Печать</label>
                <select name="print" required className={classes.input} value={formData.print} onChange={handleChange}>
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
                    value={formData.post}
                    onChange={handleChange}
                    placeholder='Самозанятый'
                />
            </div>

            <div>
                <label>Должность и ФИО (в род. падеже)</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="directorFullNameGen"
                    value={formData.directorFullNameGen}
                    onChange={handleChange}
                    placeholder='Самозанятого Уртенова Азамата Зауровича'
                />
            </div>

            <div>
                <label>Должность и Полное наименование организации (в род. падеже)</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="directorFullOrgNameGen"
                    value={formData.directorFullOrgNameGen}
                    onChange={handleChange}
                    placeholder='Самозанятый Уртенов Азамат Заурович'
                />
            </div>
            
            <div>
                <label>И.О. Фамилия</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="initials"
                    value={formData.initials}
                    onChange={handleChange}
                    placeholder='А.З. Уртенов'
                />
            </div>

            <div>
                <label>Адрес</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder='369000, КЧР, г. Черкесск, ул. Ленина, дом 53'
                />
            </div>

            <div>
                <label>ИНН</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="INN"
                    value={formData.INN}
                    onChange={handleChange}
                    placeholder='0900001180'
                />
            </div>

            <div>
                <label>Паспорт Серия</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="passportSeries"
                    value={formData.passportSeries}
                    onChange={handleChange}
                    placeholder='2132'
                />
            </div>

            <div>
                <label>Паспорт Номер</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder='2133321'
                />
            </div>

            <div>
                <label>Р/СЧ</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="RSCH"
                    value={formData.RSCH}
                    onChange={handleChange}
                    placeholder='40703810908000000463'
                />
            </div>

            <div>
                <label>К/СЧ</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="KSCH"
                    value={formData.KSCH}
                    onChange={handleChange}
                    placeholder='30101810500000000773'
                />
            </div>

            <div>
                <label>Банк</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder='в СТАВРОПОЛЬСКОМ Ф-Л ПАО "ПРОМСВЯЗЬБАНК", Ставрополь,'
                />
            </div>

            <div>
                <label>БИК</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="BIK"
                    value={formData.BIK}
                    onChange={handleChange}
                    placeholder='040702773'
                />
            </div>

            <div>
                <label>Электронная почта</label>
                <input
                    required
                    className={classes.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='reception@moibiz09.ru'
                />
            </div>

            <div>
                <label>Телефон</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='8 (8782) 25-02-27'
                />
            </div>
        </>
    );
}

export default SelfEmployedCounterpartyForm;
