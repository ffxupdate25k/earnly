const user=JSON.parse(localStorage.getItem("earnly_user"));

if(!user){
location.href="login.html";
}

document.getElementById("myCode").value=user.ref_code;

load();

async function load(){

const {data}=await db
.from("users")
.select("referral_earnings")
.eq("id",user.id)
.single();

document.getElementById("earn").innerText=
user.currency+" "+Number(data.referral_earnings).toFixed(2);

}

function copyCode(){

navigator.clipboard.writeText(user.ref_code);

alert("Referral code copied!");

}
