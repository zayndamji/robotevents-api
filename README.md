# RobotEvents API Wrapper
<a href="https://www.npmjs.com/package/robotevents-api"><img src="https://img.shields.io/npm/v/robotevents-api"></a>
<a href="https://www.npmjs.com/package/robotevents-api"><img src="https://badgen.net/packagephobia/install/robotevents-api"></a>
<a href="https://github.com/zaypers/robotevents-api/blob/main/LICENSE"><img src="https://img.shields.io/github/license/zaypers/robotevents-api"></a>
<br>

This is a wrapper for the RobotEvents API:  
https://www.robotevents.com/api/v2  

Currently it's in the Alpha phase supporting  
\- getting Team(s), including the events, matches, rankings, skills, and awards.  
\- getting Event(s), including the teams, matches, rankings, skills, and awards.  
There are still limited parameters compared to the actual RobotEvents API, as programs / seasons aren't in the API with get() commands yet.

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

## Documentation

To fetch a ``Team``, use the method ``robotevents.teams.get(number, program)``. Replace ``number`` with the team number (ex. 392X or 23900B) and replace ``program`` with the program (ex. VRC or VIQC).
```javascript
const team = await robotevents.teams.get('392X', robotevents.Programs.VRC);
const events = await team.events({ /* put optional parameters here */ });
const matches = await team.matches({ /* put optional parameters here */ });
const rankings = await team.rankings({ /* put optional parameters here */ });
const skills = await team.skills({ /* put optional parameters here */ });
const awards = await team.awards({ /* put optional parameters here */ });
```  

To fetch an ``Event``, use the method ``robotevents.events.get(sku)``. Replace ``sku`` with the event sku (ex. RE-VRC-22-7950).
```javascript
const event = await robotevents.events.get('RE-VRC-22-7950');
const teams = await event.teams({ /* put optional parameters here */ });
const skills = await event.skills({ /* put optional parameters here */ });
const awards = await event.awards({ /* put optional parameters here */ });
const matches = await event.matches({ /* put optional parameters here */ });
const rankings = await event.rankings({ /* put optional parameters here */ });
```  