async function registerUser() {

const fullname = document.getElementById("fullname").value.trim();
const username = document.getElementById("username").value.trim().toLowerCase();
const email = document.getElementById("email").value.trim().toLowerCase();
const password = document.getElementById("password").value;
const currency = document.getElementById("currency").value;
const referral = document.getElementById("referral").value.trim().toUpperCase();

if (!fullname || !username || !email || !password || !currency){
alert("Please fill all required fields");
return;
}

const refCode = "ER" + Math.random().toString(36).substring(2,8).toUpperCase();

const { error } = await db.from("users").insert([{
fullname: fullname,
username: username,
email: email,
password: password,
currency: currency,
balance: 0,
ref_code: refCode,
referred_by: referral || null
}]);

if(error){
alert(error.message);
return;
}

alert("Account created successfully!");
location.href = "login.html";

  }
