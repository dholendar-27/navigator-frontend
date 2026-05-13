import React, { useMemo, useState, useEffect } from "react";
import { Plus, Download, Upload, RefreshCw, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { type Employee } from "@/data/mockEmployees";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmptyState from "@/components/employees/EmptyState";
import AddEmployeeDrawer from "@/components/employees/AddEmployeeDrawer";
import EmployeeDetailsDrawer from "@/components/employees/EmployeeDrawer";
import FilterDropdown from "@/components/FilterDropdown";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { listEmployees, listInvites, resendInvite, revokeInvite, listRoles, deleteEmployee } from "@/lib/api";
import { cacheWebSocket } from "@/utils/cacheWebSocket";

export type Filters = {
    status: Employee["status"] | "";
    role: string;
    category: string;
    creator: string;
};

export default function EmployeesPage() {
    const { getToken, isAuthenticated } = useKindeAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            if (!token) {
                toast.error("Not authenticated");
                setIsLoading(false);
                return;
            }

            // Fetch active employee list, pending invites, and RBAC roles in parallel
            const [empData, inviteData, rolesData] = await Promise.all([
                listEmployees(token).catch(err => {
                    console.error("Error fetching employees:", err);
                    return { employees: [] };
                }),
                listInvites(token).catch(err => {
                    console.error("Error fetching invites:", err);
                    return [];
                }),
                listRoles(token).catch(err => {
                    console.error("Error fetching roles:", err);
                    return [];
                })
            ]);

            const employeeList = Array.isArray(empData) ? empData : ((empData as any)?.employees || []);
            const inviteList = Array.isArray(inviteData) ? inviteData : ((inviteData as any)?.invites || []);
            const rolesList = Array.isArray(rolesData) ? (rolesData as any) : [];

            const mappedEmployees: Employee[] = employeeList.map((emp: any) => {
                const firstName = emp.first_name || emp.given_name || "";
                const lastName = emp.last_name || emp.family_name || "";
                const fullName = emp.display_name || `${firstName} ${lastName}`.trim() || emp.name || emp.email?.split("@")[0] || "Unknown Employee";

                let rawRole = "member";
                if (emp.role && typeof emp.role === "object") {
                    rawRole = emp.role.name;
                } else if (emp.role && typeof emp.role === "string") {
                    rawRole = emp.role;
                } else if (emp.role_id) {
                    const foundRole = rolesList.find((r: any) => r.id === emp.role_id);
                    if (foundRole) {
                        rawRole = foundRole.name;
                    }
                }

                const roleName = rawRole === "super_admin"
                    ? "Super Admin"
                    : rawRole.charAt(0).toUpperCase() + rawRole.slice(1);

                return {
                    id: emp.id || `EMP-${Date.now()}`,
                    inviteId: emp.invite_id || emp.id,
                    name: fullName,
                    role: roleName,
                    category: emp.category || "-",
                    avatar: emp.avatar || "",
                    status: emp.status || (emp.is_active ? "online" : "offline"),
                    kbFiles: emp.kb_files !== undefined && emp.kb_files !== null ? emp.kb_files : "-",
                    simpleInteraction: emp.simple_interaction !== undefined && emp.simple_interaction !== null ? emp.simple_interaction : "-",
                    complexInteraction: emp.complex_interaction !== undefined && emp.complex_interaction !== null ? emp.complex_interaction : "-",
                    email: emp.email || "-",
                    createdBy: emp.created_by || emp.createdBy || "-",
                    createdDate: emp.created_at
                        ? new Date(emp.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                        : "-",
                    isActive: emp.is_active !== undefined ? !!emp.is_active : true,
                };
            });

            const mappedInvites: Employee[] = inviteList
                .filter((inv: any) => inv.status === "pending" || inv.status === "sent")
                .map((inv: any) => {
                    const firstName = inv.first_name || "";
                    const lastName = inv.last_name || "";
                    const fullName = `${firstName} ${lastName}`.trim() || inv.email?.split("@")[0] || "Invited Employee";

                    let rawRole = "member";
                    if (inv.role && typeof inv.role === "object") {
                        rawRole = inv.role.name;
                    } else if (inv.role && typeof inv.role === "string") {
                        rawRole = inv.role;
                    } else if (inv.role_id) {
                        const foundRole = rolesList.find((r: any) => r.id === inv.role_id);
                        if (foundRole) {
                            rawRole = foundRole.name;
                        }
                    }

                    const roleName = rawRole === "super_admin"
                        ? "Super Admin"
                        : rawRole.charAt(0).toUpperCase() + rawRole.slice(1);

                    return {
                        id: inv.id,
                        inviteId: inv.id,
                        name: fullName,
                        role: roleName,
                        category: "-",
                        avatar: "",
                        status: "offline",
                        kbFiles: "-",
                        simpleInteraction: "-",
                        complexInteraction: "-",
                        email: inv.email || "-",
                        createdBy: "-",
                        createdDate: inv.created_at
                            ? new Date(inv.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                            : "-",
                        isActive: false,
                    };
                });

            // Prevent duplicate emails across active employees and pending invites
            const activeEmails = new Set(mappedEmployees.map(e => e.email.toLowerCase()));
            const uniqueInvites = mappedInvites.filter(inv => !activeEmails.has(inv.email.toLowerCase()));

            setEmployees([...mappedEmployees, ...uniqueInvites]);
        } catch (error: any) {
            console.error("Fetch employees error:", error);
            toast.error(error.message || "Failed to load employees");
            setEmployees([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendInvite = async (inviteId: string) => {
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Not authenticated");
                return;
            }
            await resendInvite(inviteId, token);
            toast.success("Invitation resent successfully");
            fetchEmployees();
        } catch (error: any) {
            console.error("Resend invite error:", error);
            toast.error(error.message || "Failed to resend invite");
        }
    };

    const handleRevokeInvite = async (inviteId: string) => {
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Not authenticated");
                return;
            }
            await revokeInvite(inviteId, token);
            toast.success("Invitation revoked successfully");
            fetchEmployees();
        } catch (error: any) {
            console.error("Revoke invite error:", error);
            toast.error(error.message || "Failed to revoke invite");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchEmployees();

            const handleUserChange = () => {
                console.log("User changed by another user - refreshing...");
                fetchEmployees();
            };

            cacheWebSocket.on("user:added", handleUserChange);
            cacheWebSocket.on("user:updated", handleUserChange);
            cacheWebSocket.on("user:removed", handleUserChange);

            return () => {
                cacheWebSocket.off("user:added", handleUserChange);
                cacheWebSocket.off("user:updated", handleUserChange);
                cacheWebSocket.off("user:removed", handleUserChange);
            };
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

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
        // Trigger list refresh to load the newly invited user from the backend
        fetchEmployees();
        setDrawerOpen(false);
    };

    const handleDeleteEmployee = async (id: string) => {
        try {
            const token = await getToken();
            if (token) {
                await deleteEmployee(id, token);
            }
            toast.success("Employee deleted successfully");
            fetchEmployees();
        } catch (error: any) {
            console.error("Delete employee error:", error);
            toast.error(error.message || "Failed to delete employee");
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden" data-testid="employees-page">
            <div className="px-4 sm:px-8 py-6 flex flex-col h-full overflow-y-auto">
                {/* Header - Fixed */}
                <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        <Button variant="outline" className="w-full sm:w-auto" onClick={fetchEmployees} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Actions - Fixed */}
                <div className="mt-6 shrink-0 flex flex-wrap gap-3">
                    <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setDrawerOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>

                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <Download className="h-4 w-4" />
                        Import
                    </Button>

                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <Upload className="h-4 w-4" />
                        Export
                    </Button>
                </div>

                {/* Search - Fixed */}
                <div className="relative mt-5 shrink-0">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search employees by name or email..."
                        className="pl-11"
                    />
                </div>

                {/* Filters - Fixed */}
                <div className="mt-4 shrink-0 flex flex-wrap gap-2">
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

                {/* Body - Pinned Layout */}
                <div className="mt-6 flex-1 flex flex-col min-h-0">
                    {isLoading ? (
                        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white flex flex-col flex-1 shadow-sm">
                            <div className="grid grid-cols-[48px_2fr_1fr_1fr_1fr_56px] items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                <div className="h-4 w-4 rounded bg-zinc-200 animate-pulse" />
                                <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Employee Name</span>
                                <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">No. Of KB Files</span>
                                <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Simple Interaction</span>
                                <span className="normal-case text-sm tracking-normal text-zinc-600 font-medium">Complex Interaction</span>
                                <span className="w-8" />
                            </div>
                            <div className="divide-y divide-zinc-100 flex-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="grid grid-cols-[48px_2fr_1fr_1fr_1fr_56px] items-center gap-2 px-5 py-3.5 h-[60px]">
                                        <div className="h-4 w-4 rounded bg-zinc-100 animate-pulse" />
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-zinc-100 animate-pulse shrink-0" />
                                            <div className="space-y-1.5 flex-1">
                                                <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
                                                <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="h-4 w-8 bg-zinc-100 rounded animate-pulse" />
                                        <div className="h-4 w-12 bg-zinc-100 rounded animate-pulse" />
                                        <div className="h-4 w-12 bg-zinc-100 rounded animate-pulse" />
                                        <div className="h-8 w-8 bg-zinc-100 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : isEmpty ? (
                        <div className="flex-1 flex flex-col pt-4">
                            <EmptyState />
                        </div>
                    ) : isNoResults ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-sm text-zinc-500 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 px-4 my-2">
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
                            onResendInvite={handleResendInvite}
                            onRevokeInvite={handleRevokeInvite}
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
        </div>
    );
}