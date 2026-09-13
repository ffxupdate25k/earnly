const user=JSON.parse(localStorage.getItem("earnly_user"));

const taskId=localStorage.getItem("current_task");

let task={};

loadTask();

async function loadTask(){

const {data}=await db
.from("tasks")
.select("*")
.eq("id",taskId)
.single();

task=data;

title.innerText=data.title;

desc.innerText=data.description;

taskLink.href=data.link;

if(data.referral_code){

refBox.innerHTML=`
<p><b>Referral Code</b></p>

<input value="${data.referral_code}" readonly>

<button onclick="copyCode()">Copy Code</button>
`;

}

if(data.proof_type==="Screenshot"){

proofArea.innerHTML=`
<input type="file" id="proof">
`;

}

if(data.proof_type==="Telegram ID"){

proofArea.innerHTML=`
<input id="proof" placeholder="Enter Telegram ID">
`;

}

if(data.proof_type==="Username"){

proofArea.innerHTML=`
<input id="proof" placeholder="Enter Username">
`;

}

if(data.proof_type==="Phone"){

proofArea.innerHTML=`
<input id="proof" placeholder="Enter Phone Number">
`;

}

}

function copyCode(){

navigator.clipboard.writeText(task.referral_code);

alert("Copied");

}

async function submitProof(){

let value=document.getElementById("proof").value;

const {error}=await db.from("submissions").insert({

user_id:user.id,

task_id:Number(taskId),

proof:value,

status:"pending"

});

if(error){

alert(error.message);

return;

}

alert("Proof submitted successfully!");

location.href="tasks.html";

  }
