async function loginUser(){

const email=document.getElementById("email").value.trim().toLowerCase();
const password=document.getElementById("password").value;

if(!email || !password){
alert("Enter email and password");
return;
}

const {data,error}=await db
.from("users")
.select("*")
.eq("email",email)
.eq("password",password)
.single();

if(error || !data){
alert("Invalid login details");
return;
}

localStorage.setItem("earnly_user",JSON.stringify(data));

window.location="dashboard.html";

}
