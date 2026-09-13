const user = JSON.parse(localStorage.getItem("earnly_user"));

if(!user){
location.href="login.html";
}

document.getElementById("currency").innerText=user.currency;

loadTasks();

async function loadTasks(){

const {data,error}=await db
.from("tasks")
.select("*")
.eq("active",true)
.order("id",{ascending:false});

if(error){
return;
}

let html="";

if(data.length===0){
html=`
<div class="card">
<h3>No Live Tasks</h3>
<p>Admin hasn't published any task yet.</p>
</div>`;
}

data.forEach(task=>{

html+=`
<div class="card">

<h3>${task.title}</h3>

<p>${task.description.substring(0,80)}...</p>

<h2>${user.currency} ${task.reward}</h2>

<button onclick="openTask(${task.id})">
Perform Task
</button>

</div>`;
});

document.getElementById("taskList").innerHTML=html;

}

function openTask(id){
localStorage.setItem("current_task",id);
location.href="task-details.html";
}
