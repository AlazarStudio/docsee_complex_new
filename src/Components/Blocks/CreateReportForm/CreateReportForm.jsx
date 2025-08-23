import React, { useState } from 'react';
import classes from './CreateReportForm.module.css';

function CreateReportForm({ onSubmit, onClose, currentContract }) {
    const [creationDate, setCreationDate] = useState('');
    const [contractType, setContractType] = useState(currentContract && currentContract.data.contractType);
    const [reportTemplate, setReportTemplate] = useState('');

    function getDate(dateInfo, type = 'numeric') {
        const date = new Date(dateInfo);
        const options = { day: 'numeric', month: type, year: 'numeric' };
        const dateString = date.toLocaleDateString('ru-RU', options).replace(' г.', '');
        return dateString;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            contractType,
            reportTemplate,
            date: getDate(creationDate)
        });
    };


    let list_2_side = [
        {
            label: "Отчет общий",
            template: "Template_2_side_report",
        }
    ]

    let list_3_side = [
        {
            label: "Отчет Комплексные Сайт",
            template: "Template_3_side_report",
        },
        {
            label: "Отчет Комплексные Видео",
            template: "Template_3_side_report_video",
        },
        {
            label: "Отчет Комплексные Рекламка",
            template: "Template_3_side_report_marketing",
        },
        {
            label: "Отчет Комплексные Фирстиль",
            template: "Template_3_side_report_firStyle",
        },
        {
            label: "Отчет Комплексные Фото-контент",
            template: "Template_3_side_report_photoContent",
        }
    ]

    return (
        <>
            <h2>Создание нового отчета для документа</h2>
            <form className={classes.modalForm} onSubmit={handleSubmit}>
                <div>
                    <label>Дата:</label>
                    <input
                        type="date"
                        value={creationDate}
                        onChange={(e) => setCreationDate(e.target.value)}
                        required
                    />
                </div>
                {/* <div>
                    <label>Тип договора:</label>
                    <select required value={contractType} onChange={(e) => setContractType(e.target.value)}>
                        <option value="" disabled>Выберите тип договора</option>
                        <option value="2">Двухсторонний</option>
                        <option value="3">Трехсторонний</option>
                    </select>
                </div> */}
                {contractType === '2' ?
                    <div>
                        <label>Шаблон договора:</label>
                        <select required value={reportTemplate} onChange={(e) => setReportTemplate(e.target.value)}>
                            <option value="" disabled>Выберите шаблон</option>
                            {list_2_side.map((listItem, index) => (
                                <option key={index} value={listItem.template}>{listItem.label}</option>
                            ))}
                        </select>
                    </div>
                    :
                    contractType === '3' ?
                        <div>
                            <label>Шаблон договора:</label>
                            <select required value={reportTemplate} onChange={(e) => setReportTemplate(e.target.value)}>
                                <option value="" disabled>Выберите шаблон</option>
                                {list_3_side.map((listItem, index) => (
                                    <option key={index} value={listItem.template}>{listItem.label}</option>
                                ))}
                            </select>
                        </div>
                        : ''
                }

                <button type="submit">Создать</button>
            </form >
        </>
    );
}

export default CreateReportForm;
