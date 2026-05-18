const testPayload = {
  question: `System: You are the FacultyWise AI Scheduling Engine. 
The user wants to schedule a course. Check the request details for conflicts and output a JSON block wrapped in three backticks and the word "json" containing:
{
  "valid": true,
  "reason": "Clear explanation",
  "proposedEntry": {
    "courseId": "CS-202",
    "roomId": "room-001",
    "dayOfWeek": "Friday",
    "startTime": "10:00",
    "endTime": "11:30",
    "semester": "Spring 2026"
  }
}

Active schedules in DB: []
Available rooms in DB: []
Available courses in DB: []
Active user/teacher: Dr. John Smith

User request: "Please add a CS-202 class on Friday from 10:00 to 11:30 in Lab 101."`
};

async function run() {
  try {
    console.log("Sending request to local dev server http://localhost:3000/api/ai-test...");
    const response = await fetch("http://localhost:3000/api/ai-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });

    console.log("Status:", response.status);
    const json = await response.json();
    console.log("Response Body:", json);
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

run();
