// script.js (Immediate Button Display and Persistent Reset)

const videoPlayerContainer = document.getElementById('video-player-container');
const choiceButtonsContainer = document.getElementById('choice-buttons-container');
const restartButton = document.getElementById('restart-button'); // Will be repurposed for persistent reset
const skipButton = document.getElementById('skip-button'); // Will be removed
const appContainer = document.getElementById('app-container');
const header = document.querySelector('header'); // To append the reset button

const sampleGoogleDriveEmbed = '<iframe src="https://drive.google.com/file/d/107uxrMUKPH51-l8VP9De4D-azb9XAXiK/preview" width="640" height="480" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true"></iframe>';
const googleDriveVideoDuration = 10000; // Estimate video duration in milliseconds (adjust this!)

let currentSegment = 'intro';
let viewedSegments = [];
let narrativeData = {
    "intro": {
        heading: "The Temporal Anomaly",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        choices: [
            { text: "Investigate the Source", nextSegment: "investigate" },
            { text: "Attempt to Stabilize", nextSegment: "stabilize" }
        ]
    },
    "investigate": {
        heading: "Tracing the Origin",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        choices: [
            { text: "Follow the Energy Signature", nextSegment: "energy_trail" },
            { text: "Analyze Historical Records", nextSegment: "historical_analysis" }
        ]
    },
    "stabilize": {
        heading: "Counteracting the Effect",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        choices: [
            { text: "Calibrate the Device", nextSegment: "calibrate_device" },
            { text: "Seek External Assistance", nextSegment: "seek_help" }
        ]
    },
    "energy_trail": {
        heading: "A Faint Connection",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "temporal_echo"
    },
    "historical_analysis": {
        heading: "Whispers of the Past",
        text: "Ancient texts speak of similar events. You find a clue about a hidden location.",
        next: "hidden_location"
    },
    "calibrate_device": {
        heading: "Precise Adjustments",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "calibration_success"
    },
    "seek_help": {
        heading: "An Unlikely Ally",
        text: "You contact a specialist who offers a risky solution.",
        next: "risky_solution"
    },
    "temporal_echo": {
        heading: "Resonance Through Time",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        choices: [
            { text: "Observe the Anomaly", nextSegment: "observe_anomaly" },
            { text: "Attempt Communication", nextSegment: "communicate_attempt" }
        ]
    },
    "hidden_location": {
        heading: "The Chamber of Secrets",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        choices: [
            { text: "Decipher the Inscriptions", nextSegment: "decipher_inscriptions" },
            { text: "Activate the Mechanism", nextSegment: "activate_mechanism" }
        ]
    },
    "calibration_success": {
        heading: "Stabilization Achieved?",
        text: "The device hums with renewed energy. The anomaly seems less volatile.",
        choices: [
            { text: "Monitor for Further Fluctuations", nextSegment: "monitor_stability" },
            { text: "Return to Origin Point", nextSegment: "return_origin_a" }
        ]
    },
    "risky_solution": {
        heading: "A Leap of Faith",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        choices: [
            { text: "Proceed with the Solution", nextSegment: "solution_outcome" },
            { text: "Seek a Safer Alternative", nextSegment: "safer_alternative" }
        ]
    },
    "observe_anomaly": {
        heading: "Visual Insights",
        text: "Careful observation reveals a pattern within the temporal distortion.",
        next: "pattern_analysis"
    },
    "communicate_attempt": {
        heading: "A Fleeting Connection",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "communication_feedback"
    },
    "decipher_inscriptions": {
        heading: "Unveiling the Truth",
        text: "The inscriptions detail a way to either control or amplify temporal events.",
        choices: [
            { text: "Attempt Control", nextSegment: "attempt_control" },
            { text: "Seek Amplification", nextSegment: "seek_amplification" }
        ]
    },
    "activate_mechanism": {
        heading: "The Device Awakens",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "energy_consequences"
    },
    "monitor_stability": {
        heading: "Watching and Waiting",
        text: "The anomaly remains stable for now. You decide to...",
        choices: [
            { text: "Document Findings (Good Ending Path)", nextSegment: "document_findings_a" },
            { text: "Return Home (Neutral Ending Path)", nextSegment: "return_origin_b" }
        ]
    },
    "proceed_solution": {
        heading: "The Risky Gambit",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "solution_outcome"
    },
    "safer_alternative": {
        heading: "Cautious Approach",
        text: "You search for a less dangerous method, which takes more time.",
        next: "delayed_outcome"
    },
    "pattern_analysis": {
        heading: "Understanding the Flow",
        text: "The pattern suggests a cyclical nature to the temporal disturbances.",
        next: "ending_good" // Leads to Good Ending
    },
    "communication_feedback": {
        heading: "An Enigmatic Warning",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "ending_altered" // Leads to Altered Ending
    },
    "attempt_control": {
        heading: "Mastery of Time?",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "ending_good" // Leads to Good Ending
    },
    "seek_amplification": {
        heading: "Unforeseen Consequences",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "ending_bad" // Leads to Bad Ending
    },
    "energy_consequences": {
        heading: "Ripple Effect",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "ending_bad" // Leads to Bad Ending
    },
    "return_origin_a": {
        heading: "Returning to the Start",
        text: "Feeling unsure, you decide to return to where you began.",
        next: "ending_neutral" // Leads to Neutral Ending
    },
    "document_findings_a": {
        heading: "Careful Study",
        text: "Your detailed documentation helps understand the anomaly without further risk.",
        next: "ending_good" // Ending 1: Good Ending
    },
    "return_origin_b": {
        heading: "Cautious Return",
        text: "Deciding not to interfere further, you return to your own time.",
        next: "ending_neutral" // Ending 2: Neutral Ending
    },
    "solution_outcome": {
        heading: "The Results of the Risk",
        googleDriveEmbed: sampleGoogleDriveEmbed,
        next: "ending_bad" // Ending 3: Bad Ending
    },
    "delayed_outcome": {
        heading: "Time Consuming Search",
        text: "Eventually, you find a safer way, but the anomaly has evolved.",
        next: "ending_altered" // Ending 4: Altered Ending
    },
    "ending_good": {
        heading: "Temporal Harmony",
        text: "Through careful action and understanding, you resolve the temporal anomaly, ensuring the timeline remains stable.",
        ending: true
    },
    "ending_neutral": {
        heading: "Uncertain Future",
        text: "The anomaly persists, but you have learned enough to avoid immediate catastrophe. The long-term effects remain unknown.",
        ending: true
    },
    "ending_bad": {
        heading: "Chaotic Cascade",
        text: "Your actions inadvertently worsen the temporal situation, leading to unpredictable and dangerous consequences.",
        ending: true
    },
    "ending_altered": {
        heading: "A Changed Reality",
        text: "The timeline has been subtly or drastically altered by your intervention. The world you return to is not quite the same.",
        ending: true
    }
    // ... (End of your narrativeData)
};

let skipTimer = false; // Not used anymore
const alwaysSkip = true; // New flag to always skip timers

function loadSegment(segmentId) {
    const segmentData = narrativeData[segmentId];
    if (segmentData) {
        videoPlayerContainer.innerHTML = '';
        choiceButtonsContainer.classList.add('hidden');

        if (segmentData.heading) {
            const headingElement = document.createElement('h2');
            headingElement.textContent = segmentData.heading;
            videoPlayerContainer.appendChild(headingElement);
        }

        if (segmentData.youtubeId) {
            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/watch?v=_Qi6Z4rWn1U{segmentData.youtubeId}?enablejsapi=1`;
            iframe.title = 'YouTube video player';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            videoPlayerContainer.appendChild(iframe);
            currentSegment = segmentId;
            if (segmentData.choices || segmentData.next) {
                if (alwaysSkip) {
                    setTimeout(() => {
                        if (segmentData.choices) {
                            showChoices(segmentData.choices);
                        } else if (segmentData.next) {
                            viewedSegments.push(currentSegment);
                            loadSegment(segmentData.next);
                        }
                    }, 0); // Show immediately
                } else {
                    setTimeout(() => {
                        if (segmentData.choices) {
                            showChoices(segmentData.choices);
                        } else if (segmentData.next) {
                            viewedSegments.push(currentSegment);
                            loadSegment(segmentData.next);
                        }
                    }, googleDriveVideoDuration);
                }
            }
        } else if (segmentData.googleDriveEmbed) {
            const iframeContainer = document.createElement('div');
            iframeContainer.innerHTML = segmentData.googleDriveEmbed;
            videoPlayerContainer.appendChild(iframeContainer);
            currentSegment = segmentId;
            if (segmentData.choices || segmentData.next) {
                if (alwaysSkip) {
                    setTimeout(() => {
                        if (segmentData.choices) {
                            showChoices(segmentData.choices);
                        } else if (segmentData.next) {
                            viewedSegments.push(currentSegment);
                            loadSegment(segmentData.next);
                        }
                    }, 0); // Show immediately
                } else {
                    setTimeout(() => {
                        if (segmentData.choices) {
                            showChoices(segmentData.choices);
                        } else if (segmentData.next) {
                            viewedSegments.push(currentSegment);
                            loadSegment(segmentData.next);
                        }
                    }, googleDriveVideoDuration);
                }
            }
        } else if (segmentData.text) {
            const textBox = document.createElement('div');
            textBox.classList.add('text-box');
            const textParagraph = document.createElement('p');
            textParagraph.textContent = segmentData.text;
            textBox.appendChild(textParagraph);

            const closeButton = document.createElement('button');
            closeButton.classList.add('close-button');
            closeButton.textContent = 'X';
            closeButton.addEventListener('click', () => {
                textBox.remove();
                if (segmentData.choices) {
                    showChoices(segmentData.choices);
                } else if (segmentData.next) {
                    viewedSegments.push(currentSegment);
                    loadSegment(segmentData.next);
                } else if (segmentData.ending) {
                    displayEnding(segmentData.heading ? `The story concludes: "${segmentData.heading}"` : "The story concludes.");
                }
            });
            textBox.appendChild(closeButton);

            videoPlayerContainer.appendChild(textBox);
            currentSegment = segmentId;
        }

        // skipButton.classList.toggle('hidden', segmentData.ending); // Removed skip button
        const existingEnding = appContainer.querySelector('#ending-message');
        if (existingEnding) {
            existingEnding.remove();
        }
        restartButton.classList.toggle('hidden', !segmentData.ending); // Show reset button only on ending segments
    } else {
        console.error(`Segment not found: ${segmentId}`);
        videoPlayerContainer.innerHTML = "<p>Error: Narrative segment not found.</p>";
    }
}

function handleVideoEnd() {
    const currentSegmentData = narrativeData[currentSegment];
    if (currentSegmentData && currentSegmentData.choices) {
        showChoices(currentSegmentData.choices);
    } else if (currentSegmentData && currentSegmentData.next) {
        viewedSegments.push(currentSegment);
        loadSegment(currentSegmentData.next);
    }
}

function showChoices(choices) {
    choiceButtonsContainer.innerHTML = '';
    if (choices) {
        choiceButtonsContainer.classList.remove('hidden');
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                viewedSegments.push(currentSegment);
                choiceButtonsContainer.classList.add('hidden');
                loadSegment(choice.nextSegment);
            });
            choiceButtonsContainer.appendChild(button);
        });
    }
}

function displayEnding(endingText) {
    const endingElement = document.createElement('div');
    endingElement.id = 'ending-message';
    endingElement.innerHTML = `<h2>End of Story</h2><p>${endingText}</p>`;
    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(endingElement, footer);
    } else {
        appContainer.appendChild(endingElement); // Fallback if footer isn't found
    }
    restartButton.classList.remove('hidden'); // Ensure reset button is visible at the end
}


function restartGame() {
    currentSegment = 'intro';
    viewedSegments = [];
    choiceButtonsContainer.innerHTML = '';
    const existingEnding = appContainer.querySelector('#ending-message');
    if (existingEnding) {
        existingEnding.remove();
    }
    loadSegment(currentSegment);
}

// Repurpose restartButton for persistent reset
restartButton.textContent = 'Reset';
restartButton.classList.add('reset-button');
restartButton.classList.remove('hidden'); // Always show the reset button

// Add the reset button to the top-right of the header
header.appendChild(restartButton);

// Remove the old skip button element
const oldSkipButton = document.getElementById('skip-button');
if (oldSkipButton && oldSkipButton.parentNode) {
    oldSkipButton.parentNode.removeChild(oldSkipButton);
}

restartButton.addEventListener('click', restartGame);

// Initial load
loadSegment(currentSegment);