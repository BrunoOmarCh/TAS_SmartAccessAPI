import { useEffect, useMemo, useState } from "react";

import {
    getResidents,
    createResident,
    updateResident,
    deleteResident
} from "./api/residentApi";

import {
    getAccessRecords,
    createAccess
} from "./api/accessApi";

import "./App.css";

function App() {

    // =========================================================
    // ESTADOS
    // =========================================================

    const [residents, setResidents] = useState([]);
    const [accessRecords, setAccessRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [accessMethodFilter, setAccessMethodFilter] =
        useState("ALL");

    const [accessStatusFilter, setAccessStatusFilter] =
        useState("ALL");

    const [showResidentModal, setShowResidentModal] =
        useState(false);

    const [editingResident, setEditingResident] =
        useState(null);

    const [residentForm, setResidentForm] = useState({
        name: "",
        documentNumber: "",
        apartment: "",
        email: ""
    });

    const [accessForm, setAccessForm] = useState({
        residentId: "",
        accessType: "FACIAL",
        status: "AUTHORIZED"
    });

    // =========================================================
    // CARGA DE DATOS
    // =========================================================

    const loadData = async () => {

        setLoading(true);
        setError("");

        try {

            const [residentsData, accessData] =
                await Promise.all([
                    getResidents(),
                    getAccessRecords()
                ]);

            setResidents(residentsData);
            setAccessRecords(accessData);

        } catch (err) {

            console.error(err);

            setError(
                "No se pudieron cargar los datos. " +
                "Verifica que los microservicios estén funcionando."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================================================
    // MENSAJES
    // =========================================================

    const showMessage = (text) => {

        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    // =========================================================
    // RESIDENTES
    // =========================================================

    const openCreateResident = () => {

        setEditingResident(null);

        setResidentForm({
            name: "",
            documentNumber: "",
            apartment: "",
            email: ""
        });

        setShowResidentModal(true);
    };

    const openEditResident = (resident) => {

        setEditingResident(resident);

        setResidentForm({
            name: resident.name || "",
            documentNumber: resident.documentNumber || "",
            apartment: resident.apartment || "",
            email: resident.email || ""
        });

        setShowResidentModal(true);
    };

    const closeResidentModal = () => {

        setShowResidentModal(false);
        setEditingResident(null);
    };

    const handleResidentChange = (event) => {

        setResidentForm({
            ...residentForm,
            [event.target.name]: event.target.value
        });
    };

    const handleResidentSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            if (editingResident) {

                await updateResident(
                    editingResident.id,
                    residentForm
                );

                showMessage(
                    "Residente actualizado correctamente."
                );

            } else {

                await createResident(residentForm);

                showMessage(
                    "Residente registrado correctamente."
                );
            }

            closeResidentModal();

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                "No se pudo guardar la información del residente."
            );
        }
    };

    const handleDeleteResident = async (resident) => {

        const confirmed = window.confirm(
            `¿Deseas eliminar al residente ${resident.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteResident(resident.id);

            showMessage(
                "Residente eliminado correctamente."
            );

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                "No se pudo eliminar el residente."
            );
        }
    };

    // =========================================================
    // FILTRO DE RESIDENTES
    // =========================================================

    const filteredResidents = useMemo(() => {

        const text = search.toLowerCase().trim();

        if (!text) {
            return residents;
        }

        return residents.filter((resident) =>
            String(resident.id)
                .toLowerCase()
                .includes(text) ||

            (resident.name || "")
                .toLowerCase()
                .includes(text) ||

            (resident.documentNumber || "")
                .toLowerCase()
                .includes(text) ||

            (resident.apartment || "")
                .toLowerCase()
                .includes(text)
        );

    }, [residents, search]);

    // =========================================================
    // ACCESOS
    // =========================================================

    const handleAccessChange = (event) => {

        setAccessForm({
            ...accessForm,
            [event.target.name]: event.target.value
        });
    };

    const handleAccessSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            await createAccess({
                residentId: Number(accessForm.residentId),
                accessType: accessForm.accessType,
                status: accessForm.status
            });

            setAccessForm({
                residentId: "",
                accessType: "FACIAL",
                status: "AUTHORIZED"
            });

            showMessage(
                "Registro de acceso creado correctamente."
            );

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                "No se pudo registrar el acceso."
            );
        }
    };

    // =========================================================
    // FILTRO DE ACCESOS
    // =========================================================

    const filteredAccessRecords = useMemo(() => {

        return accessRecords.filter((access) => {

            const methodMatches =
                accessMethodFilter === "ALL" ||
                access.accessType === accessMethodFilter;

            const statusMatches =
                accessStatusFilter === "ALL" ||
                access.status === accessStatusFilter;

            return methodMatches && statusMatches;
        });

    }, [
        accessRecords,
        accessMethodFilter,
        accessStatusFilter
    ]);

    // =========================================================
    // MÉTRICAS
    // =========================================================

    const totalResidents = residents.length;

    const activeResidents = residents.filter(
        (resident) =>
            resident.status === "ACTIVE"
    ).length;

    const totalAccesses = accessRecords.length;

    const authorizedAccesses = accessRecords.filter(
        (access) =>
            access.status === "AUTHORIZED"
    ).length;

    const deniedAccesses = accessRecords.filter(
        (access) =>
            access.status === "DENIED"
    ).length;

    // =========================================================
    // UTILIDADES
    // =========================================================

    const getResidentName = (residentId) => {

        const resident = residents.find(
            (item) => item.id === residentId
        );

        return resident
            ? resident.name
            : `Residente #${residentId}`;
    };

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "es-PE",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );
    };

    const getAccessTypeLabel = (type) => {

        const labels = {
            FACIAL: "Facial",
            RFID: "RFID",
            FINGERPRINT: "Huella"
        };

        return labels[type] || type;
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="app">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="topbar">

                <div>

                    <h1>SmartAccess</h1>

                    <p>
                        Gestión inteligente de accesos residenciales
                    </p>

                </div>

                <div className="system-status">

                    <span className="status-dot"></span>

                    Sistema operativo

                </div>

            </header>


            <main className="container">

                {/* =================================================
                    MENSAJES
                ================================================= */}

                {message && (

                    <div className="alert success">

                        ✓ {message}

                    </div>

                )}

                {error && (

                    <div className="alert error">

                        ⚠ {error}

                    </div>

                )}


                {/* =================================================
                    MÉTRICAS
                ================================================= */}

                <section className="metrics">

                    <div className="metric-card">

                        <div className="metric-icon">
                            👥
                        </div>

                        <div>

                            <span>
                                Residentes
                            </span>

                            <strong>
                                {totalResidents}
                            </strong>

                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-icon">
                            ✓
                        </div>

                        <div>

                            <span>
                                Residentes activos
                            </span>

                            <strong>
                                {activeResidents}
                            </strong>

                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-icon">
                            🚪
                        </div>

                        <div>

                            <span>
                                Total de accesos
                            </span>

                            <strong>
                                {totalAccesses}
                            </strong>

                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-icon">
                            🔓
                        </div>

                        <div>

                            <span>
                                Autorizados
                            </span>

                            <strong>
                                {authorizedAccesses}
                            </strong>

                        </div>

                    </div>


                    <div className="metric-card">

                        <div className="metric-icon">
                            🔒
                        </div>

                        <div>

                            <span>
                                Denegados
                            </span>

                            <strong>
                                {deniedAccesses}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    RESIDENTES
                ================================================= */}

                <section className="card">

                    <div className="section-header">

                        <div>

                            <h2>Residentes</h2>

                            <p>
                                Administración de residentes
                                del condominio
                            </p>

                        </div>

                        <button
                            className="primary-button"
                            onClick={openCreateResident}
                        >
                            + Nuevo residente
                        </button>

                    </div>


                    <div className="toolbar">

                        <input
                            className="search-input"
                            placeholder="Buscar por nombre, documento, departamento..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        <button
                            className="secondary-button"
                            onClick={loadData}
                        >
                            ↻ Actualizar
                        </button>

                    </div>


                    {loading ? (

                        <div className="empty">
                            Cargando residentes...
                        </div>

                    ) : filteredResidents.length === 0 ? (

                        <div className="empty">

                            No se encontraron residentes.

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Documento</th>
                                        <th>Departamento</th>
                                        <th>Email</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredResidents.map(
                                        (resident) => (

                                            <tr
                                                key={resident.id}
                                            >

                                                <td>
                                                    #{resident.id}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            resident.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        resident.documentNumber
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        resident.apartment
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        resident.email
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            resident.status ===
                                                            "ACTIVE"
                                                                ? "badge active"
                                                                : "badge inactive"
                                                        }
                                                    >
                                                        {
                                                            resident.status
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="actions">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                openEditResident(
                                                                    resident
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDeleteResident(
                                                                    resident
                                                                )
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* =================================================
                    REGISTRAR ACCESO
                ================================================= */}

                <section className="card">

                    <div className="section-header">

                        <div>

                            <h2>Registrar acceso</h2>

                            <p>
                                Registrar un evento de acceso
                                al condominio
                            </p>

                        </div>

                    </div>


                    <form
                        className="access-form"
                        onSubmit={handleAccessSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Residente
                            </label>

                            <select
                                name="residentId"
                                value={accessForm.residentId}
                                onChange={handleAccessChange}
                                required
                            >

                                <option value="">
                                    Seleccionar residente
                                </option>

                                {residents.map(
                                    (resident) => (

                                        <option
                                            key={resident.id}
                                            value={resident.id}
                                        >
                                            {resident.name}
                                            {" - Dpto. "}
                                            {resident.apartment}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Método de acceso
                            </label>

                            <select
                                name="accessType"
                                value={accessForm.accessType}
                                onChange={handleAccessChange}
                            >

                                <option value="FACIAL">
                                    Reconocimiento facial
                                </option>

                                <option value="RFID">
                                    RFID
                                </option>

                                <option value="FINGERPRINT">
                                    Huella digital
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Resultado
                            </label>

                            <select
                                name="status"
                                value={accessForm.status}
                                onChange={handleAccessChange}
                            >

                                <option value="AUTHORIZED">
                                    Autorizado
                                </option>

                                <option value="DENIED">
                                    Denegado
                                </option>

                            </select>

                        </div>


                        <div className="form-group button-group">

                            <label>
                                &nbsp;
                            </label>

                            <button
                                className="primary-button"
                                type="submit"
                            >
                                Registrar acceso
                            </button>

                        </div>

                    </form>

                </section>


                {/* =================================================
                    HISTORIAL
                ================================================= */}

                <section className="card">

                    <div className="section-header">

                        <div>

                            <h2>
                                Historial de accesos
                            </h2>

                            <p>
                                Registro de eventos de acceso
                            </p>

                        </div>

                    </div>


                    <div className="filters">

                        <div>

                            <label>
                                Método
                            </label>

                            <select
                                value={accessMethodFilter}
                                onChange={(event) =>
                                    setAccessMethodFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    Todos
                                </option>

                                <option value="FACIAL">
                                    Facial
                                </option>

                                <option value="RFID">
                                    RFID
                                </option>

                                <option value="FINGERPRINT">
                                    Huella
                                </option>

                            </select>

                        </div>


                        <div>

                            <label>
                                Estado
                            </label>

                            <select
                                value={accessStatusFilter}
                                onChange={(event) =>
                                    setAccessStatusFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="ALL">
                                    Todos
                                </option>

                                <option value="AUTHORIZED">
                                    Autorizados
                                </option>

                                <option value="DENIED">
                                    Denegados
                                </option>

                            </select>

                        </div>

                    </div>


                    {filteredAccessRecords.length === 0 ? (

                        <div className="empty">

                            No existen registros de acceso
                            para los filtros seleccionados.

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Residente</th>
                                        <th>Método</th>
                                        <th>Resultado</th>
                                        <th>Fecha y hora</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredAccessRecords.map(
                                        (access) => (

                                            <tr
                                                key={access.id}
                                            >

                                                <td>
                                                    #{access.id}
                                                </td>

                                                <td>

                                                    <strong>
                                                        {
                                                            getResidentName(
                                                                access.residentId
                                                            )
                                                        }
                                                    </strong>

                                                    <small>
                                                        ID: {
                                                            access.residentId
                                                        }
                                                    </small>

                                                </td>

                                                <td>

                                                    <span className="method">

                                                        {
                                                            getAccessTypeLabel(
                                                                access.accessType
                                                            )
                                                        }

                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            access.status ===
                                                            "AUTHORIZED"
                                                                ? "badge authorized"
                                                                : "badge denied"
                                                        }
                                                    >
                                                        {
                                                            access.status ===
                                                            "AUTHORIZED"
                                                                ? "AUTORIZADO"
                                                                : "DENEGADO"
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        formatDate(
                                                            access.accessDate
                                                        )
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>


            {/* =====================================================
                MODAL RESIDENTE
            ===================================================== */}

            {showResidentModal && (

                <div
                    className="modal-overlay"
                    onClick={closeResidentModal}
                >

                    <div
                        className="modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingResident
                                        ? "Editar residente"
                                        : "Nuevo residente"}
                                </h2>

                                <p>
                                    {
                                        editingResident
                                            ? "Actualiza los datos del residente."
                                            : "Ingresa los datos del nuevo residente."
                                    }
                                </p>

                            </div>

                            <button
                                className="close-button"
                                onClick={closeResidentModal}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleResidentSubmit}
                        >

                            <div className="form-group">

                                <label>
                                    Nombre completo
                                </label>

                                <input
                                    name="name"
                                    value={residentForm.name}
                                    onChange={handleResidentChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Documento
                                </label>

                                <input
                                    name="documentNumber"
                                    value={
                                        residentForm.documentNumber
                                    }
                                    onChange={
                                        handleResidentChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Departamento
                                </label>

                                <input
                                    name="apartment"
                                    value={
                                        residentForm.apartment
                                    }
                                    onChange={
                                        handleResidentChange
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={residentForm.email}
                                    onChange={
                                        handleResidentChange
                                    }
                                    required
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeResidentModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    {editingResident
                                        ? "Guardar cambios"
                                        : "Registrar residente"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default App;