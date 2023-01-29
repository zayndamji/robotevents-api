(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const robotevents = require('robotevents-api');
},{"robotevents-api":12}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.get = void 0;
const request_1 = require("../funcs/request");
const letters_1 = require("../data/letters");
const rounds_1 = require("../data/rounds");
const teams_1 = require("./teams");
const skills_1 = require("./skills");
const rankings_1 = require("./rankings");
async function get(idSku) {
    let reqUrl = '', reqArgs = [], id = false, data;
    idSku = `${idSku}`;
    if (!letters_1.letters.test(idSku.toLowerCase())) {
        id = true;
        reqUrl = `events/${idSku}`;
    }
    else {
        reqUrl = `events`;
        reqArgs.push(`sku%5B%5D=${idSku}`);
    }
    data = await (0, request_1.request)(reqUrl, reqArgs);
    // @ts-ignore
    return new Event(data[0]);
}
exports.get = get;
/**
 * Contains methods mirrored from RobotEvents API for /events.
 */
class Event {
    constructor(eventData = {}) {
        this.id = 0;
        this.sku = "";
        this.name = "";
        this.start = "";
        this.end = "";
        this.season = {
            id: 0,
            name: "",
            code: null
        };
        this.program = {
            id: 0,
            name: "",
            code: ""
        };
        this.location = {
            venue: "",
            address_1: "",
            address_2: "",
            city: "",
            region: "",
            postcode: "",
            country: "",
            coordinates: {
                lat: 0,
                lon: 0
            }
        };
        this.divisions = [];
        this.level = "";
        this.ongoing = false;
        this.awards_finalized = false;
        this.event_type = "";
        const entries = Object.entries(eventData);
        for (let i = 0; i < entries.length; i++) {
            // @ts-ignore
            this[entries[i][0]] = entries[i][1];
        }
    }
    /**
     * Fetches teams of an event.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/teams
     *
     * @example
     * const event = await robotevents.events.get('RE-VRC-21-7030');
     * const teams = await event.teams({
     *  number: '23900B',
     *  registered: false,
     *  grade: "Middle School",
     *  country: 'US'
     * });
     *
     */
    async teams(options = {}) {
        let reqUrl = `events/${this.id}/teams`;
        let reqArgs = [];
        if (options.number != undefined)
            reqArgs.push(`number%5B%5D=${options.number.toUpperCase()}`);
        if (options.registered != undefined)
            reqArgs.push(`registered=${options.registered}`);
        if (options.grade != undefined)
            reqArgs.push(`grade=${options.grade}`);
        if (options.country != undefined)
            reqArgs.push(`country%5B%5D=${options.country}`);
        const unparsedTeams = await (0, request_1.request)(reqUrl, reqArgs);
        const teams = [];
        for (const event of unparsedTeams) {
            teams.push(new teams_1.Team(event));
        }
        return teams;
    }
    /**
     * Fetches skills of an event.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/skills
     *
     * @example
     * const event = await robotevents.events.get(47030);
     * const skills = await event.skills({
     *   teamId: 136072,
     *   type: 'driver'
     * });
     *
     */
    async skills(options = {}) {
        let reqUrl = `events/${this.id}/skills`;
        let reqArgs = [];
        if (options.teamId != undefined)
            reqArgs.push(`team%5B%5D=${options.teamId}`);
        if (options.type != undefined)
            reqArgs.push(`type%5B%5D=${options.type}`);
        const unparsedSkills = await (0, request_1.request)(reqUrl, reqArgs);
        const skills = [];
        for (const skillsRun of unparsedSkills) {
            skills.push(new skills_1.Skills(skillsRun));
        }
        return skills;
    }
    /**
     * Fetches awards of an event.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/awards
     *
     * @example
     * const event = await robotevents.events.get('RE-VRC-22-0008');
     * const awards = await event.awards({
     *   teamId: 139290,
     *   winner: '392X'
     * });
     *
     */
    async awards(options = {}) {
        let reqUrl = `events/${this.id}/awards`;
        let reqArgs = [];
        if (options.teamId != undefined)
            reqArgs.push(`team%5B%5D=${options.teamId}`);
        if (options.winner != undefined)
            reqArgs.push(`winner%5B%5D=${options.winner}`);
        return (await (0, request_1.request)(reqUrl, reqArgs));
    }
    /**
     * Fetches matches of an event (by division).
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/divisions/{div}/matches
     *
     * @example
     * const event = await robotevents.events.get('RE-VRC-22-0008');
     * const matches = await event.matches({
     *   divId: 1,
     *   teamId: 139290,
     *   round: 'qualifications',
     *   instance: 1,
     *   matchnum: 4
     * });
     *
     */
    async matches(options = {}) {
        var _a;
        options.divId = (_a = options.divId) !== null && _a !== void 0 ? _a : 1;
        let reqUrl = `events/${this.id}/divisions/${options.divId}/matches`;
        let reqArgs = [];
        if (options.teamId != undefined)
            reqArgs.push(`team%5B%5D=${options.teamId}`);
        if (options.round != undefined) {
            options.round == options.round.toLowerCase();
            if (options.round.substring(0, 4) in rounds_1.rounds) { // @ts-ignore
                reqArgs.push(`round%5B%5D=${rounds_1.rounds[options.round.substring(0, 4)]}`);
            }
        }
        if (options.instance != undefined)
            reqArgs.push(`instance%5B%5D=${options.instance}`);
        if (options.matchnum != undefined)
            reqArgs.push(`matchnum%5B%5D=${options.matchnum}`);
        return (await (0, request_1.request)(reqUrl, reqArgs));
    }
    /**
     * Fetches rankings of an event (by division).
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /events/{id}/divisions/{div}/rankings
     *
     * @example
     * const event = await robotevents.events.get('RE-VRC-22-0008');
     * const rankings = await event.rankings({
     *   divId: 1,
     *   teamId: 139290,
     *   rank: 2
     * });
     *
     */
    async rankings(options = {}) {
        var _a;
        options.divId = (_a = options.divId) !== null && _a !== void 0 ? _a : 1;
        let reqUrl = `events/${this.id}/divisions/${options.divId}/rankings`;
        let reqArgs = [];
        if (options.teamId != undefined)
            reqArgs.push(`team%5B%5D=${options.teamId}`);
        if (options.rank != undefined)
            reqArgs.push(`rank%5B%5D=${options.rank}`);
        const unparsedRankings = await (0, request_1.request)(reqUrl, reqArgs);
        const rankings = [];
        for (const ranking of unparsedRankings) {
            rankings.push(new rankings_1.Rankings(ranking));
        }
        return rankings;
    }
}
exports.Event = Event;

},{"../data/letters":7,"../data/rounds":8,"../funcs/request":10,"./rankings":4,"./skills":5,"./teams":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Programs = void 0;
var Programs;
(function (Programs) {
    Programs[Programs["DEFAULT"] = 0] = "DEFAULT";
    Programs[Programs["VRC"] = 1] = "VRC";
    Programs[Programs["VEXU"] = 4] = "VEXU";
    Programs[Programs["WORKSHOP"] = 37] = "WORKSHOP";
    Programs[Programs["VIQC"] = 41] = "VIQC";
    Programs[Programs["NRL"] = 43] = "NRL";
    Programs[Programs["ADC"] = 44] = "ADC";
    Programs[Programs["TVRC"] = 46] = "TVRC";
    Programs[Programs["TIQC"] = 47] = "TIQC";
    Programs[Programs["VRAD"] = 51] = "VRAD";
    Programs[Programs["BELLAVR"] = 55] = "BELLAVR";
    Programs[Programs["FAC"] = 56] = "FAC";
    Programs[Programs["VAIC"] = 57] = "VAIC";
})(Programs = exports.Programs || (exports.Programs = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rankings = void 0;
class Rankings {
    constructor(rankingsData = {}) {
        this.id = 0;
        this.rank = 0;
        this.event = {
            id: 0,
            name: "",
            code: ""
        };
        this.division = {
            id: 0,
            name: "",
            code: null
        };
        this.team = {
            id: 0,
            name: "",
            code: null
        };
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
        this.wp = 0;
        this.ap = 0;
        this.sp = 0;
        this.high_score = 0;
        this.average_points = 0;
        this.total_points = 0;
        const entries = Object.entries(rankingsData);
        for (let i = 0; i < entries.length; i++) {
            // @ts-ignore
            this[entries[i][0]] = entries[i][1];
        }
    }
}
exports.Rankings = Rankings;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skills = void 0;
class Skills {
    constructor(skillsData = {}) {
        this.id = 0;
        this.type = "";
        this.event = {
            id: 0,
            name: "",
            code: ""
        };
        this.team = {
            id: 0,
            name: "",
            code: null
        };
        this.season = {
            id: 0,
            name: "",
            code: null
        };
        this.division = null;
        this.rank = 0;
        this.score = 0;
        this.attempts = 0;
        const entries = Object.entries(skillsData);
        for (let i = 0; i < entries.length; i++) {
            // @ts-ignore
            this[entries[i][0]] = entries[i][1];
        }
    }
}
exports.Skills = Skills;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = exports.get = void 0;
const request_1 = require("../funcs/request");
const capitalize_1 = require("../funcs/capitalize");
const seasons_1 = require("../funcs/seasons");
const letters_1 = require("../data/letters");
const rounds_1 = require("../data/rounds");
const events_1 = require("./events");
const skills_1 = require("./skills");
const rankings_1 = require("./rankings");
const programs_1 = require("./programs");
async function get(idNumber, program = programs_1.Programs.DEFAULT) {
    let reqUrl = '', reqArgs = [], id = false, data;
    idNumber = `${idNumber}`;
    if (!letters_1.letters.test(idNumber.toLowerCase())) {
        id = true;
        reqUrl = `teams/${idNumber}`;
    }
    else {
        reqUrl = `teams`;
        reqArgs.push(`number%5B%5D=${idNumber}`);
    }
    if (program != programs_1.Programs.DEFAULT)
        reqArgs.push(`program%5B%5D=${program}`);
    data = await (0, request_1.request)(reqUrl, reqArgs);
    // @ts-ignore
    return new Team(data[0]);
}
exports.get = get;
/**
 * Contains methods mirrored from RobotEvents API for /teams.
 */
class Team {
    constructor(teamData = {}) {
        this.id = 0;
        this.number = '';
        this.team_name = '';
        this.robot_name = '';
        this.organization = '';
        this.registered = false;
        this.program = { id: 0, name: '', code: '' };
        this.grade = '';
        this.location = {
            venue: '',
            address_1: '',
            address_2: '',
            city: '',
            region: '',
            postcode: '',
            country: '',
            coordinates: { lat: 0, lon: 0 }
        };
        const entries = Object.entries(teamData);
        for (let i = 0; i < entries.length; i++) {
            // @ts-ignore
            this[entries[i][0]] = entries[i][1];
        }
    }
    /**
     * Fetches events of a team.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/events
     *
     * @example
     * const team = await robotevents.teams.get('23900B', 'VRC');
     * const events = await team.events({
     *  sku: 'RE-VRC-21-5434',
     *  season: '2021-2022',
     *  start: '2022-05-02T00:00:00Z',
     *  end: '2022-05-06T00:00:00Z',
     *  level: 'World'
     * });
     *
     */
    async events(options = {}) {
        let reqUrl = `teams/${this.id}/events`;
        let reqArgs = [];
        if (options.sku != undefined)
            reqArgs.push(`sku%5B%5D=${options.sku}`); // @ts-ignore
        if (options.season != undefined)
            reqArgs.push(`season%5B%5D=${seasons_1.Seasons[this.program.code.toUpperCase()][options.season]}`);
        if (options.start != undefined)
            reqArgs.push(`start=${options.start}`);
        if (options.end != undefined)
            reqArgs.push(`end=${options.end}`);
        if (options.level != undefined) {
            options.level = (0, capitalize_1.capitalize)(options.level);
            reqArgs.push(`level%5B%5D=${options.level}`);
        }
        const unparsedEvents = await (0, request_1.request)(reqUrl, reqArgs);
        const events = [];
        for (const event of unparsedEvents) {
            events.push(new events_1.Event(event));
        }
        return events;
    }
    /**
     * Fetches matches of a team.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/matches
     *
     * @example
     * const team = await robotevents.teams.get('23900B', 'VRC');
     * const matches = await team.matches({
     *   eventId: 45414,
     *   season: '2021-2022',
     *   round: 'round-of-16',
     *   instance: 1,
     *   matchnum: 1
     * });
     */
    async matches(options = {}) {
        let reqUrl = `teams/${this.id}/matches`;
        let reqArgs = [];
        if (options.eventId != undefined)
            reqArgs.push(`event%5B%5D=${options.eventId}`); // @ts-ignore
        if (options.season != undefined)
            reqArgs.push(`season%5B%5D=${seasons_1.Seasons[this.program.code.toUpperCase()][options.season]}`);
        if (options.round != undefined) {
            options.round == options.round.toLowerCase();
            if (options.round.substring(0, 4) in rounds_1.rounds) { // @ts-ignore
                reqArgs.push(`round%5B%5D=${rounds_1.rounds[options.round.substring(0, 4)]}`);
            }
        }
        if (options.instance != undefined)
            reqArgs.push(`instance%5B%5D=${options.instance}`);
        if (options.matchnum != undefined)
            reqArgs.push(`matchnum%5B%5D=${options.matchnum}`);
        return (await (0, request_1.request)(reqUrl, reqArgs));
    }
    /**
     * Fetches rankings of a team.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/rankings
     *
     * @example
     * const team = await robotevents.teams.get('23900B', 'VRC');
     * const rankings = await team.rankings({
     *   eventId: 46025,
     *   rank: 19,
     *   season: "2021-2022"
     * });
     *
     */
    async rankings(options = {}) {
        let reqUrl = `teams/${this.id}/rankings`;
        let reqArgs = [];
        if (options.eventId != undefined)
            reqArgs.push(`event%5B%5D=${options.eventId}`);
        if (options.rank != undefined)
            reqArgs.push(`rank%5B%5D=${options.rank}`); // @ts-ignore
        if (options.season != undefined)
            reqArgs.push(`season%5B%5D=${seasons_1.Seasons[this.program.code.toUpperCase()][options.season]}`);
        const unparsedRankings = await (0, request_1.request)(reqUrl, reqArgs);
        const rankings = [];
        for (const ranking of unparsedRankings) {
            rankings.push(new rankings_1.Rankings(ranking));
        }
        return rankings;
    }
    /**
     * Fetches skills of a team.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/skills
     *
     * @example
     * const team = await robotevents.teams.get('23900B', 'VRC');
     * const skills = await team.skills({
     *   eventId: 47030,
     *   type: 'driver',
     *   season: '2021-2022'
     * });
     *
     */
    async skills(options = {}) {
        let reqUrl = `teams/${this.id}/skills`;
        let reqArgs = [];
        if (options.eventId != undefined)
            reqArgs.push(`event%5B%5D=${options.eventId}`);
        if (options.type != undefined)
            reqArgs.push(`type%5B%5D=${options.type.toLowerCase()}`); // @ts-ignore
        if (options.season != undefined)
            reqArgs.push(`season%5B%5D=${seasons_1.Seasons[this.program.code.toUpperCase()][options.season]}`);
        const unparsedSkills = await (0, request_1.request)(reqUrl, reqArgs);
        const skills = [];
        for (const skillsRun of unparsedSkills) {
            skills.push(new skills_1.Skills(skillsRun));
        }
        return skills;
    }
    /**
     * Fetches awards of a team.
     *
     * @param options Object of perameters, mirrored from RobotEvents API - /teams/{id}/awards
     *
     * @example
     * const team = await robotevents.teams.get('315B', 'VRC');
     * const awards = await team.awards({
     *   eventId: 47030,
     *   season: '2020-2021'
     * });
     *
     */
    async awards(options = {}) {
        let reqUrl = `teams/${this.id}/awards`;
        let reqArgs = [];
        if (options.eventId != undefined)
            reqArgs.push(`event%5B%5D=${options.eventId}`); // @ts-ignore
        if (options.season != undefined)
            reqArgs.push(`season%5B%5D=${seasons_1.Seasons[this.program.code.toUpperCase()][options.season]}`);
        return (await (0, request_1.request)(reqUrl, reqArgs));
    }
}
exports.Team = Team;

},{"../data/letters":7,"../data/rounds":8,"../funcs/capitalize":9,"../funcs/request":10,"../funcs/seasons":11,"./events":2,"./programs":3,"./rankings":4,"./skills":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.letters = void 0;
exports.letters = /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rounds = void 0;
exports.rounds = {
    "prac": 1,
    "qual": 2,
    "quar": 3,
    "semi": 4,
    "fina": 5,
    "roun": 6
};

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
function capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
}
exports.capitalize = capitalize;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.setMode = exports.setToken = void 0;
const node_fetch_1 = require("node-fetch");
let token = '', mode = 'token';
function setToken(newToken) {
    token = newToken;
}
exports.setToken = setToken;
function setMode(newMode) {
    mode = newMode;
}
exports.setMode = setMode;
async function request(url, args = []) {
    let isNextPage = true, currentIndex = 1, data = [], argsStr = ``;
    for (let i = 0; i < args.length; i++) {
        argsStr += `&${args[i]}`;
    }
    while (isNextPage != null) {
        const fetched = await (0, node_fetch_1.default)(`https://www.robotevents.com/api/v2/${url}?per_page=100&page=${currentIndex}${argsStr}`, {
            headers: mode == 'token' ? {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            } : mode == 'cookie' ? {
                'Accept': 'application/json',
                'Cookie': token
            } : {}
        });
        const json = await fetched.json();
        if (json.data != undefined) {
            if (json.data[0] != undefined) {
                data = data.concat(json.data);
            }
            isNextPage = json.meta['next_page_url'];
        }
        else {
            data.push(json);
            isNextPage = null;
        }
        currentIndex++;
    }
    return data;
}
exports.request = request;

},{"node-fetch":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seasons = void 0;
exports.Seasons = {
    "VRC": {
        "2022-2023": 173,
        "2021-2022": 154,
        "2020-2021": 139,
        "2019-2020": 130,
        "2018-2019": 125,
        "2017-2018": 119,
        "2016-2017": 115,
        "2015-2016": 110,
        "2014-2015": 102,
        "2013-2014": 92,
        "2012-2013": 85,
        "2011-2012": 73,
        "2010-2011": 7,
        "2009-2010": 1
    },
    "VEXU": {
        "2022-2023": 175,
        "2021-2022": 156,
        "2020-2021": 140,
        "2019-2020": 131,
        "2018-2019": 126,
        "2017-2018": 120,
        "2016-2017": 116,
        "2015-2016": 111,
        "2014-2015": 103,
        "2013-2014": 93,
        "2012-2013": 88,
        "2011-2012": 76,
        "2010-2011": 10,
        "2009-2010": 4
    },
    "WORKSHOP": {
        "2022-2023": 118,
        "2015-2016": 113,
        "2014-2015": 107,
        "2013-2014": 98
    },
    "VIQC": {
        "2022-2023": 174,
        "2021-2022": 155,
        "2020-2021": 138,
        "2019-2020": 129,
        "2018-2019": 124,
        "2017-2018": 121,
        "2016-2017": 114,
        "2015-2016": 109,
        "2014-2015": 101,
        "2013-2014": 96
    },
    "NRL": {
        "2019-2020": 137
    },
    "ADC": {
        "2022-2023": 176,
        "2021-2022": 158,
        "2020-2021": 144,
        "2019-2020": 134
    },
    "TVRC": {
        "2021-2022": 167,
        "2020-2021": 142,
        "2019-2020": 136
    },
    "TIQC": {
        "2021-2022": 166,
        "2020-2021": 141,
        "2019-2020": 135
    },
    "VRAD": {
        "2021-2022": 157,
        "2020-2021": 149
    },
    "BELLAVR": {
        "2022-2023": 172,
        "2020-2021": 152
    },
    "FAC": {
        "2021-2022": 165
    },
    "VAIC": {
        "2021-2022": 171
    }
};

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.request = exports.setMode = exports.setToken = exports.Programs = exports.rankings = exports.skills = exports.events = exports.teams = void 0;
exports.teams = require("./api/teams");
exports.events = require("./api/events");
exports.skills = require("./api/skills");
exports.rankings = require("./api/rankings");
var programs_1 = require("./api/programs");
Object.defineProperty(exports, "Programs", { enumerable: true, get: function () { return programs_1.Programs; } });
var request_1 = require("./funcs/request");
Object.defineProperty(exports, "setToken", { enumerable: true, get: function () { return request_1.setToken; } });
Object.defineProperty(exports, "setMode", { enumerable: true, get: function () { return request_1.setMode; } });
Object.defineProperty(exports, "request", { enumerable: true, get: function () { return request_1.request; } });
exports.version = '0.3.1';

},{"./api/events":2,"./api/programs":3,"./api/rankings":4,"./api/skills":5,"./api/teams":6,"./funcs/request":10}],13:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

module.exports = exports = globalObject.fetch;

// Needed for TypeScript and Webpack.
if (globalObject.fetch) {
	exports.default = globalObject.fetch.bind(global);
}

exports.Headers = globalObject.Headers;
exports.Request = globalObject.Request;
exports.Response = globalObject.Response;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
