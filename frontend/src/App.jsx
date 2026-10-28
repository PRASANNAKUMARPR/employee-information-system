
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:5000/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    salary: ""
  });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  async function loadEmployees() {
    const response = await fetch(API);
    setEmployees(await response.json());
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      ...form,
      salary: Number(form.salary)
    };

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      alert("Unable to save employee");
      return;
    }

    setForm({ name: "", department: "", designation: "", salary: "" });
    setEditId(null);
    loadEmployees();
  }

  async function deleteEmployee(id) {
    if (!window.confirm("Delete this employee?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadEmployees();
  }

  function editEmployee(employee) {
    setEditId(employee.id);
    setForm({
      name: employee.name || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary ?? ""
    });
  }

  const filteredEmployees = employees.filter(employee =>
    `${employee.id} ${employee.name} ${employee.department} ${employee.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Employee Information System</h1>

      <div className="card p-4 mb-4 shadow-sm">
        <h4>{editId ? "Update Employee" : "Add Employee"}</h4>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {[
              ["name", "Employee Name"],
              ["department", "Department"],
              ["designation", "Designation"],
              ["salary", "Salary"]
            ].map(([field, label]) => (
              <div className="col-md-6" key={field}>
                <input
                  className="form-control"
                  name={field}
                  placeholder={label}
                  type={field === "salary" ? "number" : "text"}
                  min={field === "salary" ? "0" : undefined}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <button className="btn btn-primary mt-3" type="submit">
            {editId ? "Update Employee" : "Add Employee"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-secondary mt-3 ms-2"
              onClick={() => {
                setEditId(null);
                setForm({
                  name: "",
                  department: "",
                  designation: "",
                  salary: ""
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search by ID, name, department..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>{employee.salary}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editEmployee(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
