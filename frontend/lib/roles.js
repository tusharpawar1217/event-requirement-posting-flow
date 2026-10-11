export const ROLE_HOME = {
  admin: "/browse",
  client: "/browse",
  planner: "/browse",
  performer: "/browse",
  crew: "/browse",
};

export const homeFor = (role) => ROLE_HOME[role] || "/";

// Only allow same-site relative paths (prevents open-redirect)
export function safeNext(next, role) {
  if (!next || next === "/" || !next.startsWith("/") || next.startsWith("//")) {
    return homeFor(role);
  }
  return next;
}
