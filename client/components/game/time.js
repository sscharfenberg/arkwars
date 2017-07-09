/** ********************************************************************************************************************
 *
 *  time functions
 *  @exports {function} initTime
 *
 **********************************************************************************************************************/
import moment from "moment";
import axios from "axios";
import "moment/locale/de"; // import the locale even though webpack ignores moment/locale
import cfg from "../../config";

const SELECTOR_SERVER_TIME = "time[data-server-time]";
const SELECTOR_MY_TIME = "time[data-my-time]";
const SELECTOR_PROGRESS = ".aw-progress-turn";
const SELECTOR_TIME_NEXT_TURN = "time[data-time-next-turn]";
const SELECTOR_PROGRESSBAR_VALUE = ".aw-progress__bar-value";
const SELECTOR_CURRENT_GAME =
    ".aw-header__submenu-item-link--active[data-gameid]";
const SELECTOR_TURN = ".aw-turn__value";
const DATA_MAX = "data-max";
const DATA_VALUE = "data-value";
const DATA_GAMEID = "data-gameid";

/*
 * get current game from DOM
 * @returns {int} current game number
 */
const getCurrentGame = () => {
    return parseInt(
        document
            .querySelector(SELECTOR_CURRENT_GAME)
            .getAttribute(DATA_GAMEID) || 0,
        10
    );
};

/*
 * get current locale from DOM
 * @returns {string} locale - must be one of cfg.LOCALES.SUPPORT || cfg.LOCALES.DEFAULT
 */
const getCurrentLocale = () => {
    let domLocale = document.querySelector("html").getAttribute("lang");
    let returnLocale = cfg.LOCALES.DEFAULT;
    cfg.LOCALES.SUPPORT.forEach(locale => {
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
    const turn = document.querySelector(SELECTOR_TURN).textContent;
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
    const _serverTime = document.querySelector(SELECTOR_SERVER_TIME);
    const _progress = document.querySelector(SELECTOR_PROGRESS);
    const oldText = _serverTime.textContent;
    const display = moment(time).format("LT");
    _serverTime.textContent = display;
    _serverTime.setAttribute("datetime", time);
    // update progress only if servertime changes
    // do not update progress for the first time when we update the textContent
    if (oldText !== display && oldText !== "00:00") {
        updateProgress(
            parseInt(_progress.getAttribute(DATA_MAX), 10),
            parseInt(_progress.getAttribute(DATA_VALUE), 10) + 1
        );
    }
};

/*
 * update "next turn" time
 * @param {string} time - ISO 8601 string
 */
const updateNextTurnTime = time => {
    const _nextTurnTime = document.querySelector(SELECTOR_TIME_NEXT_TURN);
    _nextTurnTime.textContent = moment(time).format("LT");
    _nextTurnTime.setAttribute("datetime", time);
};

/*
 * update progress bar(s)
 * @param {int} max - turn duration in minutes
 * @param {int} value - minutes passed in current turn
 */
const updateProgress = (max, value) => {
    const _progress = document.querySelector(SELECTOR_PROGRESS);
    const _path = document.querySelector(SELECTOR_PROGRESSBAR_VALUE);
    const _nextTurn = document.querySelector(SELECTOR_TIME_NEXT_TURN);
    let colorClass = "aw-progress__bar-value--";
    let pct;

    if (value > max) return;

    pct = parseInt(100 - value / max * 100, 10);
    if (pct >= 0 && pct <= 20) colorClass += "1";
    if (pct > 21 && pct <= 40) colorClass += "2";
    if (pct > 41 && pct <= 60) colorClass += "3";
    if (pct > 61 && pct <= 80) colorClass += "4";
    if (pct > 81) colorClass += "5";

    cfg.DEBUG &&
        console.log(
            `updating turn progress to ${value}/${max}, ${100 -
                pct}%, dashoffset ${pct}.`
        );

    // modify DOM
    _progress.setAttribute(DATA_MAX, max);
    _progress.setAttribute(DATA_VALUE, value);
    _path.classList.remove(
        "aw-progress__bar-value--1",
        "aw-progress__bar-value--2",
        "aw-progress__bar-value--3",
        "aw-progress__bar-value--4",
        "aw-progress__bar-value--5"
    );
    _path.classList.add(colorClass);
    _path.setAttribute("stroke-dashoffset", `${pct}`);

    if (value === max) {
        _nextTurn.textContent = "Jetzt"; // TODO: i18n
        // TODO
        // problem: asking the server when we do the last update is imprecise. maybe the server isn't ready yet.
        // TODO FIND A WAY TO DO THIS PULSE WHEN THE SERVER IS DONE WITH THE TURN
        doServerPulse();
    }
};

/*
 * update "current turn"
 */
const updateCurrentTurn = turn => {
    const _turn = document.querySelector(SELECTOR_TURN);
    _turn.textContent = turn ? turn : "0";
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

    cfg.DEBUG && console.log(`requesting pulse from server for g${gameNumber}`);
    axios
        .get(`/api/pulse/${gameNumber}`)
        .then(response => {
            let turn = getCurrentTurn();
            let delay = 60 * 2;
            if ( response.status === 200 ) {
                let data = response.data;
                cfg.DEBUG && console.log("recieved pulse:", data);
                if (turn === data.turn.currentNumber) {
                    cfg.DEBUG && console.warn("same turn. do pulse again.");
                    setTimeout( () => doServerPulse(), 1000 * delay);
                } else {
                    applyServerPulse(data);
                }
            }
        })
        .catch(error => {
            console.warn(error);
        });
};

/*
 * apply server data in DOM
 * @params {object} pulse
 */
const applyServerPulse = pulse => {
    let max = pulse.turn.duration;
    let now = moment();
    let nextTurn = moment(pulse.turn.nextTime);
    let value = Math.round(nextTurn.diff(now, "minutes", true));
    let turn = getCurrentTurn();
    console.log(`minutes to turn processing ${value}/${max}`);
    updateYourTime();
    updateServerTime(pulse.serverTime);
    updateNextTurnTime(nextTurn.toISOString());
    if (turn !== pulse.turn.currentNumber) {
        updateCurrentTurn(pulse.turn.currentNumber);
    }
    updateProgress(max, max - value);
};

const initTime = () => {
    const _serverTime = document.querySelector(SELECTOR_SERVER_TIME);
    const _myTime = document.querySelector(SELECTOR_MY_TIME);
    const _progress = document.querySelector(SELECTOR_PROGRESS);
    const _nextTurn = document.querySelector(SELECTOR_TIME_NEXT_TURN);
    const pulse = 20; // cycle duration in seconds

    // fail silently if there is no time that needs to be updated.
    if (
        _serverTime.length < 1 ||
        _myTime.length < 1 ||
        _progress.length < 1 ||
        _nextTurn.length < 1
    )
        return;

    // locale comes from server lang attribute on html element
    moment.locale(getCurrentLocale());

    setInterval(() => domUpdateCollection(pulse), 1000 * pulse);

    // TODO: ASK SERVER

    //console.log(_serverTime);
    //console.log(_myTime);
    //console.log(_progress);
    //console.log(_nextTurn);
    //console.log(isoTime);

    updateYourTime();
    updateServerTime(
        moment(_serverTime.getAttribute("datetime")).toISOString()
    );
    updateNextTurnTime(
        moment(_nextTurn.getAttribute("datetime")).toISOString()
    );
};

export { initTime };
