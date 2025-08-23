import React from "react";
import classes from './GosCounterpartyForm.module.css';

function GosCounterpartyForm({ formData, handleChange }) {
    return (
        <>
            <div>
                <label>Полное наименование</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder='Автономная некоммерческая организация «Центр «Мой бизнес» Карачаево-Черкесской Республики'
                />
            </div>

            <div>
                <label>Сокращенное наименование</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleChange}
                    placeholder='АНО «Центр «Мой бизнес» Карачаево-Черкесской Республики»'
                />
            </div>

            <div>
                <label>Наименование организации (в родительном падеже)</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="orgNameGen"
                    value={formData.orgNameGen}
                    onChange={handleChange}
                    placeholder='Автономной некоммерческой организации «Центр «Мой бизнес» Карачаево-Черкесской Республики'
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
                    placeholder='Устава'
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
                    placeholder='Директор'
                />
            </div>

            <div>
                <label>ФИО</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="directorName"
                    value={formData.directorName}
                    onChange={handleChange}
                    placeholder='Хубиева Диана Казимовна'
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
                    placeholder='Директора Хубиевой Дианы Казимовны'
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
                    placeholder='Д.К. Хубиева'
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
                    placeholder='369000, КЧР, г. Черкесск, ул. Ленина, дом 53.'
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
                <label>КПП</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="KPP"
                    value={formData.KPP}
                    onChange={handleChange}
                    placeholder='090001001'
                />
            </div>

            <div>
                <label>ОКТМО</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="OKTMO"
                    value={formData.OKTMO}
                    onChange={handleChange}
                    placeholder='91701000001'
                />
            </div>

            <div>
                <label>ОКАТО</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="OKATO"
                    value={formData.OKATO}
                    onChange={handleChange}
                    placeholder='91401000000'
                />
            </div>

            <div>
                <label>ОКПО</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="OKPO"
                    value={formData.OKPO}
                    onChange={handleChange}
                    placeholder='54056422'
                />
            </div>

            <div>
                <label>ОКОПФ</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="OKOPF"
                    value={formData.OKOPF}
                    onChange={handleChange}
                    placeholder='71400'
                />
            </div>

            <div>
                <label>ОГРН</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="OGRN"
                    value={formData.OGRN}
                    onChange={handleChange}
                    placeholder='1210900002950'
                />
            </div>

            <div>
                <label>Л/СЧ</label>
                <input
                    className={classes.input}
                    type="text"
                    name="LSCH"
                    value={formData.LSCH}
                    onChange={handleChange}
                    placeholder='712НИЖ55001'
                />
            </div>

            <div>
                <label>Р/СЧ</label>
                <input
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
                    className={classes.input}
                    type="text"
                    name="KSCH"
                    value={formData.KSCH}
                    onChange={handleChange}
                    placeholder='30101810500000000773'
                />
            </div>

            <div>
                <label>Номер казначейского счета</label>
                <input
                    className={classes.input}
                    type="text"
                    name="NKAZCH"
                    value={formData.NKAZCH}
                    onChange={handleChange}
                    placeholder='03226643910000007900'
                />
            </div>

            <div>
                <label>Единый казначейский счет</label>
                <input
                    className={classes.input}
                    type="text"
                    name="EKAZSCH"
                    value={formData.EKAZSCH}
                    onChange={handleChange}
                    placeholder='40102810245370000078'
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
                <label>ОКОГУ</label>
                <input
                    required
                    className={classes.input}
                    type="text"
                    name="OKOGU"
                    value={formData.OKOGU}
                    onChange={handleChange}
                    placeholder='4210014'
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

export default GosCounterpartyForm;
