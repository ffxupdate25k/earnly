const admin = JSON.parse(localStorage.getItem("earnly_user"));

if (!admin || admin.email !== "azeemolajuwon25@gmail.com") {
  location.href = "dashboard.html";
}

const content = document.getElementById("content");

show("overview");

async function show(page){

  if(page==="overview"){
    const {count:users}=await db.from("users").select("*",{count:"exact",head:true});
    const {count:tasks}=await db.from("tasks").select("*",{count:"exact",head:true}).eq("active",true);
    const {count:subs}=await db.from("submissions").select("*",{count:"exact",head:true}).eq("status","pending");

    content.innerHTML=`
      <div class="card">
        <h2>Overview</h2>
        <p>👥 Total Users: ${users}</p>
        <p>📋 Live Tasks: ${tasks}</p>
        <p>📷 Pending Reviews: ${subs}</p>
      </div>`;
  }

  if(page==="tasks"){
    content.innerHTML=`
      <div class="card">
        <h2>Create Task</h2>

        <input id="t1" placeholder="Task Title">

        <textarea id="t2" placeholder="Task Description"></textarea>

        <input id="t3" type="number" placeholder="Reward">

        <input id="t4" placeholder="Task Link">

        <input id="t5" placeholder="Referral Code (Optional)">

        <select id="t6">
          <option>Screenshot</option>
          <option>Telegram ID</option>
          <option>Username</option>
          <option>Phone</option>
        </select>

        <button onclick="createTask()">Create Task</button>
      </div>`;
  }

  if(page==="subs"){
    loadSubs();
  }

  if(page==="users"){
    loadUsers();
  }

  if(page==="settings"){
    loadSettings();
  }
}

async function createTask(){

  const {error}=await db.from("tasks").insert({
    title:t1.value,
    description:t2.value,
    reward:Number(t3.value),
    link:t4.value,
    referral_code:t5.value,
    proof_type:t6.value,
    active:true
  });

  if(error){
    alert(error.message);
    return;
  }

  alert("Task Created");
  show("tasks");
}

async function loadSubs(){

  const {data}=await db.from("submissions").select(`
    id,
    proof,
    user_id,
    users(fullname,referred_by),
    tasks(title,reward)
  `).eq("status","pending");

  let html="";

  if(!data || data.length===0){
    html=`<div class="card"><h3>No Pending Submission</h3></div>`;
  }

  data.forEach(s=>{
    html+=`
      <div class="card">
        <h3>${s.tasks.title}</h3>
        <p>👤 ${s.users.fullname}</p>
        <p>💰 Reward: ${s.tasks.reward}</p>

        <a href="${s.proof}" target="_blank">View Proof</a>

        <button onclick="approve(${s.id})">✅ Approve</button>
        <button class="danger" onclick="decline(${s.id})">❌ Decline</button>
      </div>`;
  });

  content.innerHTML=html;
}

async function approve(id){

  const {data:sub}=await db.from("submissions").select(`
    user_id,
    users(referred_by),
    tasks(reward)
  `).eq("id",id).single();

  const reward=Number(sub.tasks.reward);

  const {data:user}=await db.from("users").select("balance").eq("id",sub.user_id).single();

  await db.from("users").update({
    balance:Number(user.balance)+reward
  }).eq("id",sub.user_id);

  if(sub.users.referred_by){

    const {data:ref}=await db.from("users").select("id,balance,referral_earnings").eq("ref_code",sub.users.referred_by).single();

    if(ref){
      const bonus=reward*0.10;

      await db.from("users").update({
        balance:Number(ref.balance)+bonus,
        referral_earnings:Number(ref.referral_earnings)+bonus
      }).eq("id",ref.id);
    }
  }

  await db.from("submissions").update({
    status:"approved",
    reviewed_at:new Date().toISOString()
  }).eq("id",id);

  alert("Task Approved");
  loadSubs();
}

async function decline(id){

  await db.from("submissions").update({
    status:"declined",
    reviewed_at:new Date().toISOString()
  }).eq("id",id);

  alert("Submission Declined");
  loadSubs();
}

async function loadUsers(){

  const {data}=await db.from("users").select("*").order("created_at",{ascending:false});

  let html="<div class='card'><h2>Users</h2></div>";

  data.forEach(u=>{
    html+=`
      <div class="card">
        <h3>${u.fullname}</h3>
        <p>${u.email}</p>
        <p>${u.currency} ${Number(u.balance).toFixed(2)}</p>
      </div>`;
  });

  content.innerHTML=html;
}

async function loadSettings(){

  const {data}=await db.from("settings").select("*").eq("id",1).single();

  content.innerHTML=`
    <div class="card">

      <h2>Settings</h2>

      <label>1 USD = NGN</label>
      <input id="usd" value="${data.usd_ngn}">

      <label>1 TON = USD</label>
      <input id="ton" value="${data.ton_usd}">

      <label>1 BNB = USD</label>
      <input id="bnb" value="${data.bnb_usd}">

      <label>Minimum NGN</label>
      <input id="mngn" value="${data.min_ngn}">

      <label>Minimum USD</label>
      <input id="musd" value="${data.min_usd}">

      <label>Minimum TON</label>
      <input id="mton" value="${data.min_ton}">

      <label>Minimum BNB</label>
      <input id="mbnb" value="${data.min_bnb}">

      <label>PT API Key</label>
      <input id="pt" value="${data.pt_api_key||''}">

      <label>TON Comment</label>
      <input id="tc" value="${data.ton_comment}">

      <label>BNB Comment</label>
      <input id="bc" value="${data.bnb_comment}">

      <label>Auto Open</label>
      <input id="ao" type="time" value="${data.auto_open}">

      <label>Auto Close</label>
      <input id="ac" type="time" value="${data.auto_close}">

      <button onclick="saveSettings()">Save Settings</button>

    </div>`;
}

async function saveSettings(){

  await db.from("settings").update({
    usd_ngn:Number(usd.value),
    ton_usd:Number(ton.value),
    bnb_usd:Number(bnb.value),
    min_ngn:Number(mngn.value),
    min_usd:Number(musd.value),
    min_ton:Number(mton.value),
    min_bnb:Number(mbnb.value),
    pt_api_key:pt.value,
    ton_comment:tc.value,
    bnb_comment:bc.value,
    auto_open:ao.value,
    auto_close:ac.value
  }).eq("id",1);

  alert("Settings Saved");
                  }    content.innerHTML = `
      <div class="card">
        <h2>Users</h2>
        <p>User management coming next.</p>
      </div>`;
  }

  if (page === "settings") {
    content.innerHTML = `
      <div class="card">
        <h2>Settings</h2>
        <p>Rates & withdrawal settings coming next.</p>
      </div>`;
  }

}

async function createTask() {

  const { error } = await db.from("tasks").insert({
    title: t1.value,
    description: t2.value,
    reward: Number(t3.value),
    link: t4.value,
    referral_code: t5.value,
    proof_type: t6.value,
    active: true
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Task Created Successfully!");
  show("tasks");
}

async function loadSubs() {

  const { data } = await db
    .from("submissions")
    .select(`
      id,
      proof,
      user_id,
      users(fullname,referred_by),
      tasks(title,reward)
    `)
    .eq("status", "pending");

  let html = "";

  if (!data || data.length === 0) {
    html = `
      <div class="card">
        <h3>No Pending Submission</h3>
      </div>`;
  }

  data.forEach(s => {

    html += `
      <div class="card">

        <h3>${s.tasks.title}</h3>

        <p>👤 ${s.users.fullname}</p>

        <p>💰 Reward: ${s.tasks.reward}</p>

        <a href="${s.proof}" target="_blank">View Proof</a>

        <button onclick="approve(${s.id})">
          ✅ Approve
        </button>

        <button class="danger" onclick="decline(${s.id})">
          ❌ Decline
        </button>

      </div>`;
  });

  content.innerHTML = html;
}

async function approve(id) {

  const { data: sub } = await db
    .from("submissions")
    .select(`
      user_id,
      users(referred_by),
      tasks(reward)
    `)
    .eq("id", id)
    .single();

  const reward = Number(sub.tasks.reward);

  const { data: user } = await db
    .from("users")
    .select("balance")
    .eq("id", sub.user_id)
    .single();

  await db
    .from("users")
    .update({
      balance: Number(user.balance) + reward
    })
    .eq("id", sub.user_id);

  if (sub.users.referred_by) {

    const { data: ref } = await db
      .from("users")
      .select("id,balance,referral_earnings")
      .eq("ref_code", sub.users.referred_by)
      .single();

    if (ref) {

      const bonus = reward * 0.10;

      await db
        .from("users")
        .update({
          balance: Number(ref.balance) + bonus,
          referral_earnings:
            Number(ref.referral_earnings) + bonus
        })
        .eq("id", ref.id);
    }
  }

  await db
    .from("submissions")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString()
    })
    .eq("id", id);

  alert("Task Approved!");
  loadSubs();
}

async function decline(id) {

  await db
    .from("submissions")
    .update({
      status: "declined",
      reviewed_at: new Date().toISOString()
    })
    .eq("id", id);

  alert("Submission Declined");
  loadSubs();
       }
