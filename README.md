# RobotEvents API Wrapper
<a href="https://www.npmjs.com/package/robotevents-api"><img src="https://img.shields.io/npm/v/robotevents-api"></a>
<a href="https://www.npmjs.com/package/robotevents-api"><img src="https://badgen.net/packagephobia/install/robotevents-api"></a>
<a href="https://github.com/zaypers/robotevents-api/blob/main/LICENSE"><img src="https://img.shields.io/github/license/zaypers/robotevents-api"></a>
<br>

This is a wrapper for the RobotEvents API:  
https://www.robotevents.com/api/v2  

Extended documentation is located at:  
https://zaypers.github.io/robotevents-api/  

Currently it's in the Alpha phase supporting  
\- getting Team(s) and their events, matches, rankings, skills, awards.  
\- getting Event(s)  

## Installation

To start using this package, install it using ``npm`` and a ``terminal``. Enter this command into the terminal:
```
npm install robotevents-api
```

Also install the dotenv package:  
https://www.npmjs.com/package/dotenv  
```
npm install dotenv
```

In a .env file in the directory with your app.js file, add your RobotEvents token with the key of 'TOKEN'.  

<img src="https://github.com/zaypers/robotevents-api/raw/main/assets/source-dir.png" style="width: 14em"><br>  

Example (this is not a real token):  
<img src="https://github.com/zaypers/robotevents-api/raw/main/assets/dotenv-token.png">  

## Usage

In your ``app.js`` or ``index.js`` file, start by writing:  
```javascript
main();

async function main() {
  // start your code here
};
```  
This is required because all functions ran using this package are ``async``, meaning they run in the background. Whenever you call a method, you will have to use the keyword ``await`` before it.  

To fetch a ``Team``, use the method ``robotevents.teams.get(number, program)``. Replace ``number`` with the team number (ex. 392X or 23900B) and replace ``program`` with the program (ex. VRC or VIQC).
```javascript
const team = await robotevents.teams.get('392X', 'VRC');
```  
This will return a ``Team`` object. For more details on the data that a ``Team`` object contains, go to the file ``/src/api/teams.ts``.  

The ``Team`` object contains several methods, mostly mirrored with the URLs on https://www.robotevents.com/api/v2: ``.events()``, ``.matches()``, ``rankings()``, ``skills()``, ``awards()``.  

```javascript
const team = await robotevents.teams.get('392X', 'VRC');
const events = await team.events();
const matches = await team.matches();
const rankings = await team.rankings();
const skills = await team.skills();
const awards = await team.awards();
```  

``Team.events()`` - Fetches all events of a team.

```javascript
const team = await robotevents.teams.get('23900B', 'VRC');
const events = await team.events({
  sku: 'RE-VRC-21-5434',
  season: '2021-2022',
  start: '2022-05-02T00:00:00Z',
  end: '2022-05-06T00:00:00Z',
  level: 'World'
});
```

``Team.matches()`` - Fetches all matches of a team. <i>Warning: this function takes a lot of time. To reduce the amount of time, specify an event's RobotEvents ID.</i>

```javascript
const team = await robotevents.teams.get('23900B', 'VRC');
const matches = await team.matches({
  eventId: 45414,
  season: '2021-2022',
  round: 'round-of-16',
  instance: 1,
  matchnum: 1
});
```

``Team.rankings()`` - Fetches all rankings of a team.

```javascript
const team = await robotevents.teams.get('23900B', 'VRC');
const rankings = await team.rankings({
  eventId: 46025,
  rank: 19,
  season: "2021-2022"
});
```

``Team.rankings()`` - Fetches all skills runs of a team. <i>Note: driver and programming skills runs are seperate.</i>

```javascript
const team = await robotevents.teams.get('23900B', 'VRC');
const skills = await team.skills({
  eventId: 47030,
  type: 'driver',
  season: '2021-2022'
});
```

``Team.awards()`` - Fetches all awards of a team.

```javascript
const team = await robotevents.teams.get('315B', 'VRC');
const awards = await team.awards({
  eventId: 47029,
  season: '2020-2021'
});
```

To fetch an ``Event``, use the method ``robotevents.events.get(sku)``. Replace ``sku`` with the event sku (ex. RE-VRC-22-7950).
```javascript
const team = await robotevents.events.get('RE-VRC-22-7950');
```  
This will return a ``Event`` object. For more details on the data that a ``Event`` object contains, go to the file ``/src/api/events.ts``.  

``Event.teams()`` - Fetches all teams of an event.

```javascript
const event = await robotevents.events.get('RE-VRC-22-7950');
const awards = await event.teams({
  number: '392X'
});
```