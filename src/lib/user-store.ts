interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  role: "student";
  createdAt: number;
}

const store = new Map<string, RegisteredUser>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.createdAt < now - 24 * 60 * 60 * 1000) store.delete(key);
  }
}, 60000);

export function registerUser(email: string, name: string, password: string) {
  store.set(email, { name, email, password, role: "student", createdAt: Date.now() });
}

export function getUserByEmail(email: string): RegisteredUser | undefined {
  const user = store.get(email);
  if (!user) return undefined;
  if (user.createdAt < Date.now() - 24 * 60 * 60 * 1000) { store.delete(email); return undefined; }
  return user;
}
