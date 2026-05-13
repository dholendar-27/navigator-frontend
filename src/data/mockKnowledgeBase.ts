// Define a type for knowledge base entry input
type EntryType = "folder" | "file" | "url";

interface Entry {
    name: string;
    type: EntryType;
    folder: string;
    owner: string;
}

// Mock knowledge base entries — used to demonstrate the populated state.
const ENTRIES: Entry[] = [
    { name: "HR Policies", type: "folder", folder: "Root", owner: "William Jones" },
    { name: "Onboarding Checklist", type: "file", folder: "HR Policies", owner: "Emma Johnson" },
    { name: "Engineering Handbook", type: "folder", folder: "Root", owner: "Oliver Roberts" },
    { name: "Cloud Architecture", type: "file", folder: "Engineering Handbook", owner: "Isabella Byrne" },
    { name: "Information Security Policy", type: "file", folder: "Engineering Handbook", owner: "Daniel Carter" },
    { name: "Customer Onboarding", type: "folder", folder: "Root", owner: "Ryan Mitchell" },
    { name: "Pricing FAQ", type: "url", folder: "Customer Onboarding", owner: "Sophia Turner" },
    { name: "Code of Conduct", type: "file", folder: "HR Policies", owner: "William Jones" },
];

export interface KnowledgeBaseItem extends Entry {
    id: string;
    createdDate: string;
}

export const MOCK_KB: KnowledgeBaseItem[] = ENTRIES.map((e, i) => ({
    id: `KB${String(i + 1).padStart(4, "0")}`,
    ...e,
    createdDate: "28 April 2026",
}));