import { Table, Button } from "react-bootstrap";

export default function ClientsTable({
  clients,
  setSelectedClient,
  setClients,
}) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.name}</td>
            <td>{c.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
