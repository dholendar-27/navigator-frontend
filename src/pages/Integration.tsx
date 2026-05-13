import { useMemo, useState } from "react";
import { RotateCw, Search, ToyBrick as Plug } from "lucide-react";
import IntegrationCard from "@/components/integration/IntegrationCard";

const SlackIcon = () => (
    <img src="/Slack.svg" alt="Slack" className="h-7 w-7 object-contain" />
);

const TeamsIcon = () => (
    <img src="/Teams.svg" alt="Microsoft Teams" className="h-7 w-7 object-contain" />
);

const EmptyPlugIcon = ({ className }: { className?: string }) => (
    <Plug className={className} />
);

type Variant = "populated" | "empty";

type IntegrationItem = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    defaultEnabled?: boolean;
};

type IntegrationProps = {
    variant?: Variant;
};

const Integration: React.FC<IntegrationProps> = ({ variant = "populated" }) => {
    const [query, setQuery] = useState<string>("");

    const allIntegrations: IntegrationItem[] = useMemo(
        () => [
            {
                id: "slack",
                name: "Slack",
                description:
                    "Streamline team collaboration with timelines and customizable workflows.",
                icon: <SlackIcon />,
                defaultEnabled: false,
            },
            {
                id: "teams",
                name: "Teams",
                description:
                    "Enhance collaboration and access important updates directly within Microsoft Teams.",
                icon: <TeamsIcon />,
                defaultEnabled: true,
            },
        ],
        []
    );

    const isEmpty: boolean = variant === "empty";

    const filtered: IntegrationItem[] = useMemo(() => {
        if (isEmpty) return [];

        const q = query.trim().toLowerCase();

        if (!q) return allIntegrations;

        return allIntegrations.filter(
            (i) =>
                i.name.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q)
        );
    }, [query, allIntegrations, isEmpty]);

    return (
        <section
            data-testid="integration-screen"
            className="min-h-screen w-full bg-[#FAFAF7] px-8 py-8 md:px-12 md:py-10"
        >
            {/* Title row */}
            <div className="flex items-center justify-between">
                <h1
                    data-testid="integration-title"
                    className="text-[26px] font-semibold tracking-tight text-neutral-900"
                >
                    Integration
                </h1>

                <button
                    type="button"
                    data-testid="integration-refresh-btn"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                    <RotateCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="mt-5 relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                    type="text"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setQuery(e.target.value)
                    }
                    placeholder="Search Integrations..."
                    aria-label="Search integrations"
                    data-testid="integration-search-input"
                    disabled={isEmpty}
                    className="block h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-70"
                />
            </div>

            {/* Body */}
            <div className="mt-6">
                {isEmpty || filtered.length === 0 ? (
                    <div
                        data-testid="integration-empty-state"
                        className="flex min-h-[480px] w-full flex-col items-center justify-center rounded-2xl bg-neutral-100/80"
                    >
                        <EmptyPlugIcon className="h-20 w-20 text-neutral-600" />

                        <p
                            data-testid="integration-empty-title"
                            className="mt-6 text-lg font-semibold text-neutral-900"
                        >
                            No Data Found
                        </p>

                        <p
                            data-testid="integration-empty-subtitle"
                            className="mt-1.5 text-sm text-neutral-500"
                        >
                            No integrations have been added yet.
                        </p>
                    </div>
                ) : (
                    <div
                        data-testid="integration-grid"
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {filtered.map((integration) => (
                            <IntegrationCard
                                key={integration.id}
                                integration={integration}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Integration;