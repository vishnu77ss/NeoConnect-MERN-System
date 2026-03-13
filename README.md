# 🏛️ NeoConnect - Internal Feedback & Grievance System

NeoConnect is a comprehensive full-stack solution designed for educational institutions to bridge the gap between staff and management. It streamlines the grievance process with automated tracking, institutional polling, and data-driven analytics.

## 📸 App Preview

### Management Dashboard & Analytics
![Management Dashboard](./screenshots/admin-dashboard.png)
*Real-time departmental analytics with automated red-flagging for hotspots.*

### Staff Submission Portal
![Staff View](./screenshots/staff-view.png)
*User-friendly submission form with anonymous reporting options.*

### Secure Authentication
![Login Page](./screenshots/login-register.png)
*Role-based access control for Staff, Secretariat, and Case Managers.*

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC):** Customized dashboards for Staff (Submitters), Secretariat (Assigners), and Case Managers (Resolvers).
* **Unique Case Tracking:** Automated generation of tracking IDs in the format `NEO-YYYY-001`.
* **7-Day Escalation Logic:** Backend monitoring that automatically flags cases as "Escalated" if they remain unaddressed for over 7 days.
* **Visual Analytics & Hotspots:** Integrated bar charts that automatically highlight any department with 5+ active cases in **Red**.
* **Secure Institutional Polling:** A one-vote-per-user polling system with real-time visual results via progress bars.
* **Anonymity Support:** Optional anonymous reporting to encourage honest feedback while maintaining user privacy.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn UI, Recharts.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB via Mongoose ODM.
* **Security:** JWT (JSON Web Tokens) for session management and Bcrypt for password encryption.

---
## 🔐 Test Credentials

To explore the different role-based dashboards without registering multiple accounts, you can use these pre-configured credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin/Secretariat** | `admin@test.com` | `admin` | Full Analytics, Case Management, Hotspot Tracking |
| **Staff** | (Register a new account) | (Your choice) | Case Submission, Anonymous Reporting, Polling |

> **Note:** New registrations default to the **Staff** role to ensure system security.


## ⚙️ Setup Instructions
1. **Clone the repository.**
2. **Backend:**
   - `cd backend`
   - `npm install`
   - Create a `.env` file with `MONGO_URI` and `JWT_SECRET`.
   - `node server.js`
3. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
   
## 📊 Business Logic Implementation

### 🔄 Case Lifecycle
The system strictly enforces a state-driven workflow to ensure accountability:

> **New** ➔ **Assigned** ➔ **In Progress** ➔ **Resolved** (or **Escalated**)

### 🚩 Hotspot Detection (High-Priority Alerting)
To help management prioritize resources, the system implements an automated "Hotspot" algorithm:
* **Logic:** The backend aggregates active cases grouped by `department`.
* **Threshold:** If $Count(Department) \ge 5$, the department is flagged.
* **UI Feedback:** The Recharts Bar Chart dynamically changes the bar color to **Red** (`#ef4444`) and triggers a "⚠️ Immediate Attention" warning in the Management Dashboard.

### ⏳ 7-Day Auto-Escalation
NeoConnect ensures no grievance is ignored through a time-based escalation trigger:
* **Trigger:** A daily cron-style check (or manual trigger) compares the `createdAt` timestamp with the current Date.
* **Condition:** $$(CurrentDate - CreatedDate) > 7 \text{ days} \text{ AND } Status = \text{'New'}$$
* **Result:** The system automatically updates the status to **'Escalated'**, moves the case to the top of the priority queue, and alerts the Secretariat.