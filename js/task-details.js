const user = JSON.parse(localStorage.getItem("earnly_user"));

if (!user) location.href = "login.html";

const taskId = localStorage.getItem("current_task");
let task = {};

loadTask();

async function loadTask() {
  const { data, error } = await db
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (error) {
    alert("Task not found");
    location.href = "tasks.html";
    return;
  }

  task = data;

  document.getElementById("title").innerText = task.title;
  document.getElementById("desc").innerText = task.description;
  document.getElementById("taskLink").href = task.link;

  if (task.referral_code) {
    document.getElementById("refBox").innerHTML = `
      <p><b>Referral Code</b></p>
      <input id="refCode" value="${task.referral_code}" readonly>
      <button onclick="copyCode()">Copy Code</button>
      <br><br>
    `;
  }

  if (task.proof_type === "Screenshot") {
    document.getElementById("proofArea").innerHTML =
      '<input type="file" id="proof" accept="image/*">';
  } else {
    document.getElementById("proofArea").innerHTML =
      `<input id="proof" placeholder="Enter ${task.proof_type}">`;
  }
}

function copyCode() {
  navigator.clipboard.writeText(task.referral_code);
  alert("Referral code copied!");
}

async function submitProof() {

  let proof = "";

  if (task.proof_type === "Screenshot") {

    const file = document.getElementById("proof").files[0];

    if (!file) {
      alert("Please select a screenshot");
      return;
    }

    const filename = Date.now() + "_" + file.name;

    const { error: uploadError } = await db.storage
      .from("proofs")
      .upload(filename, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { data } = db.storage
      .from("proofs")
      .getPublicUrl(filename);

    proof = data.publicUrl;

  } else {

    proof = document.getElementById("proof").value.trim();

    if (!proof) {
      alert("Please enter your proof");
      return;
    }
  }

  const { error } = await db.from("submissions").insert({
    user_id: user.id,
    task_id: Number(taskId),
    proof: proof,
    status: "pending"
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Task submitted successfully!");
  location.href = "tasks.html";
  }
