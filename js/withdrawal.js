const user = JSON.parse(localStorage.getItem("earnly_user"));

if(!user) location.href="login.html";

document.getElementById("balance").innerText =
user.currency+" "+Number(user.balance).toFixed(2);

buildWallet();

function buildWallet(){

if(user.currency==="NGN"){

walletTitle.innerText="Save Bank Account";

walletForm.innerHTML=`
<input id="account" placeholder="Account Number">

<select id="bank">
<option value="">Select Bank</option>
<option value="100033">Palmpay</option>
<option value="100004">Opay</option>
<option value="50515">Moniepoint</option>
<option value="058">GTBank</option>
<option value="033">UBA</option>
<option value="044">Access Bank</option>
<option value="011">First Bank</option>
</select>

<button onclick="verifyBank()">
Verify Account
</button>

<div id="verified"></div>
`;

}else{

walletTitle.innerText="Save "+user.currency+" Wallet";

walletForm.innerHTML=`
<input id="wallet" placeholder="Enter ${user.currency} Wallet Address">
`;

}

}

async function verifyBank(){

const acct=document.getElementById("account").value;
const bank=document.getElementById("bank").value;

const res=await fetch(
"https://api.korapay.com/merchant/api/v1/misc/banks/resolve",
{
method:"POST",
headers:{
Authorization:"Bearer YOUR_KORA_TEST_KEY",
"Content-Type":"application/json"
},
body:JSON.stringify({
bank:bank,
account:acct,
currency:"NGN"
})
}
);

const r=await res.json();

if(r.status){

verified.innerHTML=`
<p>✅ ${r.data.account_name}</p>

<button onclick="saveBank(
'${r.data.account_name}',
'${r.data.account_number}',
'${r.data.bank_name}'
)">
Save Bank
</button>
`;

}else{

alert(r.message);

}

}

async function saveBank(name,number,bank){

await db.from("users")
.update({
wallet:`${name}|${number}|${bank}`
})
.eq("id",user.id);

alert("Bank Saved");

}

async function applyWithdraw(){

const amount=Number(amount.value);

let wallet="";

if(user.currency==="NGN"){

const {data}=await db
.from("users")
.select("wallet")
.eq("id",user.id)
.single();

wallet=data.wallet;

}else{

wallet=document.getElementById("wallet").value;

}

await db.from("withdrawals").insert({

user_id:user.id,

currency:user.currency,

amount:amount,

wallet:wallet,

status:"pending"

});

statusBox.innerHTML=`
<div class="card">

<h3>🟡 Connecting To Payout Server</h3>

<p>Your withdrawal request has been received.</p>

</div>`;

  }
