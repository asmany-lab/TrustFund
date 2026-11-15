
console.log("Welcome to TrustFund!");
console.log("Every Donation Accounted For.");

function donateNow() {
    alert("Welcome to TrustFund Donation System!");
}

const donationForm = document.getElementById("donationForm");

if (donationForm) {
    donationForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("donorName").value;
        const email = document.getElementById("donorEmail").value;
        const campaign = document.getElementById("campaign").value;
        const amount = document.getElementById("amount").value;

        try {
            const response = await fetch("/api/donate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    campaign,
                    amount
                })
            });

            const result = await response.json();

            alert(result.message);

            if (response.ok) {
                donationForm.reset();
            }

        } catch (error) {
            alert("Server connection failed!");
            console.log(error);
        }
    });
}
