import { useMemo, useState, type JSX } from "react";

import {
    MoreVertical,
    Eye,
    Pencil,
    FolderPlus,
    RotateCw,
    Archive,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";

import { Checkbox } from "@/components/ui/checkbox";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { type Employee } from "@/data/mockEmployees";

type EmployeeStatus = Employee["status"];

type StatusDotProps = {
    status: EmployeeStatus;
};

type RowMenuProps = {
    employee: Employee;
    onDelete: (id: string) => void;
    onView: (employee: Employee) => void;
};

type EmployeeTableProps = {
    employees: Employee[];
    onDelete: (id: string) => void;
    onView: (employee: Employee) => void;
};

function StatusDot({
    status,
}: StatusDotProps): JSX.Element {
    const color =
        status === "online"
            ? "bg-emerald-500"
            : status === "away"
                ? "bg-orange-500"
                : "bg-zinc-300";

    return (
        <span
            className={cn(
                "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white",
                color
            )}
        />
    );
}

function RowMenu({
    employee,
    onDelete,
    onView,
}: RowMenuProps): JSX.Element {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    data-testid={`row-menu-${employee.id}`}
                    className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="Row actions"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-44"
            >
                <DropdownMenuItem
                    data-testid={`view-details-${employee.id}`}
                    onClick={() =>
                        onView(employee)
                    }
                >
                    <Eye className="mr-2 h-4 w-4 text-zinc-600" />
                    View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        toast(`Edit ${employee.name}`)
                    }
                >
                    <Pencil className="mr-2 h-4 w-4 text-zinc-600" />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        toast("Add to category")
                    }
                >
                    <FolderPlus className="mr-2 h-4 w-4 text-zinc-600" />
                    Add to Category
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        toast(
                            `Invite resent to ${employee.name}`
                        )
                    }
                >
                    <RotateCw className="mr-2 h-4 w-4 text-zinc-600" />
                    Resend Invite
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        toast(`Archived ${employee.name}`)
                    }
                >
                    <Archive className="mr-2 h-4 w-4 text-zinc-600" />
                    Archive
                </DropdownMenuItem>

                <DropdownMenuItem
                    data-testid={`delete-${employee.id}`}
                    onClick={() =>
                        onDelete(employee.id)
                    }
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function EmployeeTable({
    employees,
    onDelete,
    onView,
}: EmployeeTableProps): JSX.Element {
    const [selected, setSelected] =
        useState<Set<string>>(new Set());

    const [rowsPerPage, setRowsPerPage] =
        useState<number>(50);

    const [page, setPage] =
        useState<number>(1);

    const total = employees.length;

    const totalPages = Math.max(
        1,
        Math.ceil(total / rowsPerPage)
    );

    const startIdx = (page - 1) * rowsPerPage;

    const endIdx = Math.min(
        startIdx + rowsPerPage,
        total
    );

    const pageRows = useMemo(
        () => employees.slice(startIdx, endIdx),
        [employees, startIdx, endIdx]
    );

    const toggleAll = (
        checked: boolean | "indeterminate"
    ): void => {
        if (checked) {
            setSelected(
                new Set(pageRows.map((r) => r.id))
            );
        } else {
            setSelected(new Set());
        }
    };

    const toggleOne = (
        id: string
    ): void => {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const allChecked =
        pageRows.length > 0 &&
        pageRows.every((r) =>
            selected.has(r.id)
        );

    return (
        <div
            className="overflow-hidden rounded-2xl border border-zinc-100 bg-white"
            data-testid="employees-table"
        >
            {/* Header */}
            <div className="grid grid-cols-[48px_2fr_1fr_1fr_1fr_56px] items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <div>
                    <Checkbox
                        checked={allChecked}
                        onCheckedChange={toggleAll}
                        data-testid="select-all-checkbox"
                    />
                </div>

                <div className="text-sm normal-case tracking-normal text-zinc-600">
                    Employee Name
                </div>

                <div className="text-sm normal-case tracking-normal text-zinc-600">
                    No. Of KB Files
                </div>

                <div className="text-sm normal-case tracking-normal text-zinc-600">
                    Simple Interaction
                </div>

                <div className="text-sm normal-case tracking-normal text-zinc-600">
                    Complex Interaction
                </div>

                <div />
            </div>

            {/* Rows */}
            <div>
                {pageRows.map((emp) => (
                    <div
                        key={emp.id}
                        className="grid grid-cols-[48px_2fr_1fr_1fr_1fr_56px] items-center gap-2 border-b border-zinc-50 px-5 py-4 transition-colors hover:bg-zinc-50/60"
                        data-testid={`employee-row-${emp.id}`}
                    >
                        <div>
                            <Checkbox
                                checked={selected.has(emp.id)}
                                onCheckedChange={() =>
                                    toggleOne(emp.id)
                                }
                                data-testid={`select-row-${emp.id}`}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage
                                        src={emp.avatar}
                                        alt={emp.name}
                                    />

                                    <AvatarFallback>
                                        {emp.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>

                                <StatusDot status={emp.status} />
                            </div>

                            <div>
                                <div className="text-sm font-medium text-zinc-900">
                                    {emp.name}
                                </div>

                                <div className="text-xs text-zinc-500">
                                    {emp.role}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-zinc-700">
                            {emp.kbFiles ?? "-"}
                        </div>

                        <div className="text-sm text-zinc-700">
                            {emp.simpleInteraction ?? "-"}
                        </div>

                        <div className="text-sm text-zinc-700">
                            {emp.complexInteraction ?? "-"}
                        </div>

                        <div className="flex justify-end">
                            <RowMenu
                                employee={emp}
                                onDelete={onDelete}
                                onView={onView}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-6 px-5 py-3 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                    <span>Rows per Page</span>

                    <Select
                        value={String(rowsPerPage)}
                        onValueChange={(v: string) => {
                            setRowsPerPage(Number(v));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger
                            className="h-8 w-[72px] rounded-md border-zinc-200"
                            data-testid="rows-per-page-select"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {[10, 25, 50, 100].map((n) => (
                                <SelectItem
                                    key={n}
                                    value={String(n)}
                                >
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div data-testid="pagination-range">
                    {total === 0
                        ? "0"
                        : `${startIdx + 1}-${endIdx}`}{" "}
                    of {total}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="rounded-md p-1.5 hover:bg-zinc-100 disabled:opacity-40"
                        onClick={() =>
                            setPage((p) =>
                                Math.max(1, p - 1)
                            )
                        }
                        disabled={page === 1}
                        data-testid="prev-page-btn"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from(
                        {
                            length: Math.min(
                                totalPages,
                                4
                            ),
                        },
                        (_, i) => i + 1
                    ).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p)}
                            data-testid={`page-${p}`}
                            className={cn(
                                "h-8 w-8 rounded-md text-sm",
                                page === p
                                    ? "bg-zinc-900 text-white"
                                    : "text-zinc-700 hover:bg-zinc-100"
                            )}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        type="button"
                        className="rounded-md p-1.5 hover:bg-zinc-100 disabled:opacity-40"
                        onClick={() =>
                            setPage((p) =>
                                Math.min(
                                    totalPages,
                                    p + 1
                                )
                            )
                        }
                        disabled={
                            page === totalPages
                        }
                        data-testid="next-page-btn"
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}