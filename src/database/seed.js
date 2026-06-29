import bcrypt from "bcryptjs";
import config from "../config/index.js";

const users = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@gmail.com",
    password: "A!ice2026#",
  },
  {
    name: "Brian Smith",
    email: "brian.smith@gmail.com",
    password: "Br!an#84X",
  },
  {
    name: "Carla Martinez",
    email: "carla.martinez@gmail.com",
    password: "C@rla_91!",
  },
  {
    name: "David Wilson",
    email: "david.wilson@example.com",
    password: "D@vid#92X!",
  },
  {
    name: "Emma Brown",
    email: "emma.brown@example.com",
    password: "Emm@2026$",
  },
  {
    name: "Frank Lee",
    email: "frank.lee@example.com",
    password: "Fr@nk!88Q",
  },
  {
    name: "Grace Taylor",
    email: "grace.taylor@example.com",
    password: "Gr@ce#71Z",
  },
];

const teams = [
  {
    name: "Frontend Team",
    description:
      "Responsible for building and maintaining the user interface and client-side logic of the application.",
  },
  {
    name: "Backend Team",
    description:
      "Handles server-side logic, APIs, authentication, and database management.",
  },
  {
    name: "DevOps Team",
    description:
      "Manages infrastructure, CI/CD pipelines, deployment processes, and system reliability.",
  },
  {
    name: "QA Team",
    description:
      "Ensures product quality through automated and manual testing strategies.",
  },
  {
    name: "Design Team",
    description:
      "Focuses on UI/UX design, user research, and creating consistent design systems.",
  },
  {
    name: "Product Team",
    description:
      "Defines product vision, gathers requirements, and coordinates between technical and business stakeholders.",
  },
];

const teamMembers = [
  { team_id: 1, user_id: 1 },
  { team_id: 1, user_id: 2 },

  { team_id: 2, user_id: 3 },
  { team_id: 2, user_id: 4 },

  { team_id: 3, user_id: 5 },

  { team_id: 4, user_id: 6 },

  { team_id: 5, user_id: 7 },

  { team_id: 6, user_id: 1 },
  { team_id: 6, user_id: 3 },

  { team_id: 3, user_id: 2 },
  { team_id: 4, user_id: 5 },
  { team_id: 5, user_id: 4 },
  { team_id: 2, user_id: 7 },
];

const projects = [
  {
    name: "Website Redesign",
    status: "active",
    deadline: "2026-08-15",
    budget: 25000,
    team_member: 1,
    description:
      "Redesign the corporate website with a modern UI, improved accessibility, and responsive layouts.",
  },
  {
    name: "Mobile App Development",
    status: "on hold",
    deadline: "2026-10-01",
    budget: 80000,
    team_member: 2,
    description:
      "Develop a cross-platform mobile application for customer engagement and account management.",
  },
  {
    name: "CRM Migration",
    status: "completed",
    deadline: "2026-04-30",
    budget: 45000,
    team_member: 3,
    description:
      "Migrate customer records and workflows to the new CRM platform with minimal downtime.",
  },
  {
    name: "Marketing Campaign",
    status: "active",
    deadline: "2026-09-10",
    budget: 18000,
    team_member: 2,
    description:
      "Launch a digital marketing campaign targeting new customers across multiple social media platforms.",
  },
  {
    name: "Cloud Infrastructure Upgrade",
    status: "completed",
    deadline: "2026-03-20",
    budget: 120000,
    team_member: 1,
    description:
      "Upgrade cloud infrastructure to improve scalability, reliability, and security.",
  },
  {
    name: "Data Warehouse Implementation",
    status: "on hold",
    deadline: "2026-11-15",
    budget: 95000,
    team_member: 3,
    description:
      "Implement a centralized data warehouse to support business intelligence and reporting.",
  },
  {
    name: "Employee Training Program",
    status: "active",
    deadline: "2026-07-31",
    budget: 12000,
    team_member: 1,
    description:
      "Deliver training sessions on new internal tools and cybersecurity best practices.",
  },
  {
    name: "API Integration",
    status: "completed",
    deadline: "2026-05-18",
    budget: 30000,
    team_member: 2,
    description:
      "Integrate third-party payment and notification APIs into the existing platform.",
  },
  {
    name: "Inventory Management System",
    status: "active",
    deadline: "2026-12-05",
    budget: 67000,
    team_member: 3,
    description:
      "Develop a new inventory management system with real-time stock tracking and reporting.",
  },
  {
    name: "Customer Feedback Portal",
    status: "on hold",
    deadline: "2026-09-25",
    budget: 22000,
    team_member: 2,
    description:
      "Create an online portal for collecting, managing, and analyzing customer feedback.",
  },
  {
    name: "AI Chatbot Integration",
    status: "active",
    deadline: "2026-10-20",
    budget: 55000,
    team_member: 4,
    description:
      "Integrate an AI-powered chatbot into the customer support platform.",
  },
  {
    name: "Cybersecurity Audit",
    status: "completed",
    deadline: "2026-06-15",
    budget: 28000,
    team_member: 5,
    description:
      "Conduct a comprehensive security assessment and remediate identified vulnerabilities.",
  },
  {
    name: "E-commerce Platform Upgrade",
    status: "on hold",
    deadline: "2026-11-30",
    budget: 76000,
    team_member: 6,
    description:
      "Upgrade the online shopping platform with enhanced search, checkout, and analytics features.",
  },
  {
    name: "Business Intelligence Dashboard",
    status: "active",
    deadline: "2026-09-18",
    budget: 41000,
    team_member: 5,
    description:
      "Build executive dashboards to visualize KPIs and operational metrics.",
  },
  {
    name: "Document Management System",
    status: "completed",
    deadline: "2026-05-28",
    budget: 36000,
    team_member: 4,
    description:
      "Implement a centralized document repository with version control and access permissions.",
  },
];

const seedUsers = async () => {
  console.log("Seeding users...");
  for (const user of users) {
    const hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
    const { data, error } = await config.supabase
      .from("users")
      .insert(user)
      .select();
    if (error) console.error(`Failed user: ${user.name}`);
    else console.log(`Created user: ${user.name}`);
  }
};

const seedTeams = async () => {
  console.log("Seeding teams...");
  for (const team of teams) {
    const { data, error } = await config.supabase
      .from("teams")
      .insert(team)
      .select();
    if (error) console.error(`Failed team: ${team.name}`);
    else console.log(`Created team: ${team.name}`);
  }
};

const seedTeamMembers = async () => {
  console.log("Seeding team members...");
  for (const member of teamMembers) {
    const { data, error } = await config.supabase
      .from("team_members")
      .insert(member)
      .select();
    if (error)
      console.error(
        `Failed membership: (team=${member.team_id}, user=${member.user_id})`,
      );
    else
      console.log(
        `Created membership: (team=${member.team_id}, user=${member.user_id})`,
      );
  }
};

const seedProjects = async () => {
  console.log("Seeding projects...");
  for (const project of projects) {
    const { data, error } = await config.supabase
      .from("projects")
      .insert(project)
      .select();
    if (error) console.error(`Failed project: ${project.name}`);
    else console.log(`Created project: ${project.name}`);
  }
};

const main = async () => {
  await seedUsers();
  await seedTeams();
  await seedTeamMembers();
  await seedProjects();
  console.log("Seeding completed!");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
