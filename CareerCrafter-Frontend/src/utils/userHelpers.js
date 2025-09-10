import api from "../api/api";

export async function fetchAuthenticatedUsername() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function fetchCurrentUserDTO() {
  const username = await fetchAuthenticatedUsername();
  const res = await api.get("/users");
  const users = res.data || [];
  return (
    users.find((u) => u.email === username || u.username === username) || null
  );
}

export async function fetchCurrentJobSeekerId() {
  const user = await fetchCurrentUserDTO();
  if (!user) return null;
  const res = await api.get("/jobseekers");
  const seekers = res.data || [];
  const js = seekers.find((s) => s.userId === user.userId);
  return js ? js.jobSeekerId : null;
}

export async function fetchCurrentEmployerId() {
  const user = await fetchCurrentUserDTO();
  if (!user) return null;
  const res = await api.get("/employers");
  const emps = res.data || [];
  const emp = emps.find((e) => e.userId === user.userId);
  return emp ? emp.employerId : null;
}
