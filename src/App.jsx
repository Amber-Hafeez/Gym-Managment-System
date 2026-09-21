import { useState } from "react";

function App() {
  const [active, setActive] = useState("Dashboard");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const emptyMember = {
    name: "",
    fatherName: "",
    phone: "",
    email: "",
    gender: "Male",
    dob: "",
    plan: "Basic",
    joiningDate: "",
    expiryDate: "",
    fee: "",
    paymentStatus: "Paid",
    status: "Active",
  };

  const [newMember, setNewMember] = useState(emptyMember);

  const menu = [
    { name: "Dashboard", icon: "▣" },
    { name: "Members", icon: "♙" },
    { name: "Trainers", icon: "✦" },
    { name: "Payments", icon: "₨" },
    { name: "Attendance", icon: "✓" },
  ];

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Ali Khan",
      fatherName: "Ahmed Khan",
      phone: "0300-1234567",
      email: "ali@example.com",
      gender: "Male",
      dob: "1998-05-12",
      plan: "Premium",
      joiningDate: "2026-08-20",
      expiryDate: "2026-09-20",
      fee: "5000",
      paymentStatus: "Paid",
      status: "Active",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      fatherName: "Aslam Ahmed",
      phone: "0312-7654321",
      email: "sara@example.com",
      gender: "Female",
      dob: "2000-02-18",
      plan: "Standard",
      joiningDate: "2026-09-01",
      expiryDate: "2026-10-01",
      fee: "3500",
      paymentStatus: "Paid",
      status: "Active",
    },
    {
      id: 3,
      name: "Hamza Malik",
      fatherName: "Javed Malik",
      phone: "0333-1112233",
      email: "hamza@example.com",
      gender: "Male",
      dob: "1995-11-10",
      plan: "Basic",
      joiningDate: "2026-07-10",
      expiryDate: "2026-08-10",
      fee: "2500",
      paymentStatus: "Pending",
      status: "Expired",
    },
    {
      id: 4,
      name: "Ayesha Noor",
      fatherName: "Imran Noor",
      phone: "0345-9876543",
      email: "ayesha@example.com",
      gender: "Female",
      dob: "1999-08-25",
      plan: "Premium",
      joiningDate: "2026-09-05",
      expiryDate: "2026-10-05",
      fee: "5000",
      paymentStatus: "Paid",
      status: "Active",
    },
  ]);

  const stats = [
    {
      title: "Total Members",
      value: members.length,
      change: "+12%",
      icon: "♙",
    },
    {
      title: "Active Members",
      value: members.filter((m) => m.status === "Active").length,
      change: "+8%",
      icon: "●",
    },
    {
      title: "Trainers",
      value: "12",
      change: "+2",
      icon: "✦",
    },
    {
      title: "Monthly Revenue",
      value: "Rs. 425K",
      change: "+15%",
      icon: "₨",
    },
  ];

  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.phone} ${member.email} ${member.plan}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSaveMember = () => {
    if (!newMember.name.trim()) {
      alert("Please enter member name");
      return;
    }

    if (!newMember.phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    if (editingId !== null) {
      setMembers(
        members.map((member) =>
          member.id === editingId
            ? { ...newMember, id: editingId }
            : member
        )
      );

      setEditingId(null);
    } else {
      setMembers([
        ...members,
        {
          ...newMember,
          id: Date.now(),
        },
      ]);
    }

    setNewMember(emptyMember);
    setShowMemberForm(false);
  };

  const handleEdit = (member) => {
    setNewMember({
      name: member.name,
      fatherName: member.fatherName,
      phone: member.phone,
      email: member.email,
      gender: member.gender,
      dob: member.dob,
      plan: member.plan,
      joiningDate: member.joiningDate,
      expiryDate: member.expiryDate,
      fee: member.fee,
      paymentStatus: member.paymentStatus,
      status: member.status,
    });

    setEditingId(member.id);
    setShowMemberForm(true);
    setActive("Members");
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (confirmDelete) {
      setMembers(members.filter((member) => member.id !== id));
    }
  };

  const updateField = (field, value) => {
    setNewMember({
      ...newMember,
      [field]: value,
    });
  };

  return (
    <div style={styles.app}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #070b0a;
        }

        button {
          font-family: inherit;
        }

        input, select {
          font-family: inherit;
        }

        .menu-button:hover {
          background: #18231f !important;
          transform: translateX(3px);
        }

        .add-button:hover {
          background: #b8ff00 !important;
          color: #071006 !important;
          transform: translateY(-2px);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: #a8f000 !important;
        }

        .table-row:hover {
          background: #111a17 !important;
        }

        .input-field:focus {
          border-color: #b8ff00 !important;
          outline: none;
        }

        .action-button:hover {
          opacity: 0.8;
        }
      `}</style>

      <div style={styles.layout}>

        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>F</div>

            <div>
              <div style={styles.logoText}>FitZone</div>
              <div style={styles.logoSub}>GYM MANAGEMENT</div>
            </div>
          </div>

          <div style={styles.menuTitle}>MAIN MENU</div>

          <nav style={styles.nav}>
            {menu.map((item) => (
              <button
                key={item.name}
                className="menu-button"
                onClick={() => {
                  setActive(item.name);

                  if (item.name !== "Members") {
                    setShowMemberForm(false);
                  }
                }}
                style={{
                  ...styles.menuButton,
                  ...(active === item.name
                    ? styles.menuButtonActive
                    : {}),
                }}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span>{item.name}</span>

                {active === item.name && (
                  <span style={styles.activeDot}></span>
                )}
              </button>
            ))}
          </nav>

          <div style={styles.sidebarBottom}>
            <div style={styles.motivation}>
              <div style={styles.fire}>⚡</div>

              <div>
                <strong>Stay Strong</strong>
                <p style={styles.motivationText}>
                  Keep pushing forward!
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={styles.main}>

          {/* HEADER */}
          <header style={styles.header}>
            <div>
              <div style={styles.breadcrumb}>
                FITZONE / {active.toUpperCase()}
              </div>

              <h1 style={styles.heading}>{active}</h1>

              <p style={styles.subtitle}>
                Manage your gym operations with ease.
              </p>
            </div>

            <button
              className="add-button"
              style={styles.addButton}
              onClick={() => {
                setActive("Members");
                setEditingId(null);
                setNewMember(emptyMember);
                setShowMemberForm(true);
              }}
            >
              <span style={{ fontSize: 20 }}>+</span>
              Add Member
            </button>
          </header>

          {/* ================= DASHBOARD ================= */}
          {active === "Dashboard" && (
            <>
              <section style={styles.statsGrid}>
                {stats.map((stat) => (
                  <div
                    className="stat-card"
                    key={stat.title}
                    style={styles.statCard}
                  >
                    <div style={styles.statTop}>
                      <div style={styles.statIcon}>
                        {stat.icon}
                      </div>

                      <span style={styles.change}>
                        {stat.change}
                      </span>
                    </div>

                    <div style={styles.statTitle}>
                      {stat.title}
                    </div>

                    <div style={styles.statValue}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </section>

              <section style={styles.contentGrid}>

                {/* RECENT MEMBERS */}
                <div style={styles.panel}>
                  <div style={styles.panelHeader}>
                    <div>
                      <h2 style={styles.panelTitle}>
                        Recent Members
                      </h2>

                      <p style={styles.panelSub}>
                        Latest registered gym members
                      </p>
                    </div>

                    <button
                      onClick={() => setActive("Members")}
                      style={styles.viewButton}
                    >
                      View All →
                    </button>
                  </div>

                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>MEMBER</th>
                          <th style={styles.th}>PLAN</th>
                          <th style={styles.th}>STATUS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {members.slice(-4).reverse().map((member) => (
                          <tr
                            className="table-row"
                            key={member.id}
                          >
                            <td style={styles.td}>
                              <div style={styles.memberCell}>
                                <div style={styles.avatar}>
                                  {member.name.charAt(0)}
                                </div>

                                <span>{member.name}</span>
                              </div>
                            </td>

                            <td style={styles.td}>
                              <span style={styles.plan}>
                                {member.plan}
                              </span>
                            </td>

                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.status,
                                  ...(member.status === "Active"
                                    ? styles.activeStatus
                                    : styles.expiredStatus),
                                }}
                              >
                                {member.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* GYM OVERVIEW */}
                <div style={styles.panel}>
                  <h2 style={styles.panelTitle}>
                    Gym Overview
                  </h2>

                  <p style={styles.panelSub}>
                    Today's quick statistics
                  </p>

                  <div style={styles.overviewList}>
                    <div style={styles.overviewItem}>
                      <span>Today's Attendance</span>
                      <strong>142</strong>
                    </div>

                    <div style={styles.overviewItem}>
                      <span>New Members</span>
                      <strong>08</strong>
                    </div>

                    <div style={styles.overviewItem}>
                      <span>Pending Payments</span>
                      <strong>
                        {members.filter(
                          (m) => m.paymentStatus === "Pending"
                        ).length}
                      </strong>
                    </div>

                    <div style={styles.overviewItem}>
                      <span>Active Trainers</span>
                      <strong>12</strong>
                    </div>
                  </div>

                  <div style={styles.progressBox}>
                    <div style={styles.progressHeader}>
                      <span>Monthly Target</span>
                      <strong>78%</strong>
                    </div>

                    <div style={styles.progressBackground}>
                      <div style={styles.progress}></div>
                    </div>
                  </div>
                </div>

              </section>
            </>
          )}

          {/* ================= MEMBERS ================= */}
          {active === "Members" && (
            <section>

              {/* MEMBER FORM */}
              {showMemberForm && (
                <div
                  style={{
                    ...styles.panel,
                    marginBottom: "22px",
                  }}
                >
                  <div style={styles.panelHeader}>
                    <div>
                      <h2 style={styles.panelTitle}>
                        {editingId !== null
                          ? "Edit Member"
                          : "Add New Member"}
                      </h2>

                      <p style={styles.panelSub}>
                        Enter complete member information
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowMemberForm(false);
                        setEditingId(null);
                        setNewMember(emptyMember);
                      }}
                      style={styles.closeButton}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={styles.formGrid}>

                    {/* FULL NAME */}
                    <div>
                      <label style={styles.label}>
                        Full Name *
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="text"
                        placeholder="Enter full name"
                        value={newMember.name}
                        onChange={(e) =>
                          updateField("name", e.target.value)
                        }
                      />
                    </div>

                    {/* FATHER NAME */}
                    <div>
                      <label style={styles.label}>
                        Father / Guardian Name
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="text"
                        placeholder="Enter father or guardian name"
                        value={newMember.fatherName}
                        onChange={(e) =>
                          updateField(
                            "fatherName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* PHONE */}
                    <div>
                      <label style={styles.label}>
                        Phone Number *
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="text"
                        placeholder="03XX-XXXXXXX"
                        value={newMember.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label style={styles.label}>
                        Email Address
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="email"
                        placeholder="member@email.com"
                        value={newMember.email}
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* GENDER */}
                    <div>
                      <label style={styles.label}>
                        Gender
                      </label>

                      <select
                        className="input-field"
                        style={styles.input}
                        value={newMember.gender}
                        onChange={(e) =>
                          updateField(
                            "gender",
                            e.target.value
                          )
                        }
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* DOB */}
                    <div>
                      <label style={styles.label}>
                        Date of Birth
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="date"
                        value={newMember.dob}
                        onChange={(e) =>
                          updateField(
                            "dob",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* PLAN */}
                    <div>
                      <label style={styles.label}>
                        Membership Plan *
                      </label>

                      <select
                        className="input-field"
                        style={styles.input}
                        value={newMember.plan}
                        onChange={(e) =>
                          updateField(
                            "plan",
                            e.target.value
                          )
                        }
                      >
                        <option>Basic</option>
                        <option>Standard</option>
                        <option>Premium</option>
                      </select>
                    </div>
                    {/* JOINING DATE */}
                    <div>
                      <label style={styles.label}>
                        Joining Date
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="date"
                        value={newMember.joiningDate}
                        onChange={(e) =>
                          updateField(
                            "joiningDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* EXPIRY DATE */}
                    <div>
                      <label style={styles.label}>
                        Membership Expiry
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="date"
                        value={newMember.expiryDate}
                        onChange={(e) =>
                          updateField(
                            "expiryDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* FEE */}
                    <div>
                      <label style={styles.label}>
                        Membership Fee (Rs.)
                      </label>

                      <input
                        className="input-field"
                        style={styles.input}
                        type="number"
                        placeholder="5000"
                        value={newMember.fee}
                        onChange={(e) =>
                          updateField(
                            "fee",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    {/* PAYMENT */}
                    <div>
                      <label style={styles.label}>
                        Payment Status
                      </label>

                      <select
                        className="input-field"
                        style={styles.input}
                        value={newMember.paymentStatus}
                        onChange={(e) =>
                          updateField(
                            "paymentStatus",
                            e.target.value
                          )
                        }
                      >
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Partial</option>
                      </select>
                    </div>

                    {/* MEMBER STATUS */}
                    <div>
                      <label style={styles.label}>
                        Member Status
                      </label>

                      <select
                        className="input-field"
                        style={styles.input}
                        value={newMember.status}
                        onChange={(e) =>
                          updateField(
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Expired</option>
                      </select>
                    </div>

                  </div>
                  <div style={styles.formButtons}>

                    <button
                      onClick={() => {
                        setShowMemberForm(false);
                        setEditingId(null);
                        setNewMember(emptyMember);
                      }}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>

                    <button
                      className="add-button"
                      style={styles.addButton}
                      onClick={handleSaveMember}
                    >
                      {editingId !== null
                        ? "✓ Update Member"
                        : "+ Save Member"}
                    </button>

                  </div>
                </div>
              )}{/* MEMBERS LIST */}
              <div style={styles.panel}>

                <div style={styles.panelHeader}>
                  <div>
                    <h2 style={styles.panelTitle}>
                      All Members
                    </h2>

                    <p style={styles.panelSub}>
                      Manage your gym members
                    </p>
                  </div>

                  {!showMemberForm && (
                    <button
                      className="add-button"
                      style={styles.addButton}
                      onClick={() => {
                        setEditingId(null);
                        setNewMember(emptyMember);
                        setShowMemberForm(true);
                      }}
                    >
                      + Add Member
                    </button>
                  )}
                </div>

                {/* SEARCH */}
                <div style={styles.searchBox}>
                  <span style={styles.searchIcon}>⌕</span>

                  <input
                    className="input-field"
                    style={styles.searchInput}
                    type="text"
                    placeholder="Search member by name, phone, email or plan..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

                <div style={styles.memberCount}>
                  Showing{" "}
                  <strong>{filteredMembers.length}</strong>{" "}
                  of{" "}
                  <strong>{members.length}</strong> members
                </div><div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>MEMBER</th>
                        <th style={styles.th}>PHONE</th>
                        <th style={styles.th}>PLAN</th>
                        <th style={styles.th}>FEE</th>
                        <th style={styles.th}>PAYMENT</th>
                        <th style={styles.th}>STATUS</th>
                        <th style={styles.th}>ACTION</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr
                          className="table-row"
                          key={member.id}
                        >
                          <td style={styles.td}>
                            <div style={styles.memberCell}>
                              <div style={styles.avatar}>
                                {member.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <div style={styles.memberName}>
                                  {member.name}
                                </div>

                                <div style={styles.memberEmail}>
                                  {member.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={styles.td}>
                            {member.phone}
                          </td>

                          <td style={styles.td}>
                            <span style={styles.plan}>
                              {member.plan}
                            </span>
                          </td>

                          <td style={styles.td}>
                            Rs. {member.fee || "0"}
                          </td><td style={styles.td}>
                            <span
                              style={{
                                ...styles.status,
                                ...(member.paymentStatus === "Paid"
                                  ? styles.activeStatus
                                  : styles.pendingStatus),
                              }}
                            >
                              {member.paymentStatus}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.status,
                                ...(member.status === "Active"
                                  ? styles.activeStatus
                                  : styles.expiredStatus),
                              }}
                            >
                              {member.status}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <div style={styles.actionButtons}>

                              <button
                                className="action-button"
                                style={styles.editButton}
                                onClick={() =>
                                  handleEdit(member)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="action-button"
                                style={styles.deleteButton}
                                onClick={() =>
                                  handleDelete(member.id)
                                }
                              >
                                Delete
                              </button>

                            </div>
                          </td>

                      </tr>
                      ))}{filteredMembers.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            style={styles.emptyTable}
                          >
                            No members found.
                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>

              </div>

            </section>
          )}

          {/* ================= OTHER SECTIONS ================= */}
          {active !== "Dashboard" &&
            active !== "Members" && (
              <section style={styles.sectionPage}>

                <div style={styles.bigIcon}>
                  {
                    menu.find(
                      (item) => item.name === active
                    )?.icon
                  }
                </div>

                <h2 style={styles.sectionTitle}>
                  {active}
                </h2>

                <p style={styles.sectionText}>
                  {active} management section is ready.
                </p>

                <button
                  className="add-button"
                  style={styles.addButton}
                  onClick={() => setActive("Dashboard")}
                >
                  ← Back to Dashboard
                </button>

              </section>
            )}{/* FOOTER */}
          <footer style={styles.footer}>
            <span>© 2026 FitZone</span>
            <span>Gym Management System</span>
          </footer>

        </main>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#070b0a",
    color: "#f4f7f5",
  },

  layout: {
    minHeight: "100vh",
    display: "flex",
  },

  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "#0c1210",
    borderRight: "1px solid #1c2924",
    padding: "28px 18px",
    display: "flex",
    flexDirection: "column",
  },logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 10px",
    marginBottom: "45px",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#b8ff00",
    color: "#081008",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "900",
  },

  logoText: {
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "-1px",
  },

  logoSub: {
    fontSize: "9px",
    color: "#81918a",
    letterSpacing: "2px",
    marginTop: "3px",
  },

  menuTitle: {
    color: "#64736d",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "2px",
    padding: "0 12px",
    marginBottom: "12px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  menuButton: {
    position: "relative",
    border: "none",
    color: "#a9b5b0",
    background: "transparent",
    padding: "13px 14px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
    transition: "0.2s",
  },

  menuButtonActive: {
    background: "#17231e",
    color: "#c5ff21",
    boxShadow: "inset 3px 0 0 #b8ff00",
  },

  menuIcon: {
    width: "20px",
    textAlign: "center",
    fontSize: "17px",
  },

  activeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#b8ff00",
    marginLeft: "auto",
  },sidebarBottom: {
    marginTop: "auto",
  },

  motivation: {
    background: "#111a16",
    border: "1px solid #25332d",
    borderRadius: "14px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  fire: {
    fontSize: "25px",
  },

  motivationText: {
    margin: "4px 0 0",
    color: "#718078",
  },

  main: {
    flex: 1,
    padding: "35px 42px",
    overflow: "auto",
    background:
      "radial-gradient(circle at 85% 10%, rgba(184,255,0,0.07), transparent 28%), #070b0a",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
  },

  breadcrumb: {
    fontSize: "10px",
    color: "#6e7e76",
    letterSpacing: "2px",
    marginBottom: "7px",
  },

  heading: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#73817b",
    margin: "7px 0 0",
    fontSize: "14px",
  },addButton: {
    border: "none",
    borderRadius: "10px",
    background: "#b8ff00",
    color: "#0a1008",
    padding: "13px 19px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.2s",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#0e1512",
    border: "1px solid #1c2924",
    borderRadius: "15px",
    padding: "20px",
    transition: "0.2s",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  statIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#17231e",
    color: "#b8ff00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "18px",
  },change: {
    color: "#b8ff00",
    fontSize: "12px",
    fontWeight: "700",
  },

  statTitle: {
    color: "#829089",
    fontSize: "13px",
    marginBottom: "7px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "800",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.6fr) minmax(280px, 0.8fr)",
    gap: "22px",
  },

  panel: {
    background: "#0e1512",
    border: "1px solid #1c2924",
    borderRadius: "15px",
    padding: "22px",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "750",
  },

  panelSub: {
    margin: "5px 0 0",
    color: "#687770",
    fontSize: "12px",
  },viewButton: {
    background: "transparent",
    color: "#b8ff00",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    textAlign: "left",
    color: "#62716a",
    fontSize: "10px",
    letterSpacing: "1.5px",
    padding: "12px 8px",
    borderBottom: "1px solid #202d28",
  },

  td: {
    padding: "15px 8px",
    borderBottom: "1px solid #18231f",
    color: "#dbe2df",
    fontSize: "13px",
  },memberCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    minWidth: "180px",
  },

  memberName: {
    fontWeight: "600",
  },

  memberEmail: {
    color: "#65736d",
    fontSize: "10px",
    marginTop: "3px",
  },

  avatar: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "50%",
    background: "#25332d",
    color: "#b8ff00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  plan: {
    color: "#a8b4ae",
  },

  status: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  activeStatus: {
    background: "rgba(184,255,0,0.1)",
    color: "#b8ff00",
  },

  expiredStatus: {
    background: "rgba(255,80,80,0.1)",
    color: "#ff7777",
  },

  pendingStatus: {
    background: "rgba(255,180,0,0.1)",
    color: "#ffc14d",
  },overviewList: {
    marginTop: "22px",
  },

  overviewItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #1b2823",
    color: "#89968f",
    fontSize: "13px",
  },

  progressBox: {
    marginTop: "25px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#89968f",
    fontSize: "12px",
    marginBottom: "9px",
  },

  progressBackground: {
    height: "8px",
    borderRadius: "10px",
    background: "#202c27",
    overflow: "hidden",
  },

  progress: {
    width: "78%",
    height: "100%",
    background: "#b8ff00",
    borderRadius: "10px",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    color: "#89968f",
    fontSize: "20px",
    cursor: "pointer",
  },formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  label: {
    display: "block",
    color: "#89968f",
    fontSize: "12px",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px 13px",
    borderRadius: "9px",
    border: "1px solid #293730",
    background: "#111a17",
    color: "#f4f7f5",
    outline: "none",
    fontSize: "13px",
  },

  formButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelButton: {
    border: "1px solid #293730",
    borderRadius: "10px",
    background: "transparent",
    color: "#a9b5b0",
    padding: "13px 19px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    background: "#111a17",
    border: "1px solid #293730",
    borderRadius: "10px",
    padding: "0 13px",
  },

  searchIcon: {
    color: "#b8ff00",
    fontSize: "22px",
  },

  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    color: "#f4f7f5",
    padding: "13px 0",
    outline: "none",
    fontSize: "13px",
  },

  memberCount: {
    color: "#7c8a83",
    fontSize: "12px",
    marginBottom: "15px",
  },

  actionButtons: {
    display: "flex",
    gap: "6px",
  },

  editButton: {
    border: "1px solid #33443c",
    borderRadius: "7px",
    background: "#17231e",
    color: "#b8ff00",
    padding: "6px 9px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "700",
  },

  deleteButton: {
    border: "1px solid #4b2929",
    borderRadius: "7px",
    background: "rgba(255,80,80,0.08)",
    color: "#ff7777",
    padding: "6px 9px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "700",
  },

  emptyTable: {
    textAlign: "center",
    padding: "35px",
    color: "#697770",
  },

  sectionPage: {
    minHeight: "420px",
    background: "#0e1512",
    border: "1px solid #1c2924",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  bigIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background: "#17231e",
    color: "#b8ff00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "27px",
    margin: 0,
  },

  sectionText: {
    color: "#728078",
    margin: "10px 0 25px",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    color: "#4f5d56",
    fontSize: "11px",
    marginTop: "30px",
    padding: "0 4px",
  },
};

export default App;
