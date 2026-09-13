const user=JSON.parse(localStorage.getItem("earnly_user"));

if(!user){
location.href="login.html";
}

document.getElementById("name").innerText=user.fullname;
document.getElementById("currency").innerText=user.currency;
document.getElementById("balance").innerText=
user.currency+" "+Number(user.balance).toFixed(2);

if(user.email==="azeemolajuwon25@gmail.com"){
document.getElementById("adminBtn").style.display="block";
}
