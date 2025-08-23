// src/components/DocMenu.jsx
import React, { useState, useRef } from "react";
import { Menu, MenuItem, Divider, ListItemIcon, ListItemText } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Универсальное меню документов.
 * Использование:
 *   <DocMenu type="create" request={req} onSelect={(kind, req) => ...}>
 *     <img src="/dots.png" />
 *   </DocMenu>
 *
 *   <DocMenu type="download" request={req} onSelect={(kind, req) => ...}>
 *     <img src="/download_doc.png" />
 *   </DocMenu>
 *
 * props:
 * - type: "create" | "download"
 * - request: объект заявки
 * - onSelect: (kind, request) => void
 * - children: триггер (один элемент), на который навесим onClick (якорь)
 */
export default function DocMenu({ type = "create", request, onSelect, children }) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const trigger = React.cloneElement(children, {
        ref: anchorRef,
        onClick: handleOpen,
        style: { cursor: "pointer", ...(children.props.style || {}) },
    });

    const isCreate = type === "create";

    const handlePick = (kind) => {
        onSelect?.(kind, request);
        handleClose();
    };

    return (
        <>
            {trigger}

            <Menu
                anchorEl={anchorRef.current}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
            >
                {isCreate ? (
                    <>
                        <MenuItem onClick={() => handlePick("contract")}>
                            <ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Создать договор" />
                        </MenuItem>
                        <MenuItem onClick={() => handlePick("invoice")} disabled={!request?.filename} >
                            <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Создать счёт" />
                        </MenuItem>
                        <MenuItem onClick={() => handlePick("act")} disabled={!request?.filename} >
                            <ListItemIcon><ArticleIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Создать акт" />
                        </MenuItem>
                        {/* <Divider /> */}
                        <MenuItem onClick={() => handlePick("report")} disabled={!request?.filename} >
                            <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Создать отчёт" />
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem onClick={() => handlePick("contract")} disabled={!request?.filename} >
                            <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Скачать договор" />
                        </MenuItem>
                        <MenuItem onClick={() => handlePick("invoice")} disabled={request?.expenses.length == 0} >
                            <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Скачать счёт" />
                        </MenuItem>
                        <MenuItem onClick={() => handlePick("act")} disabled={request?.acts.length == 0} >
                            <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Скачать акт" />
                        </MenuItem>
                        {/* <Divider /> */}
                        <MenuItem onClick={() => handlePick("report")} disabled={request?.reports.length == 0} >
                            <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Скачать отчёт" />
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
}
