import React, {
    useEffect,
    useRef,
    useState,
    type JSX,
} from "react";

import { format } from "date-fns";

import {
    Calendar as CalendarIcon,
    X,
    User as UserIcon,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";

type CountryCode = {
    code: string;
    flag: string;
    label: string;
};

type Gender =
    | "Male"
    | "Female"
    | "Other"
    | "Prefer not to say"
    | "";

type Role =
    | "Super Admin"
    | "Admin"
    | "Editor"
    | "Member"
    | "";

type Category =
    | "Engineering"
    | "Marketing"
    | "Sales"
    | "HR"
    | "Finance"
    | "";

type EmployeeForm = {
    name: string;
    email: string;
    mobile: string;
    countryCode: string;
    gender: Gender;
    dob: Date | null;
    role: Role;
    category: Category;
    avatar: string | null;
};

type EmployeePayload = EmployeeForm & {
    id: string;
};

interface AddEmployeeDrawerProps {
    open: boolean;
    onOpenChange: (
        open: boolean
    ) => void;
    onSubmit: (
        data: EmployeePayload,
        invite: boolean
    ) => void;
    nextEmployeeId: string;
}

const COUNTRY_CODES: CountryCode[] = [
    {
        code: "+1",
        flag: "🇺🇸",
        label: "US",
    },
    {
        code: "+44",
        flag: "🇬🇧",
        label: "UK",
    },
    {
        code: "+91",
        flag: "🇮🇳",
        label: "IN",
    },
    {
        code: "+61",
        flag: "🇦🇺",
        label: "AU",
    },
    {
        code: "+49",
        flag: "🇩🇪",
        label: "DE",
    },
];

const ROLES: Role[] = [
    "Super Admin",
    "Admin",
    "Editor",
    "Member",
];

const CATEGORIES: Category[] = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
];

const GENDERS: Gender[] = [
    "Male",
    "Female",
    "Other",
    "Prefer not to say",
];

const initialForm: EmployeeForm = {
    name: "",
    email: "",
    mobile: "",
    countryCode: "+1",
    gender: "",
    dob: null,
    role: "",
    category: "",
    avatar: null,
};

export default function AddEmployeeDrawer({
    open,
    onOpenChange,
    onSubmit,
    nextEmployeeId,
}: AddEmployeeDrawerProps): JSX.Element {
    const [form, setForm] =
        useState<EmployeeForm>(
            initialForm
        );

    const [
        avatarPreview,
        setAvatarPreview,
    ] = useState<string | null>(
        null
    );

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) {
            setForm(initialForm);
            setAvatarPreview(null);
        }
    }, [open]);

    const updateField = <
        K extends keyof EmployeeForm
    >(
        key: K,
        value: EmployeeForm[K]
    ): void => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onloadend = () => {
            const result =
                reader.result as string;

            setAvatarPreview(result);

            updateField(
                "avatar",
                result
            );
        };

        reader.readAsDataURL(file);
    };

    const canSave =
        form.name.trim() !== "" &&
        form.email.trim() !== "";

    const submit = (
        invite: boolean
    ): void => {
        if (!canSave) {
            return;
        }

        onSubmit(
            {
                ...form,
                id: nextEmployeeId,
                avatar:
                    avatarPreview ||
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop",
                role:
                    form.role || "Member",
            },
            invite
        );
    };

    const country =
        COUNTRY_CODES.find(
            (c) =>
                c.code ===
                form.countryCode
        ) || COUNTRY_CODES[0];

    return (
        <Sheet
            open={open}
            onOpenChange={
                onOpenChange
            }
        >
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
                data-testid="add-employee-drawer"
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                    <button
                        type="button"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        data-testid="close-drawer-btn"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <SheetTitle className="text-lg font-semibold text-zinc-900">
                        Add Employee
                    </SheetTitle>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                    {/* Avatar */}
                    <div>
                        <Label className="text-sm font-medium text-zinc-700">
                            Employee Avatar
                        </Label>

                        <div className="mt-2 flex items-start gap-4">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                                {avatarPreview ? (
                                    <img
                                        src={
                                            avatarPreview
                                        }
                                        alt="avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="h-10 w-10 text-zinc-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="text-xs text-zinc-500">
                                    Allowed only
                                    .jpeg, .jpg,
                                    .png.
                                    <br />
                                    Maximum size of
                                    5 mb.
                                </p>

                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={
                                        handleFileChange
                                    }
                                    data-testid="avatar-file-input"
                                />

                                <Button
                                    type="button"
                                    size="sm"
                                    className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    data-testid="choose-file-btn"
                                >
                                    Choose File
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="emp-name"
                            className="text-sm font-medium text-zinc-700"
                        >
                            Employee Name
                        </Label>

                        <Input
                            id="emp-name"
                            value={form.name}
                            onChange={(e) =>
                                updateField(
                                    "name",
                                    e.target.value
                                )
                            }
                            placeholder="Enter your name"
                            data-testid="emp-name-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
                    </div>

                    {/* Employee ID */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Employee ID
                        </Label>

                        <Input
                            value={
                                nextEmployeeId
                            }
                            readOnly
                            data-testid="emp-id-input"
                            className="h-11 cursor-not-allowed rounded-lg border-zinc-200 bg-zinc-50 text-zinc-700"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="emp-email"
                            className="text-sm font-medium text-zinc-700"
                        >
                            Email
                        </Label>

                        <Input
                            id="emp-email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                updateField(
                                    "email",
                                    e.target.value
                                )
                            }
                            placeholder="Enter your email"
                            data-testid="emp-email-input"
                            className="h-11 rounded-lg border-zinc-200"
                        />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Mobile Number
                        </Label>

                        <div className="flex gap-2">
                            <Select
                                value={
                                    form.countryCode
                                }
                                onValueChange={(
                                    v
                                ) =>
                                    updateField(
                                        "countryCode",
                                        v
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="h-11 w-24 rounded-lg border-zinc-200"
                                    data-testid="country-code-select"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-base">
                                            {
                                                country.flag
                                            }
                                        </span>

                                        <span className="text-sm">
                                            {
                                                country.code
                                            }
                                        </span>
                                    </span>
                                </SelectTrigger>

                                <SelectContent>
                                    {COUNTRY_CODES.map(
                                        (c) => (
                                            <SelectItem
                                                key={
                                                    c.code
                                                }
                                                value={
                                                    c.code
                                                }
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="text-base">
                                                        {
                                                            c.flag
                                                        }
                                                    </span>

                                                    <span>
                                                        {
                                                            c.code
                                                        }
                                                    </span>
                                                </span>
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <Input
                                value={
                                    form.mobile
                                }
                                onChange={(e) =>
                                    updateField(
                                        "mobile",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your mobile number"
                                data-testid="emp-mobile-input"
                                className="h-11 flex-1 rounded-lg border-zinc-200"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Gender
                        </Label>

                        <Select
                            value={form.gender}
                            onValueChange={(
                                v
                            ) =>
                                updateField(
                                    "gender",
                                    v as Gender
                                )
                            }
                        >
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="emp-gender-select"
                            >
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>

                            <SelectContent>
                                {GENDERS.map(
                                    (g) => (
                                        <SelectItem
                                            key={g}
                                            value={g}
                                        >
                                            {g}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* DOB */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Date Of Birth
                        </Label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "flex h-11 w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 text-left text-sm",
                                        !form.dob &&
                                        "text-zinc-400"
                                    )}
                                    data-testid="emp-dob-trigger"
                                >
                                    <span>
                                        {form.dob
                                            ? format(
                                                form.dob,
                                                "dd MMMM yyyy"
                                            )
                                            : "Select date"}
                                    </span>

                                    <CalendarIcon className="h-4 w-4 text-zinc-400" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        form.dob ||
                                        undefined
                                    }
                                    onSelect={(
                                        d
                                    ) =>
                                        updateField(
                                            "dob",
                                            d || null
                                        )
                                    }

                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Role
                        </Label>

                        <Select
                            value={form.role}
                            onValueChange={(
                                v
                            ) =>
                                updateField(
                                    "role",
                                    v as Role
                                )
                            }
                        >
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="emp-role-select"
                            >
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>

                            <SelectContent>
                                {ROLES.map(
                                    (r) => (
                                        <SelectItem
                                            key={r}
                                            value={r}
                                        >
                                            {r}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Category
                        </Label>

                        <Select
                            value={
                                form.category
                            }
                            onValueChange={(
                                v
                            ) =>
                                updateField(
                                    "category",
                                    v as Category
                                )
                            }
                        >
                            <SelectTrigger
                                className="h-11 rounded-lg border-zinc-200"
                                data-testid="emp-category-select"
                            >
                                <SelectValue placeholder="Select categories" />
                            </SelectTrigger>

                            <SelectContent>
                                {CATEGORIES.map(
                                    (c) => (
                                        <SelectItem
                                            key={c}
                                            value={c}
                                        >
                                            {c}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Created By */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Created By
                        </Label>

                        <Input
                            value="William Jones"
                            readOnly
                            className="h-11 cursor-not-allowed rounded-lg border-zinc-200 bg-zinc-50 text-zinc-700"
                            data-testid="emp-created-by"
                        />
                    </div>

                    {/* Created Date */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-700">
                            Created Date
                        </Label>

                        <div className="flex h-11 w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700">
                            <span data-testid="emp-created-date">
                                28 April 2026
                            </span>

                            <CalendarIcon className="h-4 w-4 text-zinc-400" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        data-testid="cancel-drawer-btn"
                        className="text-zinc-600 hover:text-zinc-900"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() =>
                            submit(false)
                        }
                        disabled={!canSave}
                        data-testid="save-employee-btn"
                        className="rounded-lg border-zinc-200"
                    >
                        Save
                    </Button>

                    <Button
                        onClick={() =>
                            submit(true)
                        }
                        disabled={!canSave}
                        data-testid="save-invite-employee-btn"
                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save & Invite
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}