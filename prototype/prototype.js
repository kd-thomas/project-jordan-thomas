const homeScreen =
  document.querySelector("#homeScreen");

const hazardScreen =
  document.querySelector("#hazardScreen");

const detailsScreen =
  document.querySelector("#detailsScreen");

const reportHazardButton =
  document.querySelector("#reportHazardButton");

const hazardBackButton =
  document.querySelector("#hazardBackButton");

const detailsBackButton =
  document.querySelector("#detailsBackButton");

const hazardOptions =
  document.querySelectorAll(".hazard-option");

const selectedHazardBar =
  document.querySelector("#selectedHazardBar");

const selectedHazardText =
  document.querySelector("#selectedHazardText");

const continueReportButton =
  document.querySelector("#continueReportButton");

const bottomNav =
  document.querySelector("#bottomNav");

const detailsHazardText =
  document.querySelector("#detailsHazardText");

const reportTimeText =
  document.querySelector("#reportTimeText");

const urgencyOptions =
  document.querySelectorAll(".urgency-option");

const reportNote =
  document.querySelector("#reportNote");

const noteCount =
  document.querySelector("#noteCount");

const photoButton =
  document.querySelector("#photoButton");

const photoStatusText =
  document.querySelector("#photoStatusText");

const submitReportButton =
  document.querySelector("#submitReportButton");

const submitButtonText =
  document.querySelector("#submitButtonText");

const submitButtonSubtext =
  document.querySelector("#submitButtonSubtext");

const submitHelper =
  document.querySelector("#submitHelper");


const workerActiveAlertCount =
  document.querySelector("#workerActiveAlertCount");

const workerNoActiveAlerts =
  document.querySelector("#workerNoActiveAlerts");

const workerActiveAlertCard =
  document.querySelector("#workerActiveAlertCard");

const workerActiveAlertHazard =
  document.querySelector("#workerActiveAlertHazard");

const workerActiveAlertTime =
  document.querySelector("#workerActiveAlertTime");

const workerActiveAlertDescription =
  document.querySelector("#workerActiveAlertDescription");

const workerActiveAlertStatus =
  document.querySelector("#workerActiveAlertStatus");

const latestReportActivity =
  document.querySelector("#latestReportActivity");

const latestReportActivityMarker =
  document.querySelector("#latestReportActivityMarker");

const latestReportHazard =
  document.querySelector("#latestReportHazard");

const latestReportTime =
  document.querySelector("#latestReportTime");

const latestReportDescription =
  document.querySelector("#latestReportDescription");

const latestReportStatus =
  document.querySelector("#latestReportStatus");


let selectedHazard = null;
let selectedUrgency = null;
let photoAttached = false;


/* =========================================
   STORAGE
   ========================================= */

function getReport() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "jordanPrototypeReport"
      ) || "{}"
    );

  } catch {

    return {};

  }

}


function saveReport(report) {

  const value =
    JSON.stringify(report);

  localStorage.setItem(
    "jordanPrototypeReport",
    value
  );

  sessionStorage.setItem(
    "jordanPrototypeReport",
    value
  );

}


/* =========================================
   TIME
   ========================================= */

function formatTime(timestamp) {

  if (!timestamp) {
    return "Just now";
  }


  const date =
    new Date(timestamp);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "Just now";

  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  ).format(date);

}


/* =========================================
   WORKER HOME
   ========================================= */

function renderWorkerHome() {

  if (
    !workerActiveAlertCount ||
    !latestReportActivity
  ) {

    return;

  }


  const report =
    getReport();


  if (!report.id) {

    workerActiveAlertCount.textContent =
      "0";

    workerNoActiveAlerts.style.display =
      "";

    workerActiveAlertCard.style.display =
      "none";

    latestReportActivity.style.display =
      "none";

    return;

  }


  const resolved =
    report.resolved === true ||
    report.status === "Resolved";


  const monitoring =
    report.status === "Monitoring";


  const active =
    report.urgency === "active" &&
    !resolved;


  /* ACTIVE ALERT SECTION */

  if (active) {

    workerActiveAlertCount.textContent =
      "1";

    workerNoActiveAlerts.style.display =
      "none";

    workerActiveAlertCard.style.display =
      "grid";

    workerActiveAlertHazard.textContent =
      report.hazard ||
      "Safety Alert";

    workerActiveAlertTime.textContent =
      formatTime(
        report.timestamp
      );


    if (monitoring) {

      workerActiveAlertStatus.textContent =
        "MONITORING";

      workerActiveAlertDescription.textContent =
        report.supervisorAction
          ? `Supervisor response: ${report.supervisorAction}.`
          : "This incident remains under supervisor monitoring.";

    } else {

      workerActiveAlertStatus.textContent =
        "ACTIVE";

      workerActiveAlertDescription.textContent =
        report.note ||
        "A live safety alert is active for your crew.";

    }

  } else {

    workerActiveAlertCount.textContent =
      "0";

    workerNoActiveAlerts.style.display =
      "";

    workerActiveAlertCard.style.display =
      "none";

  }


  /* RECENT ACTIVITY */

  latestReportActivity.style.display =
    "grid";

  latestReportHazard.textContent =
    report.hazard ||
    "Safety Report";

  latestReportTime.textContent =
    formatTime(
      report.timestamp
    );


  latestReportActivityMarker.classList.remove(
    "resolved",
    "monitoring"
  );

  latestReportStatus.classList.remove(
    "resolved-pill",
    "monitoring-pill"
  );


  if (resolved) {

    latestReportActivityMarker.textContent =
      "✓";

    latestReportActivityMarker.classList.add(
      "resolved"
    );

    latestReportStatus.textContent =
      "RESOLVED";

    latestReportStatus.classList.add(
      "resolved-pill"
    );


    if (
      report.supervisorAction &&
      report.supervisorNote
    ) {

      latestReportDescription.textContent =
        `${report.supervisorAction}. ${report.supervisorNote}`;

    } else if (
      report.supervisorAction
    ) {

      latestReportDescription.textContent =
        `Supervisor response: ${report.supervisorAction}.`;

    } else if (
      report.supervisorNote
    ) {

      latestReportDescription.textContent =
        report.supervisorNote;

    } else {

      latestReportDescription.textContent =
        "This safety incident was resolved.";

    }


    return;

  }


  if (monitoring) {

    latestReportActivityMarker.textContent =
      "!";

    latestReportActivityMarker.classList.add(
      "monitoring"
    );

    latestReportStatus.textContent =
      "MONITORING";

    latestReportStatus.classList.add(
      "monitoring-pill"
    );


    latestReportDescription.textContent =
      report.supervisorNote ||
      (
        report.supervisorAction
          ? `Supervisor response: ${report.supervisorAction}.`
          : "Supervisor is continuing to monitor this incident."
      );


    return;

  }


  if (
    report.urgency ===
    "document"
  ) {

    latestReportActivityMarker.textContent =
      "✓";

    latestReportActivityMarker.classList.add(
      "resolved"
    );

    latestReportStatus.textContent =
      "DOCUMENTED";

    latestReportStatus.classList.add(
      "resolved-pill"
    );

    latestReportDescription.textContent =
      report.note ||
      "Safety report documented.";

    return;

  }


  latestReportActivityMarker.textContent =
    "!";

  latestReportActivityMarker.classList.add(
    "monitoring"
  );

  latestReportStatus.textContent =
    "ACTIVE";

  latestReportStatus.classList.add(
    "monitoring-pill"
  );

  latestReportDescription.textContent =
    report.note ||
    "Crew safety alert sent.";

}


/* =========================================
   SCREENS
   ========================================= */

function scrollTop() {

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

}


function showOnly(screen) {

  homeScreen.hidden =
    true;

  hazardScreen.hidden =
    true;

  detailsScreen.hidden =
    true;

  screen.hidden =
    false;

  scrollTop();

}


function showHomeScreen() {

  renderWorkerHome();

  showOnly(
    homeScreen
  );

  bottomNav.hidden =
    false;

}


function showHazardScreen() {

  showOnly(
    hazardScreen
  );

  bottomNav.hidden =
    true;

}


function showDetailsScreen() {

  if (!selectedHazard) {
    return;
  }


  detailsHazardText.textContent =
    selectedHazard;

  reportTimeText.textContent =
    formatTime(
      new Date().toISOString()
    );

  showOnly(
    detailsScreen
  );

  bottomNav.hidden =
    true;

}


/* =========================================
   HAZARD
   ========================================= */

function selectHazard(option) {

  hazardOptions.forEach(
    (item) => {

      item.classList.remove(
        "selected"
      );

    }
  );


  option.classList.add(
    "selected"
  );

  selectedHazard =
    option.dataset.category;

  selectedHazardText.textContent =
    selectedHazard;

  selectedHazardBar.hidden =
    false;

}


/* =========================================
   URGENCY
   ========================================= */

function selectUrgency(option) {

  urgencyOptions.forEach(
    (item) => {

      item.classList.remove(
        "selected"
      );

    }
  );


  option.classList.add(
    "selected"
  );

  selectedUrgency =
    option.dataset.urgency;

  updateSubmitState();

}


/* =========================================
   SUBMIT STATE
   ========================================= */

function updateSubmitState() {

  if (!selectedUrgency) {

    submitReportButton.disabled =
      true;

    submitHelper.classList.remove(
      "alert-mode"
    );

    submitReportButton.classList.remove(
      "alert-mode"
    );

    submitButtonText.textContent =
      "SEND SAFETY REPORT";

    submitButtonSubtext.textContent =
      "Report will be saved to this work zone";

    submitHelper.textContent =
      "Choose whether this is happening now before sending the report.";

    return;

  }


  submitReportButton.disabled =
    false;


  if (
    selectedUrgency ===
    "active"
  ) {

    submitHelper.classList.add(
      "alert-mode"
    );

    submitReportButton.classList.add(
      "alert-mode"
    );

    submitButtonText.textContent =
      "ALERT CREW + SEND REPORT";

    submitButtonSubtext.textContent =
      "Crew A will receive an immediate safety alert";

    submitHelper.textContent =
      "This will create an active crew alert and save the report to the work zone.";

  } else {

    submitHelper.classList.remove(
      "alert-mode"
    );

    submitReportButton.classList.remove(
      "alert-mode"
    );

    submitButtonText.textContent =
      "SEND SAFETY REPORT";

    submitButtonSubtext.textContent =
      "Report will be documented without a live alert";

    submitHelper.textContent =
      "This will save the report to the work zone without alerting the crew.";

  }

}


/* =========================================
   PHOTO
   ========================================= */

function togglePhoto() {

  photoAttached =
    !photoAttached;


  const photoIcon =
    photoButton.querySelector(
      ".photo-icon"
    );


  if (photoAttached) {

    photoButton.classList.add(
      "attached"
    );

    photoStatusText.textContent =
      "Photo attached";

    photoIcon.textContent =
      "✓";

  } else {

    photoButton.classList.remove(
      "attached"
    );

    photoStatusText.textContent =
      "No photo attached";

    photoIcon.textContent =
      "+";

  }

}


/* =========================================
   CREATE NEW REPORT
   ========================================= */

function createReport() {

  const now =
    new Date();


  return {

    id:
      `JORDAN-${now.getTime()}`,

    hazard:
      selectedHazard,

    urgency:
      selectedUrgency,

    note:
      reportNote.value.trim(),

    photoAttached:
      photoAttached,

    project:
      "24-117",

    workZone:
      "I-70 Eastbound",

    crew:
      "Crew A",

    location:
      "Work-zone GPS",

    timestamp:
      now.toISOString(),

    status:
      selectedUrgency === "active"
        ? "Active Alert"
        : "Documented",

    acknowledged:
      false,

    acknowledgedAt:
      null,

    crewBriefed:
      false,

    supervisorAction:
      null,

    supervisorNote:
      "",

    supervisorUpdatedAt:
      null,

    resolved:
      false,

    resolvedAt:
      null

  };

}


/* =========================================
   SUBMIT REPORT
   ========================================= */

function submitReport() {

  if (!selectedUrgency) {
    return;
  }


  const report =
    createReport();


  /*
   * This one object replaces all stale
   * incident flags from previous tests.
   */

  saveReport(
    report
  );


  /*
   * Remove old legacy flags so they cannot
   * interfere with current prototype state.
   */

  [
    "jordanPrototypeAlertAcknowledged",
    "jordanPrototypeAlertAcknowledgedAt",
    "jordanPrototypeCrewBriefed",
    "jordanPrototypeIncidentResolved",
    "jordanPrototypeSupervisorUpdate"
  ].forEach(
    (key) => {

      localStorage.removeItem(key);
      sessionStorage.removeItem(key);

    }
  );


  if (
    selectedUrgency ===
    "active"
  ) {

    window.location.href =
      "confirmation.html?mode=alert";

  } else {

    window.location.href =
      "confirmation.html?mode=document";

  }

}


/* =========================================
   START REPORT
   ========================================= */

function startNewReport() {

  selectedHazard =
    null;

  selectedUrgency =
    null;

  photoAttached =
    false;


  hazardOptions.forEach(
    (option) => {

      option.classList.remove(
        "selected"
      );

    }
  );


  urgencyOptions.forEach(
    (option) => {

      option.classList.remove(
        "selected"
      );

    }
  );


  selectedHazardBar.hidden =
    true;


  reportNote.value =
    "";


  noteCount.textContent =
    "0 / 180";


  photoButton.classList.remove(
    "attached"
  );


  photoStatusText.textContent =
    "No photo attached";


  const photoIcon =
    photoButton.querySelector(
      ".photo-icon"
    );


  if (photoIcon) {

    photoIcon.textContent =
      "+";

  }


  updateSubmitState();

  showHazardScreen();

}


/* =========================================
   EVENTS
   ========================================= */

if (reportHazardButton) {

  reportHazardButton.addEventListener(
    "click",
    startNewReport
  );

}


if (hazardBackButton) {

  hazardBackButton.addEventListener(
    "click",
    showHomeScreen
  );

}


if (detailsBackButton) {

  detailsBackButton.addEventListener(
    "click",
    showHazardScreen
  );

}


hazardOptions.forEach(
  (option) => {

    option.addEventListener(
      "click",
      () => {

        selectHazard(
          option
        );

      }
    );

  }
);


if (continueReportButton) {

  continueReportButton.addEventListener(
    "click",
    showDetailsScreen
  );

}


urgencyOptions.forEach(
  (option) => {

    option.addEventListener(
      "click",
      () => {

        selectUrgency(
          option
        );

      }
    );

  }
);


if (reportNote) {

  reportNote.addEventListener(
    "input",
    () => {

      noteCount.textContent =
        `${reportNote.value.length} / 180`;

    }
  );

}


if (photoButton) {

  photoButton.addEventListener(
    "click",
    togglePhoto
  );

}


if (submitReportButton) {

  submitReportButton.addEventListener(
    "click",
    submitReport
  );

}


renderWorkerHome();