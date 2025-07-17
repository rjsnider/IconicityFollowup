// === 0. Initialize timeline and variables ===
childlanglabClient.init();
var jsPsych = initJsPsych({
  use_webaudio: false,
});

var timeline = [];
let score = 0;
let history = [];
let experimentStartTime = Date.now();
let timeoutStarted = false;

const urlParams = new URLSearchParams(window.location.search);
const prolificID = urlParams.get("PROLIFIC_ID") || "";
jsPsych.data.addProperties({ PROLIFIC_ID: prolificID });

// === 1. Consent Form ===
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
     <div style="text-align:left; max-height:500px; overflow-y:auto; padding:10px; border:1px solid #ccc; font-family: Times, serif; font-size: 14px; width:60%; margin-left:20%;">
      <h3 style="text-align: center;"><b>Fruit Selection Task</b></h3>
      <p style="text-align: center;">Consent to participate in research study</p>
      <p><b>Primary Investigator:</b> Gareth Roberts, roban@upenn.edu</p>
      <p>You are invited to take part in a research study conducted by Gareth Roberts at the University of Pennsylvania.<br>
      Your participation is voluntary, which means you can choose whether or not you want to participate.<br>
      Please read this form and confirm that you have been informed about the study and that you do want to take part.</p>
      <p><b>What we are studying:</b> This is part of a larger study on how people learn and use language.</p>
      <p><b>Why you are being asked to participate:</b> You are a registered member of Prolific, and you have selected this study as a task you are interested in.</p>
      <p><b>What you will do:</b> You will see some images of fruits and vegetables and will be asked to categorize them.</p>
      <p><b>Risks:</b> The risks associated with this study are minimal. Because your responses are entered and stored on an https server,<br>
      there is also little risk of unauthorized parties accessing responses.</p>
      <p><b>Benefits:</b> Participating in this study will not benefit you directly. You may, however, enjoy contributing to the study of language.</p>
      <p><b>Ending your participation:</b> You can choose whether or not to participate in this study. If you decide to participate now but change your mind later, you may withdraw from the study at any time without any negative consequences. You can stop participating at any time by closing your browser window.</p>
      <p><b>Your rights:</b> Participation in this study is entirely <b>voluntary</b>. You may decline to participate or withdraw from the study at any time without any negative consequences.</p>
      <p><b>Confidentiality:</b> In order to keep your information safe, Prolific protects your personal information by assigning you an anonymous worker ID number and operating over a secure server. No identifiable information is revealed to our research team aside from this anonymous worker ID; nor do we solicit this information from you.</p>
      <p><b>Data use:</b> We may share your anonymized data with approved members of our research team, but your ID number will never be associated with any data that is shared. The overall results of this study may be published in scientific journals or discussed at academic conferences, but will never include your ID or any other personally identifying information.</p>
      <p><b>Compensation:</b> You will be paid according to the amount of time the study is expected to take.</p>
      <p><b>Questions?</b> If you have questions about the study, please contact Gareth Roberts by sending a message via Prolific.<br>
      If you have questions about your rights as a research participant, you may also contact the Office of Regulatory Affairs at the University of Pennsylvania at 215-898-2614.</p>
      <p><b>I agree to take part in this study.</b></p>
    </div>`,
  choices: ["I Agree"]
});

// === 2. Instructions Page ===
const instructionTexts = {
  iconic_log: `
    <div style="text-align:left; max-height:500px; overflow-y:auto; padding:10px; border:1px solid #ccc; font-family: Times, serif; font-size: 14px; width:60%; margin-left:20%;">
      <h3 style="text-align: center;"><b>Fruit Selection Task</b></h3>
      <p><b>Welcome!</b></p>
      <p>You will be playing a guessing game. In each round, you will see a set of six fruits and vegetables on the left of the screen. On the right of the screen you will see a color. Your job is to guess which fruit or vegetable you believe is being represented by the color. The set of six fruits and vegetables will always stay the same, but their relative positions on screen will change randomly each round.</p>
      <p>To make a guess, click on the picture of the fruit or vegetable you think the color represents. After you guess, you will be informed whether or not you guessed correctly, and what the correct answer is. If you guessed correctly, your score will increase.</p>
      <p>To help you out, there is a “Round Log” on the bottom right of the screen. As you move through the early rounds, your “Round Log” will update to record which color was paired with which fruit or vegetable, which you can use as a reminder. This will happen for a maximum of four of these pairs. Information in the Round Log will not change or disappear once it has appeared. Feel free to consult the Round Log as much or as little as you’d like.</p>
      <p>You will have up to 30 seconds to guess in each round, and the full game will last for 15 minutes. Good luck!</p>
    </div>`,
  noniconic_log: `
    <div style="text-align:left; max-height:500px; overflow-y:auto; padding:10px; border:1px solid #ccc; font-family: Times, serif; font-size: 14px; width:60%; margin-left:20%;">
      <h3 style="text-align: center;"><b>Fruit Selection Task</b></h3>
      <p><b>Welcome!</b></p>
      <p>You will be playing a guessing game. In each round, you will see a set of six fruits and vegetables on the left of the screen. On the right of the screen you will see a dot positioned within a rectangle. Your job is to guess which fruit or vegetable you believe is being represented by the dot position. The set of six fruits and vegetables will always stay the same, but their relative positions on screen will change randomly each round. Note that this means the position of the correct fruit/vegetable will not reliably correspond to the position of the dot within the square.</p>
      <p>To make a guess, click on the picture of the fruit or vegetable you think the dot represents. After you guess, you will be informed whether or not you guessed correctly, and what the correct answer is. If you guessed correctly, your score will increase.</p>
      <p>To help you out, there is a “Round Log” on the bottom right of the screen. As you move through the early rounds, your “Round Log” will update to record which dot position was paired with which fruit or vegetable, which you can use as a reminder. This will happen for a maximum of four of these pairs. Information in the Round Log will not change or disappear once it has appeared. Feel free to consult the Round Log as much or as little as you’d like.</p>
      <p>You will have up to 30 seconds to guess in each round, and the full game will last for 15 minutes. Good luck!</p>
    </div>`,
  iconic_nolog: `
    <div style="text-align:left; max-height:500px; overflow-y:auto; padding:10px; border:1px solid #ccc; font-family: Times, serif; font-size: 14px; width:60%; margin-left:20%;">
      <h3 style="text-align: center;"><b>Fruit Selection Task</b></h3>
      <p><b>Welcome!</b></p>
      <p>You will be playing a guessing game. In each round, you will see a set of six fruits and vegetables on the left of the screen. On the right of the screen you will see a color. Your job is to guess which fruit or vegetable you believe is being represented by the color. The set of six fruits and vegetables will always stay the same, but their relative positions on screen will change randomly each round.</p>
      <p>To make a guess, click on the picture of the fruit or vegetable you think the color represents. After you guess, you will be informed whether or not you guessed correctly, and what the correct answer is. If you guessed correctly, your score will increase.</p>
      <p>You will have up to 30 seconds to guess in each round, and the full game will last for 15 minutes. Good luck!</p>
    </div>`,
  noniconic_nolog: `
    <div style="text-align:left; max-height:500px; overflow-y:auto; padding:10px; border:1px solid #ccc; font-family: Times, serif; font-size: 14px; width:60%; margin-left:20%;">
      <h3 style="text-align: center;"><b>Fruit Selection Task</b></h3>
      <p><b>Welcome!</b></p>
      <p>You will be playing a guessing game. In each round, you will see a set of six fruits and vegetables on the left of the screen. On the right of the screen you will see a dot positioned within a rectangle. Your job is to guess which fruit or vegetable you believe is being represented by the dot position. The set of six fruits and vegetables will always stay the same, but their relative positions on screen will change randomly each round.</p>
      <p>Note that this means, the position of the correct fruit/vegetable will not reliably correspond to the position of the dot within the square.</p>
      <p>To make a guess, click on the picture of the fruit or vegetable you think the dot represents. After you guess, you will be informed whether or not you guessed correctly, and what the correct answer is. If you guessed correctly, your score will increase.</p>
      <p>You will have up to 30 seconds to guess in each round, and the full game will last for 15 minutes. Good luck!</p>
    </div>`
};

// === 3. Randomize Between-Subject Condition ===
const allConditions = ["iconic_nolog", "noniconic_nolog", "iconic_log", "noniconic_log"];
const condition = allConditions.find(c => window.location.href.includes(c)) ||
  jsPsych.randomization.sampleWithoutReplacement(allConditions, 1)[0];
jsPsych.data.addProperties({ condition });
console.log("🧪 Assigned condition:", condition);

// Inject appropriate instructions into timeline
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: instructionTexts[condition] || "<p>Unknown condition.</p>",
  choices: ["Start"],
});


// === 4. Fruit and Signal URLs ===
const fruits = [
  { name: "banana", url: "https://github.com/pkakla/Iconicity/blob/main/banana.png?raw=true" },
  { name: "kiwi", url: "https://github.com/pkakla/Iconicity/blob/main/kiwi.png?raw=true" },
  { name: "orange", url: "https://github.com/pkakla/Iconicity/blob/main/orange.png?raw=true" },
  { name: "strawberry", url: "https://github.com/pkakla/Iconicity/blob/main/strawberry.png?raw=true" },
  { name: "blueberry", url: "https://github.com/pkakla/Iconicity/blob/main/blueberry.png?raw=true" },
  { name: "eggplant", url: "https://github.com/pkakla/Iconicity/blob/main/eggplant.png?raw=true" }
];

const signalMap = {};
[
  "banana_color_9", "banana_color_17", "banana_color_20",
  "banana_dot_9", "banana_dot_17", "banana_dot_20",
  "blueberry_color_3", "blueberry_color_14", "blueberry_color_16",
  "blueberry_dot_3", "blueberry_dot_14", "blueberry_dot_16",
  "eggplant_color_1", "eggplant_color_21", "eggplant_color_23",
  "eggplant_dot_1", "eggplant_dot_21", "eggplant_dot_23",
  "kiwi_color_5", "kiwi_color_7", "kiwi_color_11",
  "kiwi_dot_5", "kiwi_dot_7", "kiwi_dot_11",
  "orange_color_4", "orange_color_12", "orange_color_13",
  "orange_dot_4", "orange_dot_12", "orange_dot_13",
  "strawberry_color_6", "strawberry_color_18", "strawberry_color_19",
  "strawberry_dot_6", "strawberry_dot_18", "strawberry_dot_19"
].forEach(name => {
  signalMap[`${name}.png`] = `https://raw.githubusercontent.com/pkakla/Iconicity/refs/heads/main/${name}.png?raw=true`;
});

// === 5. Trial Parameters ===
const signalType = condition.startsWith("iconic") ? "color" : "dot";
const targetFruitsSubset = jsPsych.randomization.sampleWithoutReplacement(
  fruits.map(f => f.name), 4
);
console.log("✅ Log will track:", JSON.stringify(targetFruitsSubset));

// === Update log styles ===
const LOG_HEIGHT = 480 * 2;  // 1.5x default
const LOG_IMAGE_SIZE = 40 * 3; // 2x image size

// === Make this available globally for log styling ===
window.LOG_HEIGHT = LOG_HEIGHT;
window.LOG_IMAGE_SIZE = LOG_IMAGE_SIZE;

// === Move panels to the left ===
window.PANEL_LAYOUT_STYLE = "display:flex; justify-content:flex-start; gap:80px; align-items:flex-start;";

// === Update log HTML image size ===
window.getLogHTML = function(filteredLog, fruits) {
  return `<div id="logBox" style="border:1px solid #ccc; padding:20px; background:#fff; font-size:24px; max-height:960px; overflow-y:auto;">
    <strong style="display:block; margin-bottom:5px;">Round Log</strong>
    ${
      filteredLog.map(h => {
        const correct = fruits.find(f => f.name === h.target);
        return `<img src="${h.signal}" width="${LOG_IMAGE_SIZE}"> → 
                ${correct ? `<img src="${correct.url}" width="${LOG_IMAGE_SIZE}">` : `<span>❓ Missing</span>`}<br>`;
      }).join("") || "— No responses yet —"
    }
  </div>`;
};


// === 6. Generate trials ===
function generateTrial() {
  const fruit = jsPsych.randomization.sampleWithoutReplacement(fruits, 1)[0];
  const options = Object.keys(signalMap).filter(key =>
    key.startsWith(fruit.name) && key.includes(signalType)
  );
  const signal = jsPsych.randomization.sampleWithoutReplacement(options, 1)[0];
  const signalURL = signalMap[signal];

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      const shuffled = jsPsych.randomization.shuffle(fruits);
      // const fruitHTML = shuffled.map(f =>
      //   `<img src="${f.url}" data-fruit="${f.name}" style="margin:5px; cursor:pointer; border: 2px solid transparent; max-width:100px;               height:auto;">`
      // ).join("");
      const topRow = shuffled.slice(0, 4).map(f =>
        `<img src="${f.url}" data-fruit="${f.name}" style="margin:5px; cursor:pointer; border: 2px solid transparent; max-width:100px; height:auto;">`
      ).join("");

      const bottomRow = shuffled.slice(4).map(f =>
        `<img src="${f.url}" data-fruit="${f.name}" style="margin:5px; cursor:pointer; border: 2px solid transparent; max-width:100px; height:auto;">`
      ).join("");

      const fruitHTML = `
        <div style="display: flex; justify-content: center; margin-bottom: 10px;">${topRow}</div>
        <div style="display: flex; justify-content: center;">${bottomRow}</div>
      `;

      const seenTargets = new Set();
      const filteredLog = history.filter(h => {
        return h.display && targetFruitsSubset.includes(h.target) && !seenTargets.has(h.target) && seenTargets.add(h.target);
      });

      const logHTML = condition.includes("nolog") ? "" : `
        <div id="logBox" style="border:1px solid #ccc; padding:20px; background:#fff; font-size:24px; max-height:960px; overflow-y:auto;">
          <strong>Round Log</strong><br>
          ${
            filteredLog.map(h => {
              const correct = fruits.find(f => f.name === h.target);
              return `<img src="${h.signal}" width="${LOG_IMAGE_SIZE}"> → 
                ${correct ? `<img src="${correct.url}" width="${LOG_IMAGE_SIZE}">` : `<span>❓ Missing</span>`}<br>`;

            }).join("") || "— No responses yet —"
          }
        </div>`;

      return `
        <div style="display: flex; width: 100%; height: 100%;">
          <div style="width: 65%; padding-right: 20px;">
            <div style="display:flex; justify-content:space-between;">
              <div>${fruitHTML}</div>
              <div style="text-align:right;">
                <img src="${signalURL}" width="150"><br>
                <p><b>Score:</b> ${score}</p>
                <p><b>⏳ <span id="countdown">30</span></b></p>
              </div>
            </div>
            <div style="width:100%; text-align:center; margin:10px 0;" id="feedback"></div>
          </div>
          <div style="width: 35%; overflow-y:auto;">
            ${logHTML}
          </div>
        </div>
      `;
    },
    choices: [],
    trial_duration: null,
    on_start: () => {
      if (!timeoutStarted) {
        timeoutStarted = true;
        setTimeout(() => {
          let data = jsPsych.data.get().json();
          childlanglabClient.sendData(data);
          console.log("Sent data object to childlanglab-api");
          jsPsych.endExperiment(
            "Time's up! Thank you for participating!<br><br>" +
        '<a href="https://app.prolific.co/submissions/complete?cc=YOUR_COMPLETION_CODE">' +
        'Click here to return to Prolific</a>'
          );
        }, 15 * 60 * 1000); // 15 minutes
      }
    },
    on_load: function () {
      const imgs = document.querySelectorAll("img[data-fruit]");
      const fb = document.getElementById("feedback");
      const c = document.getElementById("countdown");
      const logDiv = document.getElementById("logBox");
      if (logDiv) logDiv.scrollTop = logDiv.scrollHeight;

      let t = 30;
      let trialOver = false;
      const correctFruit = fruits.find(f => f.name === fruit.name);

      const endTrial = (choice, correct) => {
        if (trialOver) return;
        trialOver = true;
        clearInterval(timer);

        imgs.forEach(i => {
          i.style.pointerEvents = "none";
          i.style.opacity = "0.6";
          if (i.getAttribute("data-fruit") === choice) {
            i.style.border = `4px solid ${correct ? "green" : "red"}`;
          }
        });

        fb.innerHTML = choice === "timeout"
          ? `<p style="color:red; font-size:18px;">⏰ Time's up! The correct answer was:</p><img src="${correctFruit.url}" width="80">`
          : correct
            ? `<p style="color:green; font-size:18px;">✅ Correct!</p>`
            : `<p style="color:red; font-size:18px;">❌ Incorrect! The correct answer was:</p><img src="${correctFruit.url}" width="80">`;

        history.push({
          choice, correct,
          target: fruit.name,
          signal: signalURL,
          display: targetFruitsSubset.includes(fruit.name)
        });

        setTimeout(() => {
          jsPsych.finishTrial({ choice, correct, target: fruit.name });
        }, 2000);
      };

      const timer = setInterval(() => {
        t--;
        if (c) c.textContent = t;
        if (t <= 0) endTrial("timeout", false);
      }, 1000);

      imgs.forEach(img => {
        img.addEventListener("click", function () {
          if (trialOver) return;
          const choice = this.getAttribute("data-fruit");
          const correct = choice === fruit.name;
          if (correct) score++;
          endTrial(choice, correct);
        });
      });
    }
  };
}

// === 7. Build trials ===
// Allow for many trials
for (let i = 0; i < 9999; i++) {
  timeline.push(generateTrial());
}

// === 8. Start experiment ===
jsPsych.run(timeline);
