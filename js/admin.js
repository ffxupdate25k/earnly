const admin=JSON.parse(localStorage.getItem("earnly_user"));

if(!admin || admin.email!=="azeemolajuwon25@gmail.com"){
location.href="dashboard.html";
}

show("overview");

async function show(page){

if(page==="overview"){

const {count:users}=await db
.from("users")
.select("*",{count:"exact",head:true});

const {count:tasks}=await db
.from("tasks")
.select("*",{count:"exact",head:true});

const {count:subs}=await db
.from("submissions")
.select("*",{count:"exact",head:true})
.eq("status","pending");

content.innerHTML=`
<div class="card">
<h2>Overview</h2>

<p>Total Users: ${users}</p>

<p>Live Tasks: ${tasks}</p>

<p>Pending Submissions: ${subs}</p>

</div>`;
}

if(page==="tasks"){

content.innerHTML=`
<div class="card">

<h2>Create Task</h2>

<input id="t1" placeholder="Task Title">

<textarea id="t2" placeholder="Description"></textarea>

<input id="t3" placeholder="Reward">

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

}

async function createTask(){

await db.from("tasks").insert({

title:t1.value,

description:t2.value,

reward:Number(t3.value),

link:t4.value,

referral_code:t5.value,

proof_type:t6.value,

active:true

});

alert("Task Created");

show("tasks");

}

async function loadSubs(){

const {data}=await db
.from("submissions")
.select(`
id,
proof,
status,
users(fullname),
tasks(title,reward)
`)
.eq("status","pending");

let html="";

data.forEach(s=>{

html+=`
<div class="card">

<h3>${s.tasks.title}</h3>

<p>${s.users.fullname}</p>

<a href="${s.proof}" target="_blank">
View Proof
</a>

<button onclick="approve(${s.id})">
Approve
</button>

</div>`;
});

content.innerHTML=html;

}

async function approve(id){

await db
.from("submissions")
.update({status:"approved"})
.eq("id",id);

alert("Approved");

loadSubs();

  }
