import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";
import { deleteClass } from "@/actions/admin";

export default async function AdminClassesPage() {
  const classes = await prisma.class.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Class & Tuition Management</h1>
        <Link href="/admin/classes/new" className="btn btn-primary">Schedule New Class</Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Instructor</th>
              <th>Schedule</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No classes scheduled. Add one above!</td></tr>
            ) : (
              classes.map(cls => (
                <tr key={cls.id}>
                  <td style={{ fontWeight: "500" }}>{cls.title}</td>
                  <td>{cls.instructor}</td>
                  <td>{cls.schedule}</td>
                  <td>{cls.price ? `₹${cls.price.toFixed(2)}` : "TBD"}</td>
                  <td>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "100px", fontSize: "0.85rem", backgroundColor: cls.isActive ? "rgba(0,200,0,0.1)" : "rgba(200,0,0,0.1)", color: cls.isActive ? "green" : "red" }}>
                      {cls.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <form action={async () => {
                      "use server";
                      await deleteClass(cls.id);
                    }}>
                      <button type="submit" style={{ color: "red", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Delete</button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
