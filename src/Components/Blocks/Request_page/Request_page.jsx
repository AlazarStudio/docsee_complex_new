import React, { useEffect, useRef, useState } from "react";
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
        id
        requestId
        orgName
        fullName
        requisites
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
        contractEndDate
        numberDate
        writtenDate
        writtenAmountAct
        act_stoimostNumber
        writtenAmountDogovor
        stoimostNumber
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
        notes {
        name
        description
        }
        state
        createdAt
        updatedAt
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
    const [currentNotes, setCurrentNotes] = useState(null);
    const [isActModalOpen, setIsActModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

    const [notification, setNotification] = useState({ message: "", status: "" });

    const clearNotification = () => {
        setNotification({ message: "", status: "" });
    };

    useEffect(() => {
        if (data?.requests) {
            setRequests(data.requests);
        }
    }, [data]);

    useSubscription(REQUEST_UPDATED, {
        onData: ({ client, data }) => {
            refetch();
        },
    });

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

        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_EXPENCE,
                variables: {
                    input: formData,
                }
            });

            const data = response.data.data.addExpenseFromPayload;
            data && closeInvoiceModal();

            setNotification({ message: `Счет для документа ${formData.contractName} успешно создан`, status: "success" });
        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });
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

        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_CONTRACT,
                variables: {
                    id: currentContract.id,
                    payload: formData,
                },
            });

            const data = response.data.data.updateRequest;

            data && closeInvoiceDogovorModal();

            setNotification({ message: `Договор успешно создан`, status: "success" });
        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });
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

        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_ACT,
                variables: {
                    input: formData,
                }
            });

            const data = response.data.data.addActFromPayload;
            data && closeActModal();
            setNotification({ message: `Акт для документа ${formData.contractName} успешно создан`, status: "success" });
        } catch (error) {
            console.error("Ошибка запроса", error);

            setNotification({ message: "Ошибка при отправке данных", status: "error" });
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
            contractName: currentContract.filename,
            idRequest: currentContract.id,
            receiver_orgNameGen: currentContract.directorFullNameGen,
            contractNumber: currentContract.contractNumber,
            writtenDate: currentContract.writtenDate,
            numberDate: currentContract.numberDate,
            services: currentContract.services.map(({ __typename, ...rest }) => rest),
            stoimostNumber: currentContract.stoimostNumber,
        };

        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GEN_REPORT,
                variables: {
                    input: formData,
                }
            });

            const data = response.data.data.addReportFromPayload;


            data && closeReportModal();
            setNotification({ message: `Отчет для документа ${formData.contractName} успешно создан`, status: "success" });
        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });
        }
    };



    const UPDATE_STATE_REQUEST = `
        mutation Mutation($updateRequestId: ID!, $input: RequestUpdateInput!) {
            updateRequest(id: $updateRequestId, input: $input) {
                state
            }
        }
    `;

    const handleUpdateStateDocument = async (id, state) => {
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: UPDATE_STATE_REQUEST,
                variables: {
                    "updateRequestId": id,
                    "input": {
                        "state": state
                    }
                }
            });

            const data = response.data.data.updateRequest;

            data && setNotification({ message: `Статус успешно обновлен`, status: "success" });

        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });

        }
    };

    const DELETE_REQUEST = `
        mutation DeleteRequest($deleteRequestId: ID!) {
            deleteRequest(id: $deleteRequestId) {
                id
            }
        }
    `;

    const handleDeleteDocument = async (id) => {
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: DELETE_REQUEST,
                variables: {
                    "deleteRequestId": id
                }
            });

            const data = response.data.data.deleteRequest;

            data && setNotification({ message: `Заявка успешно удалена`, status: "success" });

        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });

        }
    };




    const [noteName, setNoteName] = useState("Название");
    // const [noteDesc, setNoteDesc] = useState("");

    const [noteDesc, setNoteDesc] = useState("");
    const [savingNote, setSavingNote] = useState(false);

    function getNow() {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
    }

    async function handleAddNote() {
        const desc = noteDesc.trim();
        if (!desc || !currentNotes?.id) return;

        const newNote = { name: getNow(), description: desc };

        // оптимистично обновим UI
        const prevNotes = currentNotes.notes || [];
        const updatedNotes = [...prevNotes, newNote];
        setCurrentNotes(prev => ({ ...prev, notes: updatedNotes }));
        setNoteDesc("");
        setSavingNote(true);

        try {
            await handleUpdateNotesDocument(currentNotes.id, updatedNotes);
            // успех — уже всё в state
        } catch (e) {
            // откатываем
            setCurrentNotes(prev => ({ ...prev, notes: prevNotes }));
        } finally {
            setSavingNote(false);
        }
    }

    const UPDATE_NOTES = `
        mutation UpdateRequest($updateRequestId: ID!, $input: RequestUpdateInput!) {
            updateRequest(id: $updateRequestId, input: $input) {
                notes {
                    name
                    description
                }
            }
        }
    `;

    const handleUpdateNotesDocument = async (id, notes) => {
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: UPDATE_NOTES,
                variables: {
                    "updateRequestId": id,
                    "input": {
                        "notes": notes
                    }
                }
            });

            const data = response.data.data.updateRequest;

            // console.log(id)

            // data && setNotification({ message: `Заметки успешно обновлены`, status: "success" });

        } catch (error) {
            console.error("Ошибка запроса", error);
            setNotification({ message: "Ошибка при отправке данных", status: "error" });

        }
    };

    const GET_NOTES = `
        query Query($requestId: ID!) {
            request(id: $requestId) {
                id,
                notes {
                    name
                    description
                }
            }
        }
    `;

    const handleGetNotes = async (id) => {
        try {
            const response = await axios.post("http://31.207.75.252:4000/graphql", {
                query: GET_NOTES,
                variables: {
                    "requestId": id,
                }
            });

            const data = response.data.data.request;

            openNotesModal(data)

        } catch (error) {
            console.error("Ошибка запроса", error);

        }
    };

    const openNotesModal = (contract) => {
        setCurrentNotes(contract)
        setIsNotesModalOpen(true);
    };

    const closeNotesModal = () => {
        setIsNotesModalOpen(false);
        setCurrentContract(null);
    };

    const notesEndRef = useRef(null);
    const listRef = useRef(null);

    function scrollToBottom(smooth = true) {
        const el = listRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }

    useEffect(() => {
        if (!isNotesModalOpen) return;
        requestAnimationFrame(() => scrollToBottom(false));
    }, [isNotesModalOpen]);

    useEffect(() => {
        if (!isNotesModalOpen) return;
        scrollToBottom(true);
    }, [currentNotes?.notes?.length, isNotesModalOpen]);

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
                                    <select onChange={(e) => handleUpdateStateDocument(req.id, e.target.value)} value={req.state ?? "created"}>
                                        <option value="created">Создан</option>
                                        <option value="closing_ready">Закрывающие готовы</option>
                                        <option value="agreement">Согласование</option>
                                        <option value="waiting_payment">Ждет оплаты</option>
                                        <option value="paid">Оплачен</option>
                                    </select>
                                </div>
                            </div>
                            <div className={classes.mainForm_docs_element_btns}>
                                <div className={classes.iconMess}>
                                    <img src="/chat.png" alt="Скачать" onClick={() => handleGetNotes(req.id)} />
                                    {req.notes.length > 0 &&<div className={classes.iconMess_count}>{req.notes.length}</div>}
                                </div>
                                <DocMenu type="download" request={req} onSelect={handleDownload}>
                                    <img src="/download_doc.png" alt="Скачать" className={classes.icon} />
                                </DocMenu>
                                <DocMenu type="create" request={req} onSelect={handleCreate}>
                                    <img src="/dots.png" alt="Действия" className={classes.icon} />
                                </DocMenu>
                                <img className={classes.deleteIcon} src="/delete.png" alt="" onClick={() => handleDeleteDocument(req.id)} />
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

            <Modal isOpen={isNotesModalOpen} onClose={closeNotesModal}>
                <div style={{ display: "grid", gap: 12, minWidth: 420 }}>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>Примечания</div>

                    <div
                        ref={listRef}
                        style={{
                            display: "grid",
                            gap: 10,
                            maxHeight: 280,
                            overflowY: "auto",
                            paddingRight: 6,
                        }}
                    >
                        {currentNotes?.notes?.length ? (
                            currentNotes.notes.map((note, i) => (
                                <div
                                    key={i}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 12,
                                        padding: "10px 12px",
                                        background: "#fff",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#6b7280",
                                            marginBottom: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                background: "#10b981",
                                                display: "inline-block",
                                            }}
                                        />
                                        {note.name}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#111827", whiteSpace: "pre-wrap" }}>
                                        {note.description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    color: "#6b7280",
                                    fontSize: 14,
                                    padding: "8px 0",
                                }}
                            >
                                Нет примечаний
                            </div>
                        )}

                        <div ref={notesEndRef} />
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gap: 8,
                            borderTop: "1px solid #e5e7eb",
                            paddingTop: 12,
                        }}
                    >
                        <label style={{ fontSize: 13, color: "#374151" }}>Новое примечание</label>
                        <textarea
                            placeholder="Описание примечания"
                            rows={3}
                            value={noteDesc}
                            onChange={(e) => setNoteDesc(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAddNote();
                            }}
                            style={{
                                width: "100%",
                                border: "1px solid #d1d5db",
                                borderRadius: 8,
                                padding: 10,
                                fontSize: 14,
                                outline: "none",
                            }}
                        />
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={handleAddNote}
                                disabled={savingNote || !noteDesc.trim()}
                                style={{
                                    background: savingNote ? "#9ca3af" : "#111827",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "8px 14px",
                                    fontSize: 14,
                                    cursor: savingNote || !noteDesc.trim() ? "not-allowed" : "pointer",
                                    transition: "opacity .2s",
                                }}
                                title="Ctrl/Cmd + Enter для добавления"
                            >
                                {savingNote ? "Сохранение..." : "Добавить"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Notification message={notification.message} status={notification.status} clearNotification={clearNotification} />
        </div>
    );
}

export default Request_page;