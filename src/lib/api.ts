import funcUrls from "../../backend/func2url.json";

export const AUTH_URL = (funcUrls as Record<string, string>).auth;
export const LOANS_URL = (funcUrls as Record<string, string>).loans;

export interface User {
  id: number;
  phone: string;
  full_name: string;
  email: string;
  card_number: string;
  role: "client" | "admin";
}

export interface Loan {
  id: number;
  user_id: number;
  amount: number;
  days: number;
  total_payment: number;
  due_date: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string | null;
  full_name?: string | null;
  phone?: string | null;
}

const TOKEN_KEY = "credit365_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { "X-Auth-Token": t } : {};
}

export async function register(phone: string, password: string, full_name: string) {
  const res = await fetch(`${AUTH_URL}?action=register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password, full_name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  return data as { token: string; user: User };
}

export async function login(phone: string, password: string) {
  const res = await fetch(`${AUTH_URL}?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка входа");
  return data as { token: string; user: User };
}

export async function fetchProfile() {
  const res = await fetch(AUTH_URL, { headers: authHeaders() });
  if (!res.ok) throw new Error("unauthorized");
  const data = await res.json();
  return data.user as User;
}

export async function updateProfile(payload: { full_name: string; email: string; card_number: string }) {
  const res = await fetch(AUTH_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data.user as User;
}

export async function fetchMyLoans() {
  const res = await fetch(`${LOANS_URL}?scope=mine`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data.loans as Loan[];
}

export async function fetchAllLoans() {
  const res = await fetch(`${LOANS_URL}?scope=all`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data as { loans: Loan[]; stats: Record<string, { count: number; sum: number }> };
}

export async function createLoan(payload: { amount: number; days: number; total_payment: number; due_date: string }) {
  const res = await fetch(LOANS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data.loan as Loan;
}

export async function setLoanStatus(id: number, status: "approved" | "rejected" | "pending") {
  const res = await fetch(LOANS_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка");
  return data;
}
