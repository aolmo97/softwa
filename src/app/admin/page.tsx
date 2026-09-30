import { admin } from "@/lib/auth";
import { listResource, history } from "@/lib/repository";
import { Login, AdminEditor } from "@/components/admin";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Editorial admin",
  "Manage the software catalogue.",
  "/admin",
  true,
);
export default async function Admin() {
  const user = await admin();
  return (
    <div className="container page-content" style={{ paddingTop: 35 }}>
      {user ? (
        <AdminEditor
          initial={
            listResource("software") as unknown as Record<string, unknown>[]
          }
          history={history() as Record<string, unknown>[]}
        />
      ) : (
        <Login />
      )}
    </div>
  );
}
