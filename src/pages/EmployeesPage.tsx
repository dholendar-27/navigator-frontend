import React, { useMemo, useState } from "react";
import { Plus, Download, Upload, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MOCK_EMPLOYEES, type Employee } from "@/data/mockEmployees";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmptyState from "@/components/employees/EmptyState";
import AddEmployeeDrawer from "@/components/employees/AddEmployeeDrawer";
import EmployeeDetailsDrawer from "@/components/employees/EmployeeDrawer";
import FilterDropdown from "@/components/FilterDropdown";

export type Filters = {
    status: Employee["status"] | "";
    role: string;
    category: string;
    creator: string;
};

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>(
        MOCK_EMPLOYEES
    );

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [detailDrawerOpen, setDetailDrawerOpen] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [search, setSearch] = useState<string>("");

    const [filters, setFilters] = useState<Filters>({
        status: "",
        role: "",
        category: "",
        creator: "",
    });

    const isEmpty = employees.length === 0;

    const filteredEmployees = useMemo(() => {
        const query = search.toLowerCase();
        const { status, role, category, creator } = filters;

        return employees.filter((emp) => {
            // Filters (check first as they're faster)
            if (status && emp.status !== status) return false;
            if (role && emp.role !== role) return false;
            if (category && emp.category !== category) return false;
            if (creator && emp.createdBy !== creator) return false;

            // Search
            if (query) {
                const searchableText = `${emp.name} ${emp.id} ${emp.role} ${emp.category} ${emp.createdBy}`.toLowerCase();
                if (!searchableText.includes(query)) return false;
            }

            return true;
        });
    }, [employees, search, filters.status, filters.role, filters.category, filters.creator]);

    const isNoResults = !isEmpty && filteredEmployees.length === 0;

    const handleAddEmployee = (newEmp: any, invite: boolean) => {
        const createdId =
            newEmp.id || `EMP-${Date.now()}`;

        const employee: Employee = {
            ...newEmp,
            id: createdId,
            name: newEmp.name,
            role: newEmp.role,
            category: newEmp.category || "",
            kbFiles: null,
            simpleInteraction: null,
            complexInteraction: null,
            status: "online",
            email: newEmp.email || `${newEmp.name.toLowerCase().replace(" ", ".")}@example.com`,
            createdBy: "William Jones",
            createdDate: "28 April 2026",
            avatar: newEmp.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop",
        };

        setEmployees((prev) => [employee, ...prev]);

        toast.success(invite ? "Employee saved & invited" : "Employee saved");
        setDrawerOpen(false);
    };

    const handleDeleteEmployee = (id: string) => {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        toast.success("Employee deleted");
    };

    const handleClearAll = () => {
        setEmployees([]);
        toast("All employees cleared — empty state shown");
    };

    const handleResetData = () => {
        setEmployees(MOCK_EMPLOYEES as Employee[]);
        toast("Mock data restored");
    };

    return (
        <div className="px-8 py-6" data-testid="employees-page">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Employees
                    </h1>

                    {!isEmpty && (
                        <Badge className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                            {employees.length}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isEmpty ? (
                        <Button size="sm" variant="ghost" onClick={handleResetData}>
                            Restore demo data
                        </Button>
                    ) : (
                        <Button size="sm" variant="ghost" onClick={handleClearAll}>
                            Clear all
                        </Button>
                    )}

                    <Button variant="outline" onClick={() => toast("Refreshed")}>
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Add
                </Button>

                <Button variant="outline">
                    <Download className="h-4 w-4" />
                    Import
                </Button>

                <Button variant="outline">
                    <Upload className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Search */}
            <div className="relative mt-5">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search Employee Name, ID, Role..."
                    className="pl-11"
                />
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
                <FilterDropdown
                    label="Status"
                    value={filters.status}
                    options={["online", "away", "offline"]}
                    onChange={(v: any) =>
                        setFilters((f) => ({ ...f, status: v }))
                    }
                />

                <FilterDropdown
                    label="Role"
                    value={filters.role}
                    options={["Super Admin", "Admin", "Editor", "Member"]}
                    onChange={(v: string) =>
                        setFilters((f) => ({ ...f, role: v }))
                    }
                />

                <FilterDropdown
                    label="Category"
                    value={filters.category}
                    options={["Engineering", "Marketing", "Sales", "HR"]}
                    onChange={(v: string) =>
                        setFilters((f) => ({ ...f, category: v }))
                    }
                />

                <FilterDropdown
                    label="Creator"
                    value={filters.creator}
                    options={["William Jones", "Admin"]}
                    onChange={(v: string) =>
                        setFilters((f) => ({ ...f, creator: v }))
                    }
                />
            </div>

            {/* Body */}
            <div className="mt-5">
                {isEmpty ? (
                    <EmptyState />
                ) : isNoResults ? (
                    <div className="py-10 text-center text-sm text-zinc-500">
                        No employees match your search or filters.
                    </div>
                ) : (
                    <EmployeeTable
                        employees={filteredEmployees}
                        onDelete={handleDeleteEmployee}
                        onView={(emp) => {
                            setSelectedEmployee(emp);
                            setDetailDrawerOpen(true);
                        }}
                    />
                )}
            </div>

            <AddEmployeeDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onSubmit={handleAddEmployee}
                nextEmployeeId={`EMP-${Date.now()}`}
            />

            <EmployeeDetailsDrawer
                open={detailDrawerOpen}
                onOpenChange={setDetailDrawerOpen}
                employee={selectedEmployee}
            />
        </div>
    );
}