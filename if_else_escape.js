const MAX_LIVES = 3;
const LEADERBOARD_KEY = "if_else_escape_leaderboard";

const LEVEL_CONFIG = {
  1: { label: "Level 1 – Intro CS", multiplier: 1 },
  2: { label: "Level 2 – AP CSP", multiplier: 2 },
  3: { label: "Level 3 – AP CSA", multiplier: 3 },
  4: { label: "Level 4 – Honors DSA", multiplier: 4 },
  5: { label: "Level 5 – College CS", multiplier: 5 },
};

const STORY_LEVELS = {
  1: {
    id: 1,
    name: "Intro to CS",
    startSceneId: "bus-stop",
    scenes: {
      "bus-stop": {
        id: "bus-stop",
        storyText:
          "Your school day begins at the bus stop. The bus is running late, and you need to decide what to do so you still make first period.",
        options: [
          {
            id: "wait-bus",
            displayText: "if (busArrived) { boardBus(); } else { checkAnnouncements(); }",
            nextSceneId: "announcement",
            isCorrect: true,
            outcomeText: "You check the announcements while you wait and see the updated arrival time.",
          },
          {
            id: "walk-school",
            displayText: "if (busArrived) { boardBus(); } else { startWalking(); }",
            nextSceneId: "late-hall",
            isCorrect: false,
            outcomeText: "You start walking, but the bell rings before you reach campus.",
            isFailure: true,
          },
        ],
      },
      announcement: {
        id: "announcement",
        storyText:
          "You get a message that first period is doing a short warm-up. You can enter quietly or check in with the teacher first.",
        options: [
          {
            id: "enter-quietly",
            displayText: "if (hasPass) { enterQuietly(); } else { askTeacher(); }",
            nextSceneId: "warmup",
            isCorrect: false,
            outcomeText: "Without a pass, the teacher stops you at the door.",
            isFailure: true,
          },
          {
            id: "check-in",
            displayText: "if (hasPass) { enterQuietly(); } else { askTeacher(); }",
            nextSceneId: "warmup",
            isCorrect: true,
            outcomeText: "You check in and get the warm-up instructions.",
          },
        ],
      },
      warmup: {
        id: "warmup",
        storyText:
          "You reach the warm-up challenge. The prompt says: submit if your answer is complete, otherwise ask a partner.",
        isCheckpoint: true,
        checkpointLabel: "Warm-up complete",
        options: [
          {
            id: "submit",
            displayText: "if (answerComplete) { submit(); } else { askPartner(); }",
            nextSceneId: "team-up",
            isCorrect: true,
            outcomeText: "Your answer is complete, and you submit before the timer ends.",
          },
          {
            id: "ask-partner",
            displayText: "if (answerComplete) { submit(); } else { askPartner(); }",
            nextSceneId: "team-up",
            isCorrect: false,
            outcomeText: "You ask a partner even though your answer is ready, slowing things down.",
          },
        ],
      },
      "team-up": {
        id: "team-up",
        storyText:
          "Your teacher assigns a pair activity. You can lead, or you can listen for your partner's plan first.",
        options: [
          {
            id: "lead",
            displayText: "if (partnerReady) { sharePlan(); } else { askQuestions(); }",
            nextSceneId: "code-lab",
            isCorrect: false,
            outcomeText: "You start explaining before your partner is ready.",
          },
          {
            id: "listen",
            displayText: "if (partnerReady) { sharePlan(); } else { askQuestions(); }",
            nextSceneId: "code-lab",
            isCorrect: true,
            outcomeText: "You ask a few questions and align on the plan.",
          },
          {
            id: "solo",
            displayText: "if (partnerReady) { sharePlan(); } else { askQuestions(); }",
            nextSceneId: "off-track",
            isCorrect: false,
            outcomeText: "You rush ahead solo and miss the assigned task.",
            isFailure: true,
          },
        ],
      },
      "code-lab": {
        id: "code-lab",
        storyText:
          "In the lab, you must decide if your code is ready for the demo.",
        options: [
          {
            id: "run-tests",
            displayText: "if (testsGreen && demoReady) { present(); } else { fixBug(); }",
            nextSceneId: "class-demo",
            isCorrect: true,
            outcomeText: "Your tests are green, and you confidently present.",
          },
          {
            id: "present-early",
            displayText: "if (testsGreen && demoReady) { present(); } else { fixBug(); }",
            nextSceneId: "bug-hunt",
            isCorrect: false,
            outcomeText: "A small bug appears on the projector.",
          },
        ],
      },
      "bug-hunt": {
        id: "bug-hunt",
        storyText:
          "The bug is small but visible. Decide how to respond in front of the class.",
        options: [
          {
            id: "acknowledge",
            displayText: "if (stayCalm) { explainFix(); } else { stopDemo(); }",
            nextSceneId: "class-demo",
            isCorrect: true,
            outcomeText: "You explain the fix and earn respect.",
          },
          {
            id: "panic",
            displayText: "if (stayCalm) { explainFix(); } else { stopDemo(); }",
            nextSceneId: "off-track",
            isCorrect: false,
            outcomeText: "You stop mid-demo and need to restart later.",
            isFailure: true,
          },
        ],
      },
      "class-demo": {
        id: "class-demo",
        storyText:
          "The class demo ends with applause. You can celebrate with your partner or write a quick reflection.",
        isEnding: true,
        options: [
          {
            id: "celebrate",
            displayText: "if (teamProud) { highFive(); } else { reflect(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You celebrate the win and wrap up the day.",
          },
          {
            id: "reflect",
            displayText: "if (teamProud) { highFive(); } else { reflect(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You jot down notes to improve next time.",
          },
        ],
      },
      "late-hall": {
        id: "late-hall",
        storyText:
          "You arrive after the bell and have to restart the morning plan.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "retry-morning",
            displayText: "if (tryAgain) { resetDay(); } else { resetDay(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You head back to the start of the day.",
          },
        ],
      },
      "off-track": {
        id: "off-track",
        storyText:
          "You went off track and need to regroup before trying again.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "regroup",
            displayText: "if (regroup) { reset(); } else { reset(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You reset and try again.",
          },
        ],
      },
    },
  },
  2: {
    id: 2,
    name: "AP CSP",
    startSceneId: "club-briefing",
    scenes: {
      "club-briefing": {
        id: "club-briefing",
        storyText:
          "Your CS club is prepping a community tech night. You need to assign roles quickly so the team stays organized.",
        options: [
          {
            id: "assign-roles",
            displayText: "if (volunteersReady) { assignRoles(); } else { listTasks(); }",
            nextSceneId: "planning-board",
            isCorrect: true,
            outcomeText: "You list tasks and people choose roles confidently.",
          },
          {
            id: "wait-roles",
            displayText: "if (volunteersReady) { assignRoles(); } else { listTasks(); }",
            nextSceneId: "missed-start",
            isCorrect: false,
            outcomeText: "The team waits too long and setup time disappears.",
            isFailure: true,
          },
        ],
      },
      "planning-board": {
        id: "planning-board",
        storyText:
          "You update the planning board. You should post updates only if they are confirmed and approved.",
        options: [
          {
            id: "post-confirmed",
            displayText: "if (updateConfirmed && mentorApproved) { postUpdate(); } else { holdUpdate(); }",
            nextSceneId: "practice-run",
            isCorrect: true,
            outcomeText: "You post accurate updates and keep everyone aligned.",
          },
          {
            id: "post-early",
            displayText: "if (updateConfirmed && mentorApproved) { postUpdate(); } else { holdUpdate(); }",
            nextSceneId: "confusion",
            isCorrect: false,
            outcomeText: "A rushed update confuses the volunteers.",
          },
          {
            id: "hold",
            displayText: "if (updateConfirmed && mentorApproved) { postUpdate(); } else { holdUpdate(); }",
            nextSceneId: "practice-run",
            isCorrect: false,
            outcomeText: "You hold the update but forget to share it later.",
          },
        ],
      },
      "practice-run": {
        id: "practice-run",
        storyText:
          "The team runs a practice demo. You should proceed if devices are charged and the Wi-Fi is stable.",
        isCheckpoint: true,
        checkpointLabel: "Practice demo success",
        options: [
          {
            id: "go-live",
            displayText: "if (devicesCharged && wifiStable) { startDemo(); } else { troubleshoot(); }",
            nextSceneId: "community-night",
            isCorrect: true,
            outcomeText: "The demo runs smoothly and confidence goes up.",
          },
          {
            id: "troubleshoot",
            displayText: "if (devicesCharged && wifiStable) { startDemo(); } else { troubleshoot(); }",
            nextSceneId: "community-night",
            isCorrect: false,
            outcomeText: "You troubleshoot even though everything is ready, slowing momentum.",
          },
        ],
      },
      "community-night": {
        id: "community-night",
        storyText:
          "Guests arrive. You need to greet them only if the stations are staffed or you have a backup plan.",
        options: [
          {
            id: "greet",
            displayText: "if (stationsStaffed || backupPlanReady) { greetGuests(); } else { regroupTeam(); }",
            nextSceneId: "wrap-up",
            isCorrect: true,
            outcomeText: "You greet guests and keep the line moving.",
          },
          {
            id: "regroup",
            displayText: "if (stationsStaffed || backupPlanReady) { greetGuests(); } else { regroupTeam(); }",
            nextSceneId: "missed-start",
            isCorrect: false,
            outcomeText: "You regroup too long and the crowd thins out.",
            isFailure: true,
          },
        ],
      },
      "confusion": {
        id: "confusion",
        storyText:
          "The volunteers are unsure where to go. You need to reset the plan.",
        options: [
          {
            id: "clarify",
            displayText: "if (planClear && rolesSet) { continue(); } else { clarify(); }",
            nextSceneId: "practice-run",
            isCorrect: true,
            outcomeText: "You clarify roles and get back on track.",
          },
          {
            id: "push-ahead",
            displayText: "if (planClear && rolesSet) { continue(); } else { clarify(); }",
            nextSceneId: "missed-start",
            isCorrect: false,
            outcomeText: "You push ahead without clarity and lose time.",
            isFailure: true,
          },
        ],
      },
      "wrap-up": {
        id: "wrap-up",
        storyText:
          "The event ends. You can celebrate the teamwork or collect quick feedback.",
        isEnding: true,
        options: [
          {
            id: "celebrate",
            displayText: "if (feedbackNeeded) { collectNotes(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You celebrate and thank the team.",
          },
          {
            id: "feedback",
            displayText: "if (feedbackNeeded) { collectNotes(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You gather feedback for next time.",
          },
        ],
      },
      "missed-start": {
        id: "missed-start",
        storyText:
          "You miss the opening window and need to retry the event setup.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "restart",
            displayText: "if (retry) { resetPlan(); } else { resetPlan(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You reset to try again.",
          },
        ],
      },
    },
  },
  3: {
    id: 3,
    name: "AP CSA",
    startSceneId: "team-brief",
    scenes: {
      "team-brief": {
        id: "team-brief",
        storyText:
          "Your robotics team enters a tournament. You need to choose the right strategy before the first round starts.",
        options: [
          {
            id: "balanced",
            displayText: "if (batteryFull && sensorsReady) { runBalanced(); } else { runSafe(); }",
            nextSceneId: "first-round",
            isCorrect: true,
            outcomeText: "You choose a balanced route and keep options open.",
          },
          {
            id: "aggressive",
            displayText: "if (batteryFull && sensorsReady) { runBalanced(); } else { runSafe(); }",
            nextSceneId: "stall",
            isCorrect: false,
            outcomeText: "You push too hard and the robot stalls early.",
            livesChange: -1,
          },
          {
            id: "safe",
            displayText: "if (batteryFull && sensorsReady) { runBalanced(); } else { runSafe(); }",
            nextSceneId: "first-round",
            isCorrect: false,
            outcomeText: "You play it safe but fall behind in points.",
          },
        ],
      },
      "first-round": {
        id: "first-round",
        storyText:
          "Your bot reaches a fork. You should take the scoring lane only if the path is clear or you have a backup route.",
        options: [
          {
            id: "scoring-lane",
            displayText: "if (laneClear || backupRouteReady) { takeLane(); } else { reroute(); }",
            nextSceneId: "checkpoint-round",
            isCorrect: true,
            outcomeText: "You score quick points and stay on schedule.",
          },
          {
            id: "reroute",
            displayText: "if (laneClear || backupRouteReady) { takeLane(); } else { reroute(); }",
            nextSceneId: "checkpoint-round",
            isCorrect: false,
            outcomeText: "You reroute even though the lane is clear, losing time.",
          },
          {
            id: "wait",
            displayText: "if (laneClear || backupRouteReady) { takeLane(); } else { reroute(); }",
            nextSceneId: "stall",
            isCorrect: false,
            outcomeText: "Waiting too long costs you the round.",
            livesChange: -1,
          },
        ],
      },
      "checkpoint-round": {
        id: "checkpoint-round",
        storyText:
          "Round one is complete. The team debates whether to change the code or keep the successful run.",
        isCheckpoint: true,
        checkpointLabel: "Round 1 cleared",
        options: [
          {
            id: "keep-code",
            displayText: "if (testsPassed && robotStable) { keepCode(); } else { adjustCode(); }",
            nextSceneId: "debug-session",
            isCorrect: true,
            outcomeText: "You keep the stable code and prep for round two.",
          },
          {
            id: "adjust-code",
            displayText: "if (testsPassed && robotStable) { keepCode(); } else { adjustCode(); }",
            nextSceneId: "debug-session",
            isCorrect: false,
            outcomeText: "You change too much and need to debug quickly.",
          },
        ],
      },
      "debug-session": {
        id: "debug-session",
        storyText:
          "The sensors report mixed data. You should only recalibrate if the data is noisy and you have time remaining.",
        options: [
          {
            id: "recalibrate",
            displayText: "if (dataNoisy && timeRemaining) { recalibrate(); } else { runSafe(); }",
            nextSceneId: "final-round",
            isCorrect: true,
            outcomeText: "Quick recalibration steadies the bot.",
          },
          {
            id: "run-safe",
            displayText: "if (dataNoisy && timeRemaining) { recalibrate(); } else { runSafe(); }",
            nextSceneId: "final-round",
            isCorrect: false,
            outcomeText: "You skip calibration and risk shaky sensors.",
          },
          {
            id: "ignore",
            displayText: "if (dataNoisy && timeRemaining) { recalibrate(); } else { runSafe(); }",
            nextSceneId: "stall",
            isCorrect: false,
            outcomeText: "Ignoring the data causes a misread on the field.",
            livesChange: -1,
          },
        ],
      },
      "final-round": {
        id: "final-round",
        storyText:
          "Final round: you can attempt a bonus task if the robot is aligned and the timer is clear.",
        options: [
          {
            id: "bonus",
            displayText: "if (aligned && timerClear) { attemptBonus(); } else { securePoints(); }",
            nextSceneId: "celebrate",
            isCorrect: true,
            outcomeText: "You land the bonus task and win the match.",
          },
          {
            id: "secure",
            displayText: "if (aligned && timerClear) { attemptBonus(); } else { securePoints(); }",
            nextSceneId: "celebrate",
            isCorrect: false,
            outcomeText: "You secure safe points and still place well.",
          },
          {
            id: "rush",
            displayText: "if (aligned && timerClear) { attemptBonus(); } else { securePoints(); }",
            nextSceneId: "stall",
            isCorrect: false,
            outcomeText: "Rushing the bonus knocks the robot off course.",
            livesChange: -1,
          },
        ],
      },
      "celebrate": {
        id: "celebrate",
        storyText:
          "The judges announce the results. You can celebrate or thank the team mentors.",
        isEnding: true,
        options: [
          {
            id: "celebrate",
            displayText: "if (thankMentors) { thankMentors(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You celebrate the win together.",
          },
          {
            id: "thank",
            displayText: "if (thankMentors) { thankMentors(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You thank the mentors and take a team photo.",
          },
        ],
      },
      stall: {
        id: "stall",
        storyText:
          "The robot stalls and the round ends early. You need to reset your plan.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "reset",
            displayText: "if (resetSystem) { retryRound(); } else { retryRound(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You regroup and retry the round.",
          },
        ],
      },
    },
  },
  4: {
    id: 4,
    name: "Honors DSA",
    startSceneId: "hackathon-brief",
    scenes: {
      "hackathon-brief": {
        id: "hackathon-brief",
        storyText:
          "Your team is building a campus navigation app. You need to pick the right data structure to track open rooms.",
        options: [
          {
            id: "use-set",
            displayText: "if (needFastLookup && updatesFrequent) { useSet(); } else { useList(); }",
            nextSceneId: "check-in",
            isCorrect: true,
            outcomeText: "You pick a set for fast lookups and updates.",
          },
          {
            id: "use-list",
            displayText: "if (needFastLookup && updatesFrequent) { useSet(); } else { useList(); }",
            nextSceneId: "slow-query",
            isCorrect: false,
            outcomeText: "The list works, but lookups feel sluggish.",
          },
          {
            id: "use-stack",
            displayText: "if (needFastLookup && updatesFrequent) { useSet(); } else { useList(); }",
            nextSceneId: "slow-query",
            isCorrect: false,
            outcomeText: "A stack isn't ideal for fast membership checks.",
            livesChange: -1,
          },
        ],
      },
      "check-in": {
        id: "check-in",
        storyText:
          "Mentors arrive. You should demo only if the build is stable and the tests are clean.",
        options: [
          {
            id: "demo",
            displayText: "if (buildStable && testsClean) { demo(); } else { patch(); }",
            nextSceneId: "checkpoint-demo",
            isCorrect: true,
            outcomeText: "You deliver a clean demo and get positive feedback.",
          },
          {
            id: "patch",
            displayText: "if (buildStable && testsClean) { demo(); } else { patch(); }",
            nextSceneId: "checkpoint-demo",
            isCorrect: false,
            outcomeText: "You patch a small issue, delaying the demo.",
          },
        ],
      },
      "checkpoint-demo": {
        id: "checkpoint-demo",
        storyText:
          "Checkpoint reached! The team wants to add a new feature before the final presentation.",
        isCheckpoint: true,
        checkpointLabel: "Mentor demo complete",
        options: [
          {
            id: "feature-toggle",
            displayText: "if (featureScoped && deadlineClear) { addFeature(); } else { polishCore(); }",
            nextSceneId: "load-test",
            isCorrect: true,
            outcomeText: "You add the feature without breaking the core flow.",
          },
          {
            id: "polish",
            displayText: "if (featureScoped && deadlineClear) { addFeature(); } else { polishCore(); }",
            nextSceneId: "load-test",
            isCorrect: false,
            outcomeText: "You polish the core and keep the app stable.",
          },
          {
            id: "rush-feature",
            displayText: "if (featureScoped && deadlineClear) { addFeature(); } else { polishCore(); }",
            nextSceneId: "crash",
            isCorrect: false,
            outcomeText: "Rushing the feature introduces a crash.",
            livesChange: -1,
          },
        ],
      },
      "load-test": {
        id: "load-test",
        storyText:
          "Load testing reveals spikes. You should scale only if traffic is high or the cache is cold.",
        options: [
          {
            id: "scale",
            displayText: "if (trafficHigh || cacheCold) { scaleUp(); } else { monitor(); }",
            nextSceneId: "final-pitch",
            isCorrect: true,
            outcomeText: "You scale and the app stays responsive.",
          },
          {
            id: "monitor",
            displayText: "if (trafficHigh || cacheCold) { scaleUp(); } else { monitor(); }",
            nextSceneId: "final-pitch",
            isCorrect: false,
            outcomeText: "You monitor while the spikes subside.",
          },
        ],
      },
      "final-pitch": {
        id: "final-pitch",
        storyText:
          "Final pitch: you can highlight the data model if the story is clear and the demo is ready.",
        options: [
          {
            id: "highlight",
            displayText: "if (storyClear && demoReady) { highlightModel(); } else { stickToBasics(); }",
            nextSceneId: "college-finish",
            isCorrect: true,
            outcomeText: "The judges love the clear explanation.",
          },
          {
            id: "basics",
            displayText: "if (storyClear && demoReady) { highlightModel(); } else { stickToBasics(); }",
            nextSceneId: "college-finish",
            isCorrect: false,
            outcomeText: "You keep it simple and still score well.",
          },
        ],
      },
      "college-finish": {
        id: "college-finish",
        storyText:
          "The hackathon ends and your team celebrates the finish.",
        isEnding: true,
        options: [
          {
            id: "celebrate",
            displayText: "if (shareCredit) { thankTeam(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You celebrate and thank the team.",
          },
          {
            id: "thank-team",
            displayText: "if (shareCredit) { thankTeam(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You thank everyone and take a group photo.",
          },
        ],
      },
      "slow-query": {
        id: "slow-query",
        storyText:
          "The app slows down and users drop off. You need to reset before the next demo.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "reset",
            displayText: "if (retry) { resetPlan(); } else { resetPlan(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You reset the plan and try again.",
          },
        ],
      },
      crash: {
        id: "crash",
        storyText:
          "The app crashes during the demo. You will need to restart from the last checkpoint.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "retry",
            displayText: "if (retry) { resetDemo(); } else { resetDemo(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You reset and regroup.",
          },
        ],
      },
    },
  },
  5: {
    id: 5,
    name: "College CS",
    startSceneId: "datastruct-brief",
    scenes: {
      "datastruct-brief": {
        id: "datastruct-brief",
        storyText:
          "You are leading a study group on data structures. You need to choose the right structure for a real-time leaderboard.",
        options: [
          {
            id: "priority-queue",
            displayText: "if (needsFastTop && updatesConstant) { useHeap(); } else { useArray(); }",
            nextSceneId: "lab-checkpoint",
            isCorrect: true,
            outcomeText: "A heap keeps the leaderboard responsive.",
          },
          {
            id: "array",
            displayText: "if (needsFastTop && updatesConstant) { useHeap(); } else { useArray(); }",
            nextSceneId: "slow-query",
            isCorrect: false,
            outcomeText: "Sorting the array repeatedly slows the system.",
            livesChange: -1,
          },
          {
            id: "hashmap",
            displayText: "if (needsFastTop && updatesConstant) { useHeap(); } else { useArray(); }",
            nextSceneId: "lab-checkpoint",
            isCorrect: false,
            outcomeText: "A map helps lookup but not ranking.",
          },
        ],
      },
      "lab-checkpoint": {
        id: "lab-checkpoint",
        storyText:
          "Checkpoint reached! The team wants to add a search feature for usernames.",
        isCheckpoint: true,
        checkpointLabel: "Leaderboard stable",
        options: [
          {
            id: "add-index",
            displayText: "if (needsFastSearch && namesUnique) { addIndex(); } else { scanList(); }",
            nextSceneId: "perf-review",
            isCorrect: true,
            outcomeText: "An index speeds up lookups.",
          },
          {
            id: "scan-list",
            displayText: "if (needsFastSearch && namesUnique) { addIndex(); } else { scanList(); }",
            nextSceneId: "perf-review",
            isCorrect: false,
            outcomeText: "Scanning works but isn't instant.",
          },
        ],
      },
      "perf-review": {
        id: "perf-review",
        storyText:
          "During performance review, you should optimize only if latency spikes and memory is stable.",
        options: [
          {
            id: "optimize",
            displayText: "if (latencySpike && memoryStable) { optimize(); } else { monitor(); }",
            nextSceneId: "final-defense",
            isCorrect: true,
            outcomeText: "You optimize and smooth the spikes.",
          },
          {
            id: "monitor",
            displayText: "if (latencySpike && memoryStable) { optimize(); } else { monitor(); }",
            nextSceneId: "final-defense",
            isCorrect: false,
            outcomeText: "You monitor and document the behavior.",
          },
          {
            id: "ignore",
            displayText: "if (latencySpike && memoryStable) { optimize(); } else { monitor(); }",
            nextSceneId: "soft-fail",
            isCorrect: false,
            outcomeText: "Ignoring spikes causes a slowdown.",
            livesChange: -1,
          },
        ],
      },
      "final-defense": {
        id: "final-defense",
        storyText:
          "Final defense: explain the algorithm choice. You should present the complexity if the audience is ready and the slides are clear.",
        options: [
          {
            id: "present-complexity",
            displayText: "if (audienceReady && slidesClear) { explainComplexity(); } else { focusOnUseCase(); }",
            nextSceneId: "finish-line",
            isCorrect: true,
            outcomeText: "The committee appreciates the clear breakdown.",
          },
          {
            id: "use-case",
            displayText: "if (audienceReady && slidesClear) { explainComplexity(); } else { focusOnUseCase(); }",
            nextSceneId: "finish-line",
            isCorrect: false,
            outcomeText: "You focus on use cases and still earn praise.",
          },
        ],
      },
      "finish-line": {
        id: "finish-line",
        storyText:
          "The project is approved! You close the session on a high note.",
        isEnding: true,
        options: [
          {
            id: "wrap",
            displayText: "if (shareCredit) { thankTeam(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You thank the team and close the session.",
          },
          {
            id: "celebrate",
            displayText: "if (shareCredit) { thankTeam(); } else { celebrate(); }",
            nextSceneId: null,
            isCorrect: true,
            outcomeText: "You celebrate a job well done.",
          },
        ],
      },
      "soft-fail": {
        id: "soft-fail",
        storyText:
          "The project slows down and you need to revisit the performance plan.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "retry",
            displayText: "if (retry) { resetPlan(); } else { resetPlan(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You reset and try again.",
          },
        ],
      },
      "slow-query": {
        id: "slow-query",
        storyText:
          "The leaderboard queries are too slow. You need to restart from the checkpoint.",
        isEnding: true,
        isFailure: true,
        options: [
          {
            id: "retry",
            displayText: "if (retry) { resetPlan(); } else { resetPlan(); }",
            nextSceneId: null,
            isCorrect: false,
            outcomeText: "You reset and try again.",
          },
        ],
      },
    },
  },
};

let currentLevel = 1;
let currentSceneId = null;
let currentCheckpoint = null;
let checkpointScore = 0;
let score = 0;
let lives = MAX_LIVES;
let stepCount = 0;
let pendingNextSceneId = null;
let playerName = "";
let scoreSaved = false;

let levelSelectEl;
let startBtnEl;
let gameAreaEl;
let levelInfoEl;
let questionCounterEl;
let scoreDisplayEl;
let livesDisplayEl;
let checkpointDisplayEl;
let scenarioTextEl;
let codeSnippetEl;
let resultTextEl;
let choiceButtonsEl;
let nextBtnEl;
let gameOverEl;
let gameOverTitleEl;
let gameOverMessageEl;
let finalPlayerNameEl;
let finalLevelEl;
let finalScoreEl;
let continueCheckpointBtnEl;
let saveScoreBtnEl;
let playAgainBtnEl;
let leaderboardListEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;
let openLeaderboardBtnEl;

const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const setModalMessage = (text, tone = "") => {
  modalMessageEl.textContent = text;
  modalMessageEl.className = `form-note ${tone}`.trim();
};

const updateLivesDisplay = () => {
  livesDisplayEl.textContent = "❤".repeat(lives) + "♡".repeat(MAX_LIVES - lives);
};

const updateScoreboard = () => {
  const levelConfig = LEVEL_CONFIG[currentLevel];
  levelInfoEl.textContent = `${levelConfig.label} — Scene ${stepCount}`;
  questionCounterEl.textContent = `${stepCount}`;
  scoreDisplayEl.textContent = score;
  updateLivesDisplay();
  checkpointDisplayEl.textContent =
    currentCheckpoint?.label || "None yet";
};

const loadLeaderboard = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLeaderboard = (entries) => {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
};

const updateLeaderboardUI = () => {
  const entries = loadLeaderboard();
  leaderboardListEl.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet. Be the first!";
    leaderboardListEl.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} — ${entry.level} — ${entry.score} pts`;
      leaderboardListEl.appendChild(item);
    });
};

const openNameModal = () => {
  nameModalEl.classList.remove("hidden");
};

const getCurrentLevelData = () => STORY_LEVELS[currentLevel];

const renderScene = (sceneId) => {
  const levelData = getCurrentLevelData();
  const scene = levelData.scenes[sceneId];
  if (!scene) {
    return;
  }

  currentSceneId = scene.id;
  stepCount += 1;
  pendingNextSceneId = null;
  scenarioTextEl.textContent = scene.storyText;
  resultTextEl.textContent = "";

  codeSnippetEl.textContent = scene.storyText
    ? `// Scene Context\n${scene.storyText}`
    : "// Scene Context";

  choiceButtonsEl.innerHTML = "";
  scene.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline";
    btn.type = "button";
    btn.innerHTML = escapeHtml(option.displayText);
    btn.addEventListener("click", () => handleChoice(option));
    choiceButtonsEl.appendChild(btn);
  });

  if (scene.isCheckpoint) {
    currentCheckpoint = {
      sceneId: scene.id,
      label: scene.checkpointLabel || "Checkpoint reached",
    };
    checkpointScore = score;
  }

  updateScoreboard();
  nextBtnEl.disabled = true;
};

const handleChoice = (option) => {
  if (pendingNextSceneId !== null) {
    return;
  }

  const levelConfig = LEVEL_CONFIG[currentLevel];
  const pointsDelta = (option.points || (option.isCorrect ? 2 : 0)) * levelConfig.multiplier;
  score += pointsDelta;
  lives += option.livesChange || 0;
  if (lives < 0) {
    lives = 0;
  }

  resultTextEl.textContent = option.outcomeText || "You move forward.";

  const isFailure = option.isFailure;
  const nextSceneId = option.nextSceneId;

  if (lives <= 0) {
    endRun("You ran out of lives.");
    return;
  }

  if (!nextSceneId) {
    const scene = getCurrentLevelData().scenes[currentSceneId];
    const endingTitle = scene?.isFailure || isFailure ? "Try Again" : "Story Complete";
    endRun(option.outcomeText || "Run complete!", endingTitle, scene?.isFailure || isFailure);
    return;
  }

  if (isFailure) {
    endRun(option.outcomeText || "That path didn’t work out.", "Try Again", true);
    return;
  }

  pendingNextSceneId = nextSceneId;
  nextBtnEl.disabled = false;
  updateScoreboard();
};

const continueStory = () => {
  if (!pendingNextSceneId) {
    return;
  }
  renderScene(pendingNextSceneId);
};

const endRun = (message, title = "Run Complete", isFailure = false) => {
  gameAreaEl.hidden = true;
  gameOverEl.hidden = false;
  gameOverTitleEl.textContent = title;
  gameOverMessageEl.textContent = message;
  finalPlayerNameEl.textContent = playerName;
  finalLevelEl.textContent = LEVEL_CONFIG[currentLevel].label;
  finalScoreEl.textContent = score;
  continueCheckpointBtnEl.hidden = !currentCheckpoint;
  saveScoreBtnEl.disabled = scoreSaved;

  if (isFailure) {
    gameOverTitleEl.textContent = "Try Again";
  }
};

const startLevel = (levelId) => {
  currentLevel = levelId;
  const levelData = getCurrentLevelData();
  score = 0;
  lives = MAX_LIVES;
  stepCount = 0;
  pendingNextSceneId = null;
  scoreSaved = false;
  currentCheckpoint = null;
  checkpointScore = 0;

  gameAreaEl.hidden = false;
  gameOverEl.hidden = true;
  renderScene(levelData.startSceneId);
};

const restartFromCheckpoint = () => {
  if (!currentCheckpoint) {
    startLevel(currentLevel);
    return;
  }
  score = checkpointScore;
  lives = MAX_LIVES;
  stepCount = 0;
  pendingNextSceneId = null;
  scoreSaved = false;
  gameAreaEl.hidden = false;
  gameOverEl.hidden = true;
  renderScene(currentCheckpoint.sceneId);
};

const saveScore = () => {
  if (scoreSaved) {
    return;
  }
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    level: LEVEL_CONFIG[currentLevel].label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
  saveScoreBtnEl.disabled = true;
};

const startGame = () => {
  const name = modalNameInputEl.value.trim();
  if (!name) {
    setModalMessage("Enter your name to start.", "warning");
    return;
  }
  playerName = name;
  nameModalEl.classList.add("hidden");
  setModalMessage("");
  modalNameInputEl.value = "";

  const selectedLevel = parseInt(levelSelectEl.value, 10);
  startLevel(selectedLevel);
};

const initGame = () => {
  levelSelectEl = document.getElementById("levelSelect");
  startBtnEl = document.getElementById("startGameBtn");
  gameAreaEl = document.getElementById("gameArea");
  levelInfoEl = document.getElementById("levelInfo");
  questionCounterEl = document.getElementById("questionCounter");
  scoreDisplayEl = document.getElementById("scoreDisplay");
  livesDisplayEl = document.getElementById("livesDisplay");
  checkpointDisplayEl = document.getElementById("checkpointDisplay");
  scenarioTextEl = document.getElementById("scenarioText");
  codeSnippetEl = document.getElementById("codeSnippet");
  resultTextEl = document.getElementById("resultText");
  choiceButtonsEl = document.getElementById("choiceButtons");
  nextBtnEl = document.getElementById("nextQuestionBtn");
  gameOverEl = document.getElementById("gameOver");
  gameOverTitleEl = document.getElementById("gameOverTitle");
  gameOverMessageEl = document.getElementById("gameOverMessage");
  finalPlayerNameEl = document.getElementById("finalPlayerName");
  finalLevelEl = document.getElementById("finalLevel");
  finalScoreEl = document.getElementById("finalScore");
  continueCheckpointBtnEl = document.getElementById("continueCheckpointBtn");
  saveScoreBtnEl = document.getElementById("saveScoreBtn");
  playAgainBtnEl = document.getElementById("playAgainBtn");
  leaderboardListEl = document.getElementById("leaderboardList");
  nameModalEl = document.getElementById("escapeNameModal");
  modalNameInputEl = document.getElementById("escapeModalName");
  modalMessageEl = document.getElementById("escapeModalMessage");
  modalStartBtnEl = document.getElementById("escapeModalStart");
  openLeaderboardBtnEl = document.getElementById("openLeaderboardBtn");

  if (
    !levelSelectEl ||
    !startBtnEl ||
    !gameAreaEl ||
    !levelInfoEl ||
    !questionCounterEl ||
    !scoreDisplayEl ||
    !livesDisplayEl ||
    !checkpointDisplayEl ||
    !scenarioTextEl ||
    !codeSnippetEl ||
    !resultTextEl ||
    !choiceButtonsEl ||
    !nextBtnEl ||
    !gameOverEl ||
    !gameOverTitleEl ||
    !gameOverMessageEl ||
    !finalPlayerNameEl ||
    !finalLevelEl ||
    !finalScoreEl ||
    !continueCheckpointBtnEl ||
    !saveScoreBtnEl ||
    !playAgainBtnEl ||
    !leaderboardListEl ||
    !nameModalEl ||
    !modalNameInputEl ||
    !modalMessageEl ||
    !modalStartBtnEl ||
    !openLeaderboardBtnEl
  ) {
    return;
  }

  updateLeaderboardUI();
  openNameModal();

  startBtnEl.addEventListener("click", () => {
    startLevel(parseInt(levelSelectEl.value, 10));
  });
  modalStartBtnEl.addEventListener("click", startGame);
  modalNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });
  nextBtnEl.addEventListener("click", continueStory);
  saveScoreBtnEl.addEventListener("click", saveScore);
  playAgainBtnEl.addEventListener("click", () => startLevel(currentLevel));
  continueCheckpointBtnEl.addEventListener("click", restartFromCheckpoint);
  openLeaderboardBtnEl.addEventListener("click", () => {
    leaderboardListEl.scrollIntoView({ behavior: "smooth" });
  });
};

window.addEventListener("DOMContentLoaded", initGame);
