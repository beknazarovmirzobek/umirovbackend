const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const { query } = require("../src/db");

async function seed() {
  const teacherId = uuid();
  const studentId = uuid();

  const teacherHash = await bcrypt.hash("Teacher123!", 10);
  const studentHash = await bcrypt.hash("Student123!", 10);

  await query("DELETE FROM refresh_tokens");
  await query("DELETE FROM grades");
  await query("DELETE FROM submissions");
  await query("DELETE FROM attendance");
  await query("DELETE FROM lessons");
  await query("DELETE FROM assignments");
  await query("DELETE FROM subjects");
  await query("DELETE FROM users");

  await query(
    "INSERT INTO users (id, username, password_hash, role, first_name, last_name, must_change_password) VALUES (?,?,?,?,?,?,?)",
    [teacherId, "teacher", teacherHash, "TEACHER", "Laylo", "Karimova", 0]
  );
  await query(
    "INSERT INTO users (id, username, password_hash, role, first_name, last_name, must_change_password) VALUES (?,?,?,?,?,?,?)",
    [studentId, "student", studentHash, "STUDENT", "Aziz", "Saidov", 1]
  );

  const sub1 = uuid();
  const sub2 = uuid();
  const sub3 = uuid();
  await query(
    "INSERT INTO subjects (id, name, code, teacher_id) VALUES (?,?,?,?)",
    [sub1, "Applied Mathematics", "MATH-301", teacherId]
  );
  await query(
    "INSERT INTO subjects (id, name, code, teacher_id) VALUES (?,?,?,?)",
    [sub2, "UX Foundations", "UX-220", teacherId]
  );
  await query(
    "INSERT INTO subjects (id, name, code, teacher_id) VALUES (?,?,?,?)",
    [sub3, "Academic English", "ENG-110", teacherId]
  );

  const assign1 = uuid();
  const assign2 = uuid();
  const assign3 = uuid();
  await query(
    "INSERT INTO assignments (id, subject_id, teacher_id, title, description, deadline, max_score, attachments, is_lab, lab_editor) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      assign1,
      sub1,
      teacherId,
      "Linear regression lab",
      "Submit analysis with charts and summary.",
      new Date(Date.now() + 5 * 86400000),
      100,
      JSON.stringify([
        {
          id: uuid(),
          name: "dataset.csv",
          mimeType: "text/csv",
          sizeKb: 420,
          kind: "document",
        },
        {
          id: uuid(),
          name: "lab-instructions.pdf",
          mimeType: "application/pdf",
          sizeKb: 860,
          kind: "document",
        },
      ]),
      0,
      "word",
    ]
  );
  await query(
    "INSERT INTO assignments (id, subject_id, teacher_id, title, description, deadline, max_score, attachments, is_lab, lab_editor) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      assign2,
      sub2,
      teacherId,
      "Prototype critique",
      "Upload critique with insights.",
      new Date(Date.now() - 1 * 86400000),
      100,
      JSON.stringify([
        {
          id: uuid(),
          name: "ux-critique-guide.docx",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          sizeKb: 320,
          kind: "document",
        },
        {
          id: uuid(),
          name: "critique-session.mp4",
          mimeType: "video/mp4",
          sizeKb: 12450,
          kind: "video",
        },
      ]),
      0,
      "word",
    ]
  );
  await query(
    "INSERT INTO assignments (id, subject_id, teacher_id, title, description, deadline, max_score, attachments, is_lab, lab_editor) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      assign3,
      sub3,
      teacherId,
      "Essay outline",
      "Submit outline and thesis.",
      new Date(Date.now() + 10 * 86400000),
      100,
      JSON.stringify([
        {
          id: uuid(),
          name: "outline-template.pptx",
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          sizeKb: 540,
          kind: "slides",
        },
      ]),
      0,
      "word",
    ]
  );

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
