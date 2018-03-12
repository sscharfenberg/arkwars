/** ********************************************************************************************************************
 *
 *  time functions
 *  @exports {function} initTime
 *
 **********************************************************************************************************************/
import moment from "moment";
import axios from "axios";
import "moment/locale/de"; // import the locale even though webpack ignores moment/locale
import {LOCALES} from "../../config";
import {DEBUG} from "../../config";

const SELECTOR_SERVER_TIME = "time[data-server-time]";
const SELECTOR_MY_TIME = "time[data-my-time]";
const SELECTOR_PROGRESS = ".aw-progress-turn";
const SELECTOR_SVG = ".aw-progress__bar";
const SELECTOR_TIME_NEXT_TURN = "time[data-time-next-turn]";
const SELECTOR_PROGRESSBAR_VALUE = ".aw-progress__bar-value";
const SELECTOR_CURRENT_GAME = ".aw-header__submenu-item-link--active[data-gameid]";
const SELECTOR_TURN = ".aw-turn__value";
const DATA_MAX = "data-max";
const DATA_VALUE = "data-value";
const DATA_GAMEID = "data-gameid";
// cycle duration in seconds. too big, and the data can be vary too much from the real server data
// too small, and we overload the client by too many dom manipulations, and we start to get out of synch
// because of all the calculations
const CYCLE_DURATION = 10;
const DELAY_NO_NEW_TURN = 60 * 2;

/*
 * get current game from DOM
 * @returns {int} current game number
 */
const getCurrentGame = () => {
    return parseInt(document.querySelector(SELECTOR_CURRENT_GAME).getAttribute(DATA_GAMEID) || 0, 10);
};

/*
 * get current locale from DOM
 * @returns {string} locale - must be one of LOCALES || LOCALES[0]
 */
const getCurrentLocale = () => {
    let domLocale = document.querySelector("html").getAttribute("lang");
    let returnLocale = LOCALES[0];
    LOCALES.forEach(locale => {
        if (locale === domLocale) {
            returnLocale = locale;
        }
    });
    return returnLocale;
};

/*
 * get current turn from DOM
 * @returns {int} turn
 */
const getCurrentTurn = () => {
    const turn = document.querySelectorAll(SELECTOR_TURN)[0].textContent;
    return turn ? parseInt(turn, 10) : 0;
};

/*
 * update "your time" by manipulating the DOM
 * @param {string} time - ISO 8601 string
 */
const updateYourTime = time => {
    const _myTime = document.querySelector(SELECTOR_MY_TIME);
    const display = moment(time).format("LT");
    const oldText = _myTime.textContent;
    // only update dom if anything changes.
    if (oldText !== display) {
        _myTime.textContent = display;
        _myTime.setAttribute("datetime", moment(time).toISOString());
    }
};

/*
 * update "server time".
 * @param {string} time - ISO 8601 string
 */
const updateServerTime = time => {
    const _serverTime = document.querySelectorAll(SELECTOR_SERVER_TIME);
    const _progress = document.querySelectorAll(SELECTOR_PROGRESS)[0];
    const oldText = _serverTime[0].textContent;
    const display = moment(time).format("LT");
    for (let domNode of _serverTime) {
        domNode.textContent = display;
        domNode.setAttribute("datetime", time);
    }
    // update progress only if servertime changes
    // do not update progress for the first time when we update the textContent
    // do not update progress for inactive games
    if (_progress && oldText !== display && oldText !== "00:00") {
        const isActiveGame = document.querySelectorAll(SELECTOR_SVG)[0].classList.contains("active");
        isActiveGame &&
            updateProgress(
                parseInt(_progress.getAttribute(DATA_MAX), 10),
                parseInt(_progress.getAttribute(DATA_VALUE), 10) + 1 // increase by one minute
            );
    }
};

/*
 * update "next turn" time
 * @param {string} time - ISO 8601 string
 */
const updateNextTurnTime = time => {
    const _nextTurnTime = document.querySelectorAll(SELECTOR_TIME_NEXT_TURN);
    for (let domNode of _nextTurnTime) {
        domNode.textContent = moment(time).format("LT");
        domNode.setAttribute("datetime", time);
    }
};

/*
 * update progress bar(s)
 * @param {int} max - turn duration in minutes
 * @param {int} value - minutes passed in current turn
 */
const updateProgress = (max, value) => {
    const _progress = document.querySelectorAll(SELECTOR_PROGRESS);
    const _path = document.querySelectorAll(SELECTOR_PROGRESSBAR_VALUE);
    const _nextTurn = document.querySelectorAll(SELECTOR_TIME_NEXT_TURN);
    let colorClass = "aw-progress__bar-value--";
    let pct;

    if (value > max) return;

    pct = parseInt(100 - value / max * 100, 10);
    if (pct >= 0 && pct <= 20) colorClass += "1";
    if (pct > 21 && pct <= 40) colorClass += "2";
    if (pct > 41 && pct <= 60) colorClass += "3";
    if (pct > 61 && pct <= 80) colorClass += "4";
    if (pct > 81) colorClass += "5";

    DEBUG && console.log(`updating turn progress to ${value}/${max}, ${100 - pct}%, dashoffset ${pct}.`);

    // update progress data attributes
    for (let domNode of _progress) {
        domNode.setAttribute(DATA_MAX, max);
        domNode.setAttribute(DATA_VALUE, value);
    }

    // update path
    for (let domNode of _path) {
        domNode.classList.remove(
            "aw-progress__bar-value--1",
            "aw-progress__bar-value--2",
            "aw-progress__bar-value--3",
            "aw-progress__bar-value--4",
            "aw-progress__bar-value--5"
        );
        domNode.classList.add(colorClass);
        domNode.setAttribute("stroke-dashoffset", `${pct}`);
    }

    // next turn time
    if (value === max) {
        const lang = document.querySelector("html").getAttribute("lang");
        for (let domNode of _nextTurn) {
            if (lang === "de") domNode.textContent = "Jetzt";
            if (lang === "en") domNode.textContent = "Now";
        }
        doServerPulse();
    }
};

/*
 * update "current turn"
 */
const updateCurrentTurn = turn => {
    const _turn = document.querySelectorAll(SELECTOR_TURN);
    for (let domNode of _turn) {
        domNode.textContent = turn ? turn : "0";
    }
};

/*
 * update dom times
 * @param {int} pulse - cycle duration in seconds
 */
const domUpdateCollection = pulse => {
    const _serverTime = document.querySelector(SELECTOR_SERVER_TIME);
    updateYourTime(moment().toISOString());
    updateServerTime(
        // get fresh servertime from dom every cycle.
        moment(_serverTime.getAttribute("datetime"))
            .add(pulse, "seconds") // add cycle duration
            .toISOString()
    );
};

/*
 * ask server for current time, turn and next turn time.
 */
const doServerPulse = () => {
    let gameNumber = getCurrentGame();

    DEBUG && console.log(`requesting pulse from server for g${gameNumber}`);
    axios
        .get(`/api/game/${gameNumber}/status/`)
        .then(response => {
            let turn = getCurrentTurn();
            if (response.status === 200) {
                let data = response.data;
                DEBUG && console.log("recieved pulse:", data);

                if (turn === data.turn || data.processing) {
                    DEBUG && console.warn(`no new turn data. trying again in ${DELAY_NO_NEW_TURN}s.`);
                    // TODO: VISUALIZE THIS SPECIFICALLY
                    data.serverTime && updateServerTime(data.serverTime);
                    setTimeout(() => doServerPulse(), 1000 * DELAY_NO_NEW_TURN);
                } else {
                    applyServerPulse(data);
                }
            }
        })
        .catch(error => {
            DEBUG && console.warn(error);
        });
};

/*
 * apply server data in DOM
 * @params {object} game
 */
const applyServerPulse = game => {
    const max = game.turnDuration;
    const now = moment();
    const turn = getCurrentTurn();
    const nextTurn = moment(game.turnDue);
    const serverTime = moment(game.serverTime) || now;
    let value = Math.round(nextTurn.diff(serverTime, "minutes", true));

    game.serverTime && updateServerTime(game.serverTime);
    if (value > max || value < 0) return;

    DEBUG && console.log("applying new turn data from server");
    DEBUG && console.log(`${value} minutes until turn processing (duration: ${max} minutes)`);

    updateYourTime();
    updateNextTurnTime(nextTurn.toISOString());
    if (turn !== game.turn) {
        updateCurrentTurn(game.turn);
    }
    updateProgress(max, max - value);
};

const initTime = () => {
    const _serverTime = document.querySelectorAll(SELECTOR_SERVER_TIME);
    const _myTime = document.querySelectorAll(SELECTOR_MY_TIME);
    const _nextTurn = document.querySelectorAll(SELECTOR_TIME_NEXT_TURN);

    // fail silently if there is no time that needs to be updated.
    if (_serverTime.length < 1 || _myTime.length < 1) return;

    // locale comes from server lang attribute on html element
    moment.locale(getCurrentLocale());

    setInterval(() => domUpdateCollection(CYCLE_DURATION), 1000 * CYCLE_DURATION);

    updateYourTime();
    updateServerTime(moment(_serverTime[0].getAttribute("datetime")).toISOString());

    if (_nextTurn.length) {
        updateNextTurnTime(moment(_nextTurn[0].getAttribute("datetime")).toISOString());
    }
};

export {initTime, applyServerPulse};
