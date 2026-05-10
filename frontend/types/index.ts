// User Types
export interface User {
    id: string;
    email: string;
    fullName: string;
    companyName?: string;
    industry?: string;
    employeeCount?: string;
    avatar?: string;
    plan: "starter" | "pro" | "enterprise";
    createdAt: string;
    updatedAt: string;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    fullName: string;
    email: string;
    password: string;
    companyName: string;
    industry: string;
    employeeCount: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Scan Types
export interface ScanRequest {
    url: string;
    deep?: boolean;
}

export interface ScanIssue {
    id: string;
    type: string;
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    fixSuggestion: string;
    autoFixable: boolean;
    category: string;
    code?: string;
    line?: number;
}

export interface ScanResult {
    id: string;
    url: string;
    score: number;
    issues: ScanIssue[];
    recommendations: string[];
    metrics: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    scannedAt: string;
    duration: number;
}

// Website Types
export interface Website {
    id: string;
    url: string;
    name: string;
    status: "active" | "paused" | "error";
    complianceScore: number;
    lastScan: string;
    issues: number;
    monitoring: boolean;
    scanFrequency: "hourly" | "6h" | "daily" | "weekly";
    alertThreshold: number;
    createdAt: string;
}

// Policy Types
export interface Policy {
    id: string;
    type: string;
    title: string;
    content: string;
    language: string;
    status: "draft" | "published" | "archived";
    website: string;
    companyName: string;
    lastUpdated: string;
    createdAt: string;
}

export interface PolicyTemplate {
    id: string;
    name: string;
    description: string;
    type: string;
    coverage: string[];
    popular: boolean;
}

// Monitoring Types
export interface MonitoringAlert {
    id: string;
    website: string;
    type: "content" | "script" | "ssl" | "policy" | "performance";
    title: string;
    description: string;
    detectedAt: string;
    severity: "critical" | "warning" | "info";
    status: "new" | "acknowledged" | "resolved";
    diff?: string;
}

export interface GuardianStatus {
    isActive: boolean;
    uptime: number;
    checksToday: number;
    avgResponseTime: number;
    lastCheck: string;
    history: Array<{
        time: string;
        status: number;
    }>;
}

// Competitor Types
export interface Competitor {
    id: string;
    name: string;
    url: string;
    score: number;
    previousScore: number;
    industry: string;
    lastScan: string;
    metrics: {
        privacy: number;
        cookies: number;
        ssl: number;
        accessibility: number;
        performance: number;
    };
}

// Subscription Types
export interface Subscription {
    id: string;
    plan: string;
    status: "active" | "cancelled" | "past_due";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    paymentMethod?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    };
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: {
        monthly: number;
        annually: number;
    };
    features: string[];
    popular: boolean;
}

// Team Types
export interface TeamMember {
    id: string;
    email: string;
    fullName: string;
    role: "owner" | "admin" | "member" | "viewer";
    avatar?: string;
    status: "active" | "pending" | "inactive";
    joinedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

// WebSocket Types
export interface WsMessage {
    type: "scan_complete" | "alert" | "status_update";
    payload: any;
    timestamp: string;
}

// Component Props Types
export interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export interface AnimatedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}