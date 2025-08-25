import React, { useEffect, useState } from "react";
import classes from './Request_page.module.css';
import axios from "axios";
import Modal from '../Modal/Modal';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import AddCounterparty from "../AddCounterparty/AddCounterparty";
import CreateInvoiceForm from '../CreateInvoiceForm/CreateInvoiceForm';
import CreateInvoiceFormDogovor from '../CreateInvoiceFormDogovor/CreateInvoiceFormDogovor';
import CreateActForm from '../CreateActForm/CreateActForm';
import CreateReportForm from '../CreateReportForm/CreateReportForm';
import DocMenu from "../DocMenu/DocMenu";
import Notification from "../Notification/Notification.jsx";
import { gql, useQuery, useSubscription } from "@apollo/client";


const GET_REQUESTS = gql`
        query Query {
            requests {
                items {
                    id
                    requestId
                    orgName
                    fullName
                    shortName
                    orgNameGen
                    basis
                    print
                    post
                    directorName
                    directorFullNameGen
                    initials
                    address
                    email
                    bankName
                    BIK
                    INN
                    KPP
                    OGRN
                    OGRNIP
                    RSCH
                    KSCH
                    phone
                    type
                    filename
                    filePath
                    contractNumber
                    contractJustNumber
                    numberDate
                    writtenDate
                    writtenAmountAct
                    writtenAmountDogovor
                    stoimostNumber
                    state
                    createdAt
                    updatedAt
                    services {
                        serviceId
                        name
                        quantity
                        unit
                        pricePerUnit
                        vat
                        totalPrice
                    }
                    acts {
                        actsNumber
                        contractType
                        creationDate
                        filename
                        filePath
                    }
                    expenses {
                        expensesNumber
                        creationDate
                        filename
                        filePath
                    }
                    reports {
                        creationDate
                        filename
                        filePath
                    }
                    requisites
                    contractEndDate
                    act_stoimostNumber
                }
            }
            }
`;

const REQUEST_UPDATED = gql`
  subscription Subscription {
    requestUpdated {
      id
      updatedAt
    }
  }
`;

function Request_page({ children, ...props }) {
    const [requests, setRequests] = useState([]);
    const { data, loading, error, refetch } = useQuery(GET_REQUESTS, {
        fetchPolicy: "no-cache",
        context: {
            addTypename: false,
        },
    });

    const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);
    const [isInvoiceDogovorModalOpen, setIsInvoiceDogovorModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isInvoiceModalDogovorOpen, setIsInvoiceModalDogovorOpen] = useState(false);
    const [currentContract, setCurrentContract] = useState(null);
    const [isActModalOpen, setIsActModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const [notification, setNotification] = useState({ message: "", status: "" });

    const clearNotification = () => {
        setNotification({ message: "", status: "" });
    };

    // useEffect(() => {
    //     axios.post("http://31.207.75.252:4000/", {
    //         query: GET_REQUESTS,
    //         variables: {}
    //     })
    //         .then(res => setRequests(res.data.data.requests.items))
    //         .catch(err => console.error("Ошибка загрузки заявок", err));
    // }, []);

    useEffect(() => {
        if (data?.requests?.items) {
            setRequests(data.requests.items);
        }
    }, [data]);

    useSubscription(REQUEST_UPDATED, {
        onData: ({ client, data }) => {
            // можно точечно обновлять, но безопаснее рефетчнуть (быстро и просто)
            refetch();
        },
    });

    // console.log(requests)

    const openCounterpartyModal = () => {
        setIsCounterpartyModalOpen(true);
    };

    const closeCounterpartyModal = () => {
        setIsCounterpartyModalOpen(false);
    };

    const openCounterpartyDogovorModal = () => {
        setIsCounterpartyModalOpen(true);
    };

    const closeCounterpartyDogovorModal = () => {
        setIsCounterpartyModalOpen(false);
    };

    const handleCounterpartySubmit = (counterpartyData) => {
        closeCounterpartyModal();
    };

    const handleCounterpartyDogovorSubmit = (counterpartyData) => {
        closeCounterpartyModal();
    };


    const handleExit = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handleCreate = (kind, req) => {
        // TODO: сюда подключи GraphQL mutation создания
        // kind: 'contract' | 'act' | 'invoice' | 'report'

        if (kind === 'invoice') {
            openInvoiceModal(req);
        }

        if (kind === 'contract') {
            openInvoiceDogovorModal(req);
        }

        if (kind === 'act') {
            openActModal(req);
        }

        if (kind === 'report') {
            openReportModal(req);
        }
    };

    const handleDownload = async (kind, req) => {
        if (kind === 'contract') {
            window.open('http://31.207.75.252:4000' + req.filePath, '_blank');
        }
        if (kind === 'invoice') {
            console.log(req)
            window.open('http://31.207.75.252:4000' + req.expenses.at(-1).filePath, '_blank');
        }
        if (kind === 'act') {
            console.log(req)
            window.open('http://31.207.75.252:4000' + req.acts.at(-1).filePath, '_blank');
        }
        if (kind === 'report') {
            console.log(req)
            window.open('http://31.207.75.252:4000' + req.reports.at(-1).filePath, '_blank');
        }
    };

    const openInvoiceModal = (contract) => {
        setCurrentContract(contract);
        setIsInvoiceModalOpen(true);
    };

    const closeInvoiceModal = () => {
        setIsInvoiceModalOpen(false);
        setCurrentContract(null);
    };

    const openInvoiceDogovorModal = (contract) => {
        setCurrentContract(contract);
        setIsInvoiceDogovorModalOpen(true);
    };

    const closeInvoiceDogovorModal = () => {
        setIsInvoiceDogovorModalOpen(false);
        setCurrentContract(null);
    };

    const GEN_EXPENCE = `
        mutation Mutation($input: ExpensePayloadInput!) {
            addExpenseFromPayload(input: $input) {
                id
            }
        }
    `;

    const handleInvoiceSubmit = async (data) => {
        const formData = {
            expense_creationDate: data.date,
            contractName: currentContract.filename,
            contractNumber: currentContract.contractNumber,

            writtenDate: currentContract.writtenDate,

            services: data.services,
            stoimostNumber: data.act_stoimostNumber,
            writtenAmountAct: data.act_writtenAmountAct,
            idRequest: currentContract.id,
            expense_number: data.expenseNumber
        };

        // console.log(formData)
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_EXPENCE,
                variables: {
                    input: formData,
                }
            });

            const data = response.data.data.addExpenseFromPayload;
            // console.log("Сгенерирован счет:", data);
            data && closeInvoiceModal();
            // fetchDocuments();

            setNotification({ message: `Счет для документа ${formData.contractName} успешно создан`, status: "success" });
            // alert(`Счет для документа ${formData.contractName} успешно создан`);
            // setIsFetch(prev => !prev)
        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });
            // alert('Ошибка при отправке данных');
        }
    };

    const GEN_CONTRACT = `
        mutation GenContract($id: ID!, $payload: ContractPayloadInput!) {
            updateRequest(
                id: $id,
                input: {
                    generateContractFromPayload: true
                    contractPayload: $payload
                }
            ) {
                id
                filename
                filePath
            }
        }
    `;

    const handleInvoiceDogovorSubmit = async (data) => {
        let receiver_info =
            (currentContract.type == 'Гос'
                ?
                (currentContract.NKAZCH != '' && currentContract.EKAZSCH != '' && currentContract.LSCH != '')
                    ?
                    `Адрес местонахождения: ${currentContract.address}, ИНН: ${currentContract.INN}, КПП: ${currentContract.KPP}, ОКТМО: ${currentContract.OKTMO}, ОКАТО: ${currentContract.OKATO}, Номер казначейского счета: ${currentContract.NKAZCH}, Единый казначейский счет: ${currentContract.EKAZSCH}, Банк: ${currentContract.bankName}, БИК: ${currentContract.BIK}, Л/сч: ${currentContract.LSCH}, ОГРН: ${currentContract.OGRN}, ОКПО: ${currentContract.OKPO}, ОКОПФ: ${currentContract.OKOPF}, ОКОГУ: ${currentContract.OKOGU}, E-mail: ${currentContract.email}, тел.: ${currentContract.phone}`
                    :
                    `Адрес местонахождения: ${currentContract.address}, ИНН: ${currentContract.INN}, КПП: ${currentContract.KPP}, ОКТМО: ${currentContract.OKTMO}, ОКАТО: ${currentContract.OKATO}, Р/СЧ: ${currentContract.RSCH}, К/СЧ: ${currentContract.KSCH}, Банк: ${currentContract.bankName}, БИК: ${currentContract.BIK}, ОГРН: ${currentContract.OGRN}, ОКПО: ${currentContract.OKPO}, ОКОПФ: ${currentContract.OKOPF}, ОКОГУ: ${currentContract.OKOGU}, E-mail: ${currentContract.email}, тел.: ${currentContract.phone}`
                :
                currentContract.type == 'МСП'
                    ?
                    `Адрес местонахождения: ${currentContract.address}, ИНН: ${currentContract.INN}, ОГРН: ${currentContract.OGRN}, КПП: ${currentContract.KPP}, Р/с: ${currentContract.RSCH}, Банк: ${currentContract.bankName}, БИК: ${currentContract.BIK}, К/с: ${currentContract.KSCH}, E-mail: ${currentContract.email}, тел.: ${currentContract.phone}`
                    :
                    currentContract.type == 'ИП'
                        ?
                        `Адрес местонахождения: ${currentContract.address}, ИНН: ${currentContract.INN}, ОГРНИП: ${currentContract.OGRNIP}, Р/с: ${currentContract.RSCH}, Банк: ${currentContract.bankName}, БИК: ${currentContract.BIK}, К/с: ${currentContract.KSCH}, E-mail: ${currentContract.email}, тел.: ${currentContract.phone}`
                        :
                        currentContract.type == 'Самозанятый'
                            ?
                            `Адрес местонахождения: ${currentContract.address}, Паспорт ${currentContract.passportSeries} № ${currentContract.passportNumber} ИНН: ${currentContract.INN}, Р/с: ${currentContract.RSCH}, Банк: ${currentContract.bankName}, БИК: ${currentContract.BIK}, К/с: ${currentContract.KSCH}, тел.: ${currentContract.phone}`
                            :
                            '')

        let receiver_info_mass = receiver_info.split(',')

        let result = receiver_info_mass.map(item => {
            const [name, info] = item.split(':');
            return {
                name: name.trim(),
                info: info ? info.trim() : ''
            };
        });

        const formData = {
            numberDate: data.numberDate,
            contractNumber: data.contractNumber,
            writtenDate: data.writtenDate,
            receiver_fullName: currentContract.fullName,
            contractJustNumber: data.contractJustNumber,
            writtenAmountDogovor: data.writtenAmountDogovor,
            contractEndDate: data.contractEndDate,

            receiver_post: currentContract.post,
            receiver_initials: currentContract.initials,
            receiver_print: currentContract.print,

            receiver_basis:
                (currentContract.type == 'Гос' || currentContract.type == 'МСП' ? `действующий на основании ${currentContract.basis}` :
                    currentContract.type == 'ИП' ? `действующий на основании ${currentContract.basis} ${currentContract.OGRNIP}` :
                        currentContract.type == 'Самозанятый' ? `${currentContract.basis} (паспорт серия ${currentContract.passportSeries} №${currentContract.passportNumber}, ИНН ${currentContract.INN})` : ''),

            receiver_requisites: result,

            stoimostNumber: data.act_stoimostNumber,

            act_stoimostNumber: data.act_stoimostNumber,
            writtenAmountAct: data.act_writtenAmountAct,

            services: data.services,
        };

        // console.log('formData', formData);

        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_CONTRACT,
                variables: {
                    id: currentContract.id,
                    payload: formData,
                },
            });

            const data = response.data.data.updateRequest;
            // console.log("Сгенерирован контракт:", data);

            data && closeInvoiceDogovorModal();
            // fetchDocuments();

            setNotification({ message: `Договор успешно создан`, status: "success" });
            // alert(`Счет для документа ${formData.contractName} успешно создан`);
            // setIsFetch(prev => !prev)
        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });
            // alert('Ошибка при отправке данных');
        }
    };


    const openActModal = (contract) => {
        setCurrentContract(contract);
        setIsActModalOpen(true);
    };

    const closeActModal = () => {
        setIsActModalOpen(false);
        setCurrentContract(null);
    };


    const GEN_ACT = `
        mutation AddActFromPayload($input: ActPayloadInput!) {
            addActFromPayload(input: $input) {
                id
            }
        }
    `;

    const handleActSubmit = async (data) => {
        const formData = {
            act_receiver_requisites:
                (currentContract.type == 'Гос'
                    ?
                    (currentContract.NKAZCH != '' && currentContract.EKAZSCH != '' && currentContract.LSCH != '') ?
                        `${currentContract.fullName}, ИНН: ${currentContract.INN}, КПП: ${currentContract.KPP}, Номер казначейского счета: ${currentContract.NKAZCH}, Единый казначейский счет: ${currentContract.EKAZSCH}, ${currentContract.bankName}, БИК: ${currentContract.BIK}, Л/сч: ${currentContract.LSCH}, ОГРН: ${currentContract.OGRN}`
                        :
                        `${currentContract.fullName}, ИНН: ${currentContract.INN}, КПП: ${currentContract.KPP}, Р/СЧ: ${currentContract.RSCH}, К/СЧ: ${currentContract.KSCH}, ${currentContract.bankName}, БИК: ${currentContract.BIK}, ОГРН: ${currentContract.OGRN}, `
                    :
                    currentContract.type == 'МСП'
                        ?
                        `${currentContract.fullName}, ИНН: ${currentContract.INN}, ОГРН: ${currentContract.OGRN}, КПП: ${currentContract.KPP}, Р/с: ${currentContract.RSCH}, ${currentContract.bankName}, БИК: ${currentContract.BIK}, К/с: ${currentContract.KSCH}`
                        :
                        currentContract.type == 'ИП'
                            ?
                            `${currentContract.fullName}, ИНН: ${currentContract.INN}, ОГРНИП: ${currentContract.OGRNIP}, Р/с: ${currentContract.RSCH}, ${currentContract.bankName}, БИК: ${currentContract.BIK}, К/с: ${currentContract.KSCH}`
                            :
                            currentContract.type == 'Самозанятый'
                                ?
                                `${currentContract.fullName}, ИНН: ${currentContract.INN}, Р/с: ${currentContract.RSCH}, ${currentContract.bankName}, БИК: ${currentContract.BIK}, К/с: ${currentContract.KSCH}`
                                :
                                ''),
            contractNumber: currentContract.contractNumber,
            writtenDate: currentContract.writtenDate,

            receiver_post: currentContract.post,
            receiver_initials: currentContract.initials,
            receiver_print: currentContract.print,

            act_creationDate: data.date,
            act_number: data.actNumber,
            contractName: currentContract.filename,
            services: data.services,
            stoimostNumber: data.act_stoimostNumber,
            writtenAmountAct: data.act_writtenAmountAct,
            idRequest: currentContract.id
        };

        // console.log(formData)
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_ACT,
                variables: {
                    input: formData,
                }
            });

            const data = response.data.data.addActFromPayload;
            // console.log("Сгенерирован акт:", data);
            data && closeActModal();
            // fetchDocuments();
            setNotification({ message: `Акт для документа ${formData.contractName} успешно создан`, status: "success" });
            // alert(`Акт для документа ${formData.contractName} успешно создан`);
            // setIsFetch(prev => !prev)
        } catch (error) {
            console.error("Ошибка запроса", error);

            setNotification({ message: "Ошибка при отправке данных", status: "error" });
            // alert('Ошибка при отправке данных');
        }
    };



    const openReportModal = (contract) => {
        setCurrentContract(contract);
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setCurrentContract(null);
    };


    const GEN_REPORT = `
        mutation AddReportFromPayload($input: ReportPayloadInput!) {
            addReportFromPayload(input: $input) {
                id
            }
        }
    `;

    const handleReportSubmit = async (data) => {
        const formData = {
            creationDate: data.date,
            // reportTemplate: data.reportTemplate,
            contractName: currentContract.filename,
            idRequest: currentContract.id,
            receiver_orgNameGen: currentContract.directorFullNameGen,
            contractNumber: currentContract.contractNumber,
            writtenDate: currentContract.writtenDate,
            numberDate: currentContract.numberDate,
            services: currentContract.services.map(({ __typename, ...rest }) => rest),
            stoimostNumber: currentContract.stoimostNumber,
        };

        // console.log(formData)
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_REPORT,
                variables: {
                    input: formData,
                }
            });

            const data = response.data.data.addReportFromPayload;
            // console.log("Сгенерирован отчет:", data);     


            data && closeReportModal();
            // fetchDocuments();
            setNotification({ message: `Отчет для документа ${formData.contractName} успешно создан`, status: "success" });
            // alert(`Отчет для документа ${formData.contractName} успешно создан`);
            // setIsFetch(prev => !prev)
        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });
            // alert('Ошибка при отправке данных');
        }
    };

    return (
        <div className={classes.main}>
            <div className={classes.mainForm}>
                <div className={classes.mainForm_buttons}>
                    <div className={classes.mainForm_buttons_elem}>
                        <div className={classes.mainForm_buttons_btn} onClick={openCounterpartyModal}>Создать заявку</div>
                    </div>

                    <div className={classes.mainForm_buttons_search}>
                        <input
                            type="text"
                            className={classes.searchInput}
                            placeholder="Поиск..."
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <img src="/exit.png" alt="" style={{ width: '20px', cursor: 'pointer' }} onClick={handleExit} />
                </div>

                <div className={classes.mainForm_docs_title}>
                    <div className={classes.mainForm_docs_element}>
                        <div className={classes.mainForm_docs_element_info}>
                            <div className={classes.mainForm_docs_element_num} >№ </div>
                            <div className={classes.mainForm_docs_element_name} >Наименование организации </div>
                            <div className={classes.mainForm_docs_element_contr} >ИНН</div>
                            <div className={classes.mainForm_docs_element_contr} >Телефон </div>
                            <div className={classes.mainForm_docs_element_date} >Дата </div>
                            <div className={classes.mainForm_docs_element_price} >Стоимость </div>
                            <div className={classes.mainForm_docs_element_state} >Состояние </div>
                        </div>
                    </div>
                </div>

                {/* Рендеринг документов, сгруппированных по состояниям */}
                <div className={classes.mainForm_docs}>
                    {requests.map((req, index) => (
                        <div key={req.id} className={classes.mainForm_docs_element}>
                            <div className={classes.mainForm_docs_element_info}>
                                <div className={classes.mainForm_docs_element_num}>{index + 1}</div>
                                <div className={classes.mainForm_docs_element_name}>{req.shortName}</div>
                                <div className={classes.mainForm_docs_element_contr}>{req.INN}</div>
                                <div className={classes.mainForm_docs_element_contr}>{req.phone}</div>
                                <div className={classes.mainForm_docs_element_date}>{req.numberDate ? req.numberDate : '-'}</div>
                                <div className={classes.mainForm_docs_element_price}>{req.stoimostNumber ? req.stoimostNumber + ' ₽' : '-'}</div>
                                <div className={classes.mainForm_docs_element_state}>
                                    <select>
                                        <option value="created">Создан</option>
                                        <option value="Закрывающие готовы">Закрывающие готовы</option>
                                        <option value="Согласование">Согласование</option>
                                        <option value="Ждет оплаты">Ждет оплаты</option>
                                        <option value="Оплачен">Оплачен</option>
                                    </select>
                                </div>
                            </div>
                            <div className={classes.mainForm_docs_element_btns}>
                                <DocMenu type="download" request={req} onSelect={handleDownload}>
                                    <img src="/download_doc.png" alt="Скачать" className={classes.icon} />
                                </DocMenu>
                                <DocMenu type="create" request={req} onSelect={handleCreate}>
                                    <img src="/dots.png" alt="Действия" className={classes.icon} />
                                </DocMenu>
                                <img className={classes.deleteIcon} src="/delete.png" alt="" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Modal isOpen={isCounterpartyModalOpen} onClose={closeCounterpartyModal}>
                <AddCounterparty onSubmit={handleCounterpartySubmit} />
            </Modal>

            <Modal isOpen={isInvoiceModalOpen} onClose={closeInvoiceModal}>
                <CreateInvoiceForm currentContract={currentContract} onSubmit={handleInvoiceSubmit} onClose={closeInvoiceModal} />
            </Modal>

            <Modal isOpen={isInvoiceDogovorModalOpen} onClose={closeInvoiceDogovorModal}>
                <CreateInvoiceFormDogovor currentContract={currentContract} onSubmit={handleInvoiceDogovorSubmit} onClose={closeInvoiceDogovorModal} />
            </Modal>

            <Modal isOpen={isActModalOpen} onClose={closeActModal}>
                <CreateActForm currentContract={currentContract} onSubmit={handleActSubmit} onClose={closeActModal} />
            </Modal>

            <Modal isOpen={isReportModalOpen} onClose={closeReportModal}>
                <CreateReportForm onSubmit={handleReportSubmit} currentContract={currentContract} onClose={closeReportModal} />
            </Modal>

            <Notification message={notification.message} status={notification.status} clearNotification={clearNotification} />
        </div >
    );
}

export default Request_page;