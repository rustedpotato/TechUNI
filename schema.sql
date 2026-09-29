-- Commercialization Pipeline Platform: Supabase PostgreSQL Schema
-- Compliant with PDR 1 and PDR 2

-- 1. ENUMS
CREATE TYPE stage_type AS ENUM ('discover', 'screen', 'validate', 'agree', 'prototype', 'pilot', 'commercialize', 'rejected', 'archived');
CREATE TYPE user_role_type AS ENUM ('student', 'mentor', 'buyer', 'admin', 'ip_legal');
CREATE TYPE deal_type AS ENUM ('license', 'sale', 'revenue_share', 'corporate_program', 'spinout');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'blocked');
CREATE TYPE pilot_status AS ENUM ('planned', 'in_progress', 'completed_successful', 'completed_unsuccessful');

-- 2. INSTITUTIONS
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., University, Tier-1 Engineering, Research Lab
    faculty_champion_name TEXT,
    faculty_champion_email TEXT,
    ip_policy_status TEXT DEFAULT 'pending_review', -- 'approved', 'restricted', 'waiver_required'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PERSONS (Users & Contacts)
CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID, -- References auth.users if Supabase auth is linked
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role_type NOT NULL DEFAULT 'student',
    institution_id UUID REFERENCES institutions(id),
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COMPANIES (Corporate Buyers & Partners)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sector TEXT NOT NULL, -- e.g., 'EV & Energy', 'Agritech', 'Industrial IoT', 'Healthcare'
    contact_person TEXT,
    contact_email TEXT,
    interest_tags TEXT[] DEFAULT '{}',
    is_vetted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CORPORATE PROBLEM STATEMENTS (Demand Signal)
CREATE TABLE problem_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    budget_signal TEXT, -- e.g., 'Pilot Budget INR 5-10L', 'Grant up to 25L'
    target_delivery_months INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PROJECTS (The Core Innovation Pipeline)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    stage stage_type NOT NULL DEFAULT 'discover',
    trl_level INT NOT NULL DEFAULT 3 CHECK (trl_level BETWEEN 1 AND 9),
    composite_score NUMERIC(5,2) DEFAULT 0,
    status TEXT DEFAULT 'active',
    summary TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    solution_statement TEXT NOT NULL,
    institution_id UUID REFERENCES institutions(id),
    lead_inventor_id UUID REFERENCES persons(id),
    demo_url TEXT,
    ip_disclosure_status TEXT DEFAULT 'none', -- 'none', 'provisional_filed', 'college_disclosed', 'patented'
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. EVALUATIONS (7-Parameter Scorecard)
-- Parameters: Problem Severity (20), Market Potential (20), Technical Feasibility (15),
-- Differentiation (15), IP Potential (10), Cost/Scalability (10), Industry Demand (10) = 100 max
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES persons(id),
    problem_severity_score INT CHECK (problem_severity_score BETWEEN 0 AND 20),
    market_potential_score INT CHECK (market_potential_score BETWEEN 0 AND 20),
    technical_feasibility_score INT CHECK (technical_feasibility_score BETWEEN 0 AND 15),
    differentiation_score INT CHECK (differentiation_score BETWEEN 0 AND 15),
    ip_potential_score INT CHECK (ip_potential_score BETWEEN 0 AND 10),
    cost_scalability_score INT CHECK (cost_scalability_score BETWEEN 0 AND 10),
    industry_demand_score INT CHECK (industry_demand_score BETWEEN 0 AND 10),
    total_score INT GENERATED ALWAYS AS (
        COALESCE(problem_severity_score, 0) +
        COALESCE(market_potential_score, 0) +
        COALESCE(technical_feasibility_score, 0) +
        COALESCE(differentiation_score, 0) +
        COALESCE(ip_potential_score, 0) +
        COALESCE(cost_scalability_score, 0) +
        COALESCE(industry_demand_score, 0)
    ) STORED,
    notes TEXT,
    is_ai_advisory BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. BUYER CONVERSATIONS & VALIDATION LOGS
-- Gate 3 requirement: At least 2 corporate buyers must record 'would_pilot' before Advancing
CREATE TABLE buyer_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    contact_name TEXT,
    conversation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    interest_level TEXT NOT NULL, -- 'not_interested', 'informational', 'needs_changes', 'would_pilot', 'ready_to_contract'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. AGREEMENTS & IP ASSIGNMENT
-- Gate 4 requirement: Signed agreement + college policy check before Prototype funding
CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    terms_summary TEXT,
    inventor_equity_pct NUMERIC(5,2),
    company_equity_pct NUMERIC(5,2),
    college_royalty_pct NUMERIC(5,2),
    continuation_terms TEXT, -- Terms for IP survival post student graduation
    signed_date TIMESTAMPTZ,
    is_signed BOOLEAN DEFAULT false,
    college_cleared BOOLEAN DEFAULT false,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. PROTOTYPE MILESTONES (TRL 3 -> TRL 6)
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    status milestone_status DEFAULT 'pending',
    target_trl INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. TEST LOGS
CREATE TABLE test_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    test_title TEXT NOT NULL,
    test_date DATE DEFAULT CURRENT_DATE,
    location TEXT, -- e.g. 'Lab 4B / Partner Fab Workshop'
    tester_name TEXT NOT NULL,
    parameters_tested TEXT,
    result TEXT NOT NULL, -- e.g. 'Passed with 94% efficiency', 'Overheating at 45C'
    verified_trl INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. PILOTS
CREATE TABLE pilots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    scope_description TEXT NOT NULL,
    duration_weeks INT NOT NULL DEFAULT 8,
    success_metrics TEXT,
    status pilot_status DEFAULT 'planned',
    outcome_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. COMMERCIAL DEALS
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    deal_type deal_type NOT NULL,
    deal_value_inr NUMERIC(14,2),
    terms TEXT,
    signed_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);
