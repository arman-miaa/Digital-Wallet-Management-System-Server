

```markdown
# 💳 Digital Wallet Management System - Backend

A **secure, modular, and scalable backend API** for managing digital wallet operations, built with **Node.js, Express, TypeScript, and MongoDB**. Supports **role-based access control** for Admin, Agent, and User roles.

---

## 🎯 Project Overview

This project simulates a **digital wallet system** similar to Bkash or Nagad. Users can register, manage wallets, and perform core financial operations such as:

- Add money (top-up)
- Withdraw money
- Transfer money to another user

Agents can manage user wallets and track commissions, while admins have full control over the system.

**Core Features:**

- 🔐 JWT & Session-based Authentication  
- 🎭 Role-based Authorization (Admin, User, Agent)  
- 🏦 Wallet Management & Transaction Logic  
- 🧱 Modular, clean code architecture  
- 🔁 RESTful API endpoints with proper validations  

---

## 📌 Minimum Functional Requirements

- Users and Agents get wallets automatically upon registration (e.g., initial balance ৳50)  
- Users can: Add money, Withdraw, Transfer, View transaction history  
- Agents can: Cash-in (add money to user), Cash-out (withdraw from user), View commission history  
- Admins can: View and manage all users, agents, wallets, transactions, approve/suspend agents  
- All transactions are tracked and auditable  
- Role-based route protection enforced  

---

## 🧠 Design Considerations

### Wallet Management
- Wallets are created automatically on registration.  
- Only admins can block/unblock wallets.  
- Users cannot operate on blocked wallets.  

### Transactions
- Track type, amount, fee, commission, and initiator.  
- Ensure atomic balance updates and transaction logging.  

### Role Representation
- Single User model with a role field.  
- Admin, User, Agent have specific access and permissions.  
- Optional: Agent approval workflow and commission rates.  

### Validations & Business Rules
- Insufficient balance, negative amounts, non-existent receivers are validated.  
- Role-based restrictions are strictly enforced.  

---

## 🧩 API Endpoints

### User Routes
| Method | Endpoint          | Access | Description            |
|--------|-----------------|--------|-----------------------|
| POST   | /user/register  | Public | Register new user      |
| PATCH  | /user/update    | Admin  | Update user details    |
| GET    | /user/all-users | Admin  | Get all users          |
| GET    | /user/all-agents| Admin  | Get all agents         |

### Wallet Routes
| Method | Endpoint               | Access      | Description               |
|--------|-----------------------|------------|---------------------------|
| POST   | /wallet/add            | Agent      | Add money to user wallet  |
| POST   | /wallet/withdraw       | User       | Withdraw from wallet      |
| POST   | /wallet/transfer-money | User       | Transfer to another user  |
| GET    | /wallet/all-wallet     | Admin      | View all wallets          |
| GET    | /wallet/my-wallet      | User/Agent | View own wallet           |
| PATCH  | /wallet/:id            | Admin      | Update wallet info        |

### Transaction Routes
| Method | Endpoint                  | Access | Description              |
|--------|---------------------------|--------|--------------------------|
| GET    | /trans/all-transactions    | Admin  | All system transactions  |
| GET    | /trans/your-transactions   | User   | Own transaction history  |

### Commission Routes
| Method | Endpoint             | Access | Description            |
|--------|--------------------|--------|-----------------------|
| GET    | /com/all-agent-com  | Admin  | All agents’ commissions|
| GET    | /com/agent-com      | Agent  | My commission earnings |

---

## 📁 Project Structure

```

src/
├── modules/
│   ├── auth/          # Authentication logic
│   ├── user/          # User controllers & services
│   ├── wallet/        # Wallet operations
│   ├── transaction/   # Transaction handling
│   └── commission/    # Commission system
├── middlewares/       # Custom middleware
├── config/            # Configuration files
├── utils/             # Utility functions
└── server.ts          # Server entry point

```

---

## 🧪 Testing & Documentation

- Use **Postman** to test API endpoints.  
- Provide professional **README** with setup instructions.  
- Optional: 5–10 minute demo video showing authentication, user, agent, and admin operations.

---

## 🌐 Live Project

[https://digital-wallet-management-system-se.vercel.app/](https://digital-wallet-management-system-se.vercel.app/)

---

Made with ❤️ by Arman Mia
```

---


