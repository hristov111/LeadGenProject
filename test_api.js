
const payload = {
    name: "Test User",
    phone: "0896897986",
    email: "test@example.com",
    consent: true,
    city: "Sofia",
    serviceType: "internet",
    usageIntent: "streaming",
    timeline: "now",
    budget: "30-60",
    source: "direct",
    formName: "step_by_step_conversion"
};

fetch("http://localhost:3000/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
})
    .then(res => res.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error(err));
