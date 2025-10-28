import { useState } from "react";
import { Button, Form, Modal, Spinner, Card } from "react-bootstrap";
import { addClient, updateClient, deleteClient } from "../services/api";

export default function ChatBot({ clients, setClients }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "🤖 ¡Hola! Soy tu asistente de clientes. Escribe: agregar, editar, eliminar o ver." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);



  
  // Modales controlados
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);

  // Datos de formulario
  const [formClient, setFormClient] = useState({ id: "", name: "", email: "" });

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const lower = input.toLowerCase();
    setTimeout(() => {
      if (lower.includes("agregar")) {
        addBotMessage("🆕 Vamos a agregar un nuevo cliente.");
        setShowAdd(true);
      } else if (lower.includes("editar")) {
        addBotMessage("✏️ Selecciona el cliente que deseas editar.");
        setShowEdit(true);
      } else if (lower.includes("eliminar")) {
        addBotMessage("⚠️ Selecciona el cliente que deseas eliminar.");
        setShowDelete(true);
      } else if (lower.includes("ver") || lower.includes("mostrar")) {
        addBotMessage("👀 Aquí tienes la lista de clientes:");
        setShowView(true);
      } else {
        addBotMessage("❓ No entendí. Intenta: agregar, editar, eliminar o ver.");
      }
      setIsTyping(false);
    }, 700);
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  };

  // 🧩 Funciones CRUD
  const handleAdd = async () => {
    if (!formClient.name || !formClient.email) return;
    const newClient = await addClient(formClient);
    setClients([...clients, newClient]);
    addBotMessage(`✅ Cliente ${newClient.name} agregado correctamente.`);
    resetForm();
    setShowAdd(false);
  };

  const handleEdit = async () => {
    const id = formClient.id;
    const updated = await updateClient(id, { name: formClient.name, email: formClient.email });
    setClients(clients.map((c) => (c.id == id ? updated : c)));
    addBotMessage(`📝 Cliente ${updated.name} actualizado.`);
    resetForm();
    setShowEdit(false);
  };

  const handleDelete = async () => {
    const id = formClient.id;
    await deleteClient(id);
    setClients(clients.filter((c) => c.id != id));
    addBotMessage(`🗑️ Cliente eliminado correctamente.`);
    resetForm();
    setShowDelete(false);
  };

  const resetForm = () => setFormClient({ id: "", name: "", email: "" });

  return (
    <>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`bubble ${msg.from}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="bubble bot typing">
              <Spinner animation="grow" size="sm" /> <span>Escribiendo...</span>
            </div>
          )}
        </div>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Form.Control
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="primary" className="mt-2 w-100 fw-semibold">
            Enviar
          </Button>
        </Form>
      </div>

      {/* AGREGAR */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>➕ Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={formClient.name}
                onChange={(e) => setFormClient({ ...formClient, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={formClient.email}
                onChange={(e) => setFormClient({ ...formClient, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAdd}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDITAR */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            onChange={(e) => {
              const selected = clients.find((c) => c.id == e.target.value);
              if (selected) setFormClient(selected);
            }}
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          {formClient.id && (
            <>
              <Form.Group className="mt-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  value={formClient.name}
                  onChange={(e) => setFormClient({ ...formClient, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={formClient.email}
                  onChange={(e) => setFormClient({ ...formClient, email: e.target.value })}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleEdit} disabled={!formClient.id}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ELIMINAR */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🗑️ Eliminar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            onChange={(e) => {
              const selected = clients.find((c) => c.id == e.target.value);
              if (selected) setFormClient(selected);
            }}
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          {formClient.id && (
            <p className="mt-3 text-danger">
              ¿Seguro que deseas eliminar a <strong>{formClient.name}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={!formClient.id}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* VER CLIENTES */}
      <Modal show={showView} onHide={() => setShowView(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>👥 Lista de Clientes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-3">
            {clients.map((c) => (
              <Card key={c.id} className="p-2 flex-fill shadow-sm" style={{ minWidth: "220px" }}>
                <Card.Body>
                  <Card.Title>{c.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">ID: {c.id}</Card.Subtitle>
                  <Card.Text>Email: {c.email}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
