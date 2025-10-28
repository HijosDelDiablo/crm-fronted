import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ChatBot from "./components/ChatBot";
import ClientsTable from "./components/ClientsTable";
import { getClients } from "./services/api";
import "./App.css";

export default function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  return (
    <div className="main-bg">
      <Container fluid className="py-5 px-4">
        <Row className="g-4 align-items-start">
          <Col md={4}>
            <Card className="chat-card shadow">
              <Card.Header className="chat-header">
                <h5 className="m-0">🤖 Asistente Virtual</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <ChatBot
                  clients={clients}
                  setClients={setClients}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="clients-card shadow">
              <Card.Header className="clients-header">
                <h5 className="m-0">👥 Lista de Clientes</h5>
              </Card.Header>
              <Card.Body>
                <ClientsTable
                  clients={clients}
                  setClients={setClients}
                  setSelectedClient={setSelectedClient}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
