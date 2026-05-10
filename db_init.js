db = db.getSiblingDB("complianceai");

// 1. Create Users Collection & Index
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.insertOne({
  email: "admin@complianceai.pro",
  password: "$2a$10$8.UnVuG9HHgffUDAlk8qnOn52wPrutjCuoSV6PyTySvpJ2IKgfryW", // password: password123
  fullName: "System Admin",
  companyName: "ComplianceAI",
  plan: "pro",
  status: "active",
  roles: ["USER", "ADMIN"],
  createdAt: new Date()
});

// 2. Create Websites Collection & Index
db.websites.createIndex({ "userId": 1, "url": 1 }, { unique: true });
db.websites.insertOne({
  userId: db.users.findOne({ email: "admin@complianceai.pro" })._id.toString(),
  url: "https://example.com",
  name: "Example Site",
  status: "active",
  complianceScore: 85,
  monitoringEnabled: true,
  scanFrequency: "daily",
  createdAt: new Date()
});

// 3. Create Alerts Collection
db.alerts.insertOne({
  userId: db.users.findOne({ email: "admin@complianceai.pro" })._id.toString(),
  type: "low_score",
  severity: "high",
  title: "Initial Setup Complete",
  message: "Welcome to ComplianceAI Pro database.",
  read: false,
  createdAt: new Date()
});

print("✅ Database complianceai initialized successfully!");
