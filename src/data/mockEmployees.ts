// Mock employees data — used to demonstrate the populated state of the Employees page.
// Toggle to an empty list to demonstrate the empty state.

const ROLES = ["Super Admin", "Admin", "Editor", "Member"] as const;
const NAMES = [
  "Oliver Roberts", "Emma Johnson", "Jack Brown", "Isabella Byrne",
  "Elizabeth Taylor", "Daniel Carter", "Ryan Mitchell", "Sophia Turner",
  "Liam Walker", "Ava Hughes", "Noah Bennett", "Mia Reed",
  "Lucas Hayes", "Charlotte Foster", "Mason Cooper", "Amelia Price",
  "Logan Murphy", "Harper Bailey", "Ethan Ward", "Evelyn Cox",
  "James Rivera", "Abigail Bell", "Benjamin Gray", "Emily Watson",
  "Henry Brooks", "Scarlett Sanders", "Alexander Ross", "Aria Long",
  "Sebastian Diaz", "Layla Jenkins", "Jackson Perry", "Chloe Powell",
  "Aiden Russell", "Penelope Bailey", "Matthew Howard", "Riley Ward",
  "Samuel Gomez", "Zoe Rivera", "David Peterson", "Lily Morgan",
] as const;

const AVATAR_SEEDS = [
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
] as const;

const STATUSES = ["online", "online", "online", "away", "online"] as const;

type Role = typeof ROLES[number];
type Status = typeof STATUSES[number];

export interface Employee {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  status: Status;
  kbFiles: number | null;
  simpleInteraction: string | null;
  complexInteraction: string | null;
  email: string;
  createdBy: string;
  createdDate: string;
}

function pad(n: number, len: number = 6): string {
  return String(n).padStart(len, "0");
}

export function generateMockEmployees(count: number = 160): Employee[] {
  const list: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const name = NAMES[i % NAMES.length];
    const role = ROLES[i % ROLES.length];
    const hasData = i % 7 !== 2; // simulate missing data rows

    list.push({
      id: `EMP${pad(i + 100)}`,
      name,
      role,
      avatar: AVATAR_SEEDS[i % AVATAR_SEEDS.length],
      status: STATUSES[i % STATUSES.length],
      kbFiles: hasData ? Math.floor(Math.random() * 100) + 1 : null,
      simpleInteraction: hasData ? `$${Math.floor(Math.random() * 10) + 1}` : null,
      complexInteraction: hasData ? `$${Math.floor(Math.random() * 10) + 1}` : null,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      createdBy: "William Jones",
      createdDate: "28 April 2026",
    });
  }

  return list;
}

export const MOCK_EMPLOYEES: Employee[] = generateMockEmployees(160);