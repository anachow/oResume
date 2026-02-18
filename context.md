🔹 FINAL MASTER PROMPT FOR CLAUDECODE
oResume – End-to-End Enterprise Development
Project Overview

Let us build an application oResume.
To be hosted at oResume.oStaran.com.
To be developed using ClaudeCode.

The application must be:

Enterprise-grade

Highly secure

Scalable

Premium-looking

Professional

User-friendly

Production-ready

Architecture must follow security-first, least-privilege, and scalability-by-design principles.

Source Control & Deployment

Source Code Repository: GitHub

Deployment Platform: Vercel

CI/CD: Automatic deployment from GitHub to Vercel

Environment Variables & Secrets (CRITICAL)

❌ Do NOT create or commit .env files in the repository

✅ All secrets must be stored only in Vercel Environment Variables

Secrets include (but are not limited to):

Supabase URL

Supabase Anon Key

Supabase Service Role Key

OpenAI API Key

Razorpay Key ID & Secret

Code must access secrets using process.env.*

Assume secrets are injected securely at runtime

Repository must include .gitignore rules excluding:

.env

.env.*

.env.local

.vercel

Core Technology Stack

Authentication: Supabase Auth

Database: Supabase PostgreSQL

Row Level Security (RLS): Enabled on all tables

Vector Database: Redis or pgvector

File Storage: Supabase Storage Buckets

Payment Gateway: Razorpay

Architecture must allow future payment gateways

LLM Integration:

OpenAI API

API key provided via Vercel environment variables only

UI / UX & Design System

The application must look professional, premium, elegant, modern, and trustworthy.

Theme

Primary: Deep Blue #1F3A5F

Secondary: Sky Blue #4DA3FF

Accent (CTAs): Emerald Green #2ECC71

Background: Off-White #F7F9FC

Text: Charcoal #2B2B2B

UI Guidelines

Modern buttons, sliders, widgets, dropdowns, slicers

Subtle shadow effects where required

Clean spacing and typography

Fully responsive design

Accessibility-friendly

Light mode by default (dark mode extensible)

What is oResume?

oResume is a job search and resume repository platform designed for:

Final-year students

Job seekers

Employers

Recruiters

Staffing consultants

Users can upload resumes, manage professional profiles, and be matched with employers and recruiters.

Platform inspiration: Naukri.com and Monster.com, but built modern, AI-ready, and conversion-optimized.

User Categories
A. Job Seekers
B. Employers
C. Recruiters

Recruiters Definition
Recruiters are third-party staffing professionals or consultants who may represent multiple employers and access candidate profiles based on subscription limits.

User Types (Across All Categories)

a. Visitor (not signed in)
b. Signed-in free user
c. Paid user
d. Trial user (time-bound or credit-bound)

User Acquisition & Tracking

Track and persist the following:

UTM Source

UTM Campaign

UTM Referral Code

UTM Country

UTM Job Code

UTM data must be linked to user records post-signup.

USER JOURNEYS
Job Seeker Journey

A.a

User lands from search, social media, or referral

Lands directly on Resume Upload Page

Uploads resume before signup

After submission → prompt signup

If email exists → prompt sign-in and auto-fill details

A.b / A.c / A.d

If session expired → prompt sign-in

Access controlled by Free / Trial / Paid status

Employer Journey

B.a

Employer signs up using Employer Enrollment Form

Creates organization profile

Can add multiple team members

Team Roles

Admin: billing, subscriptions, team management

Recruiter: candidate search & shortlisting

Viewer: read-only access

B.a.i

Employers can search candidates using all searchable candidate attributes

Candidate Resume Upload Form (Full Specification)
Identity & Contact

Email

If existing user → prompt sign-in and auto-fill

If new user → remain silent until post-submit signup

Mobile number with country code

Consent checkbox for WhatsApp job alerts

Full name

Date of Birth (calendar picker)

Location

Country / State / City (autocomplete for India, US, Canada)

Current location

Preferred locations (multi-select)

Willingness to relocate (Yes/No)

Job Context

Job Code

Autofill from UTM if available

Optional

Autocomplete from Job Code table

Industry

Job Type:

Full-time

Part-time

Contract

Internship

Work Mode:

Remote

Hybrid

Onsite

Notice Period

Experience

Total years of experience

Relevant experience (optional)

Career break (Yes/No + duration)

Employment gap explanation (optional)

Salary

Current salary (fixed + variable)

Preferred salary

Employment History

Current job:

Company

Role

Month/year of joining

Month/year of relieving (if applicable)

Previous jobs (repeatable, recent first)

Education

Education history (repeatable)

Institution

Degree

Specialization

Year of completion

Skills & Credentials

Skills (autocomplete + add new)

Primary skill

Secondary skills (top 3–5)

Licenses & certifications

Passport / Driver’s License / Work permits

Resume & Cover Letter

Resume upload (DOC/PDF, max 5MB)

Resume title

Resume versioning support

Cover letter:

Text OR DOC/PDF

Visibility & Consent

Resume visibility:

Public & searchable

Searchable with hidden contact details

Private

Consent checkboxes:

Agree to Terms & Privacy Policy

Allow employer/recruiter contact

WhatsApp/email communication consent

Employer Enrollment Form
Company Details

Company name

Website

Industry

Company size

HQ location

Year founded (optional)

Company email domain (verification)

Primary Contact

Name

Work email

Mobile

Designation

LinkedIn (optional)

Hiring Info

Roles hired for

Hiring locations

Hiring volume

Employment types

Team Setup

Organization admin creation

Invite team members

Role assignment

Compliance

Represent organization confirmation

Agree to platform policies

Recruiter / Consultant Enrollment Form
Identity

Individual or Agency

Recruiter name

Agency name (if applicable)

Website / LinkedIn

Contact

Email

Mobile

WhatsApp consent

Location

Recruiting Scope

Industries served

Roles hired

Experience levels handled

Countries served

Representation

Represents multiple employers (Yes/No)

Employer names (optional)

Ethics & Compliance

Fair usage consent

Data protection consent

Search, Matching & AI Logic

Keyword search

Filter search:

Skills

Experience

Location

Job type

Semantic vector search

AI relevance ranking

Resume-to-job AI matching (extensible)

Monetization & Feature Gating

Paid & Trial controls may limit:

Candidate searches

Resume views

Resume downloads

Contact visibility

AI matching credits

Data exports

Trial users:

Time-based or usage-based

Feature gating enforced at:

UI level

API level

Database RLS level

Admin Panel
Admin Authentication

Separate admin authentication table

Secure login

Role-based privileges

Admin Capabilities

CRUD on all records

User, employer, recruiter management

Subscription & payment visibility

Platform analytics

Audit logs

No direct modification of sensitive credentials

Analytics & Reporting

Track:

Signups

Resume uploads

Employer onboarding

Searches

Resume views/downloads

Paid conversions

Trial conversions

UTM performance

Analytics scope:

User-level

Employer-level

Platform-level (admin only)

Security & Compliance

Supabase RLS everywhere

Role-based access control

Email verification

Rate limiting

Abuse prevention

Secure file access via signed URLs

GDPR-ready data handling

Audit logs for sensitive actions

Code Architecture & Standards

Modular architecture

Separate reusable function repositories

Business logic reusable across modules

Clean separation of concerns

Markdown-documented functions

No hardcoded secrets

Production-grade error handling

Database & Storage

Normalized PostgreSQL schema

Indexed tables

Foreign key constraints

Strict RLS:

User-level

Role-level

Subscription-level

Supabase Storage Buckets for resumes

Scalability & Future Readiness

Multi-tenant design

High concurrency readiness

AI expansion support

Multiple payment gateways

Internationalization ready

No hardcoded assumptions

FINAL INSTRUCTION TO CLAUDECODE

Generate:

Frontend

Backend APIs

Database schema

RLS policies

Authentication flows

Payment flows

Admin panel

Search & AI-ready architecture

The system must be secure, scalable, premium, enterprise-grade, and production-ready.
