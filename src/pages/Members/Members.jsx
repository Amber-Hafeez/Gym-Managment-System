import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./Members.css";

const PLANS = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const STATUSES = ["Active", "Inactive", "Expired"];
const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  plan: "Monthly",
  status: "Active",
  join_date: new Date().toISOString().slice(0, 10),
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditingId(m.id);
    setForm({
      full_name: m.full_name || "",
      email: m.email || "",
      phone: m.phone || "",
      plan: m.plan,
      status: m.status,
      join_date: m.join_date,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) return setError("Full name is required.");
    setSaving(true);
    setError("");

    const payload = { ...form, full_name: form.full_name.trim() };
    const { error } = editingId
      ? await supabase.from("members").update(payload).eq("id", editingId)
      : await supabase.from("members").insert([payload]);

    setSaving(false);
    if (error) return setError(error.message);
    closeForm();
    fetchMembers();
  };

  const toggleStatus = async (m) => {
    const next = m.status === "Active" ? "Inactive" : "Active";
    const { error } = await supabase
      .from("members")
      .update({ status: next })
      .eq("id", m.id);
    if (error) setError(error.message);
    else
      setMembers((list) =>
        list.map((x) => (x.id === m.id ? { ...x, status: next } : x))
      );
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.full_name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.includes(q)
    );
  }, [members, search]);

  return (
    <div className="mem-page">
      <header className="mem-header">
        <div>
          <h1>Members</h1>
          <p>{members.length} total members</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Member
        </button>
      </header>

      <input
        className="mem-search"
        placeholder="Search by name, email or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && !showForm && <div className="mem-alert">{error}</div>}

      <div className="mem-card">
        {loading ? (
          <div className="mem-empty">Loading members...</div>
        ) : filtered.length === 0 ? (
          <div className="mem-empty">No members found.</div>
        ) : (
          <div className="mem-table-wrap">
            <table className="mem-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Plan</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="mem-name">
                        <span className="avatar">
                          {m.full_name?.charAt(0).toUpperCase()}
                        </span>
                        {m.full_name}
                      </div>
                    </td>
                    <td>
                      <div>{m.email || "—"}</div>
                      <small>{m.phone || ""}</small>
                    </td>
                    <td>{m.plan}</td>
                    <td>{m.join_date}</td>
                    <td>
                      <span className={`badge badge-${m.status.toLowerCase()}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="right">
                      <button
                        className="btn btn-ghost"
                        onClick={() => openEdit(m)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => toggleStatus(m)}
                      >
                        {m.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2>{editingId ? "Edit Member" : "Add New Member"}</h2>

            <label>Full Name *</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="John Doe"
            />

            <div className="row">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@mail.com"
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Plan</label>
                <select name="plan" value={form.plan} onChange={handleChange}>
                  {PLANS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <label>Join Date</label>
            <input
              type="date"
              name="join_date"
              value={form.join_date}
              onChange={handleChange}
            />

            {error && <div className="mem-alert">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Member"
                  : "Save Member"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}