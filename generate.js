import fs from 'fs';
import * as s from './simple-statistics.js';

let girlNames = JSON.parse((fs.readFileSync('girl-names.json', 'utf-8')));
let boyNames = JSON.parse((fs.readFileSync('boy-names.json', 'utf-8')));
let lastNames = JSON.parse((fs.readFileSync('last-names.json', 'utf-8')));
let regions = ['Malmö', 'Göteborg', 'Stockholm'];

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}

let data = [];

for (let i = 0; i < 1000; i++) {
  let firstName, lastName;
  while (true) {
    let gender = Math.random() < 0.5 ? "male" : "female";
    let firstNameList = gender === 'male' ? boyNames : girlNames;
    firstName = firstNameList.random();
    lastName = lastNames.random();
    if (data.find(x => x.firstName === firstName && x.lastName === lastName)) {
      continue;
    }
    let age = Math.floor(Math.random() * (65 - 18)) + 18;
    let region = regions.random();
    let monthlySalarySEK = Math.floor(Math.random() * (60000 - 20000)) + 20000;
    if (Math.random() > 0.15) {
      monthlySalarySEK *= age / 30;
    }
    if (Math.random() > 0.25 && gender === "male") {
      monthlySalarySEK *= 1.10;
    }
    if (Math.random() > 0.3) {
      let index = regions.indexOf(region);
      monthlySalarySEK *= index === 0 ? 1 : index === 1 ? 1.05 : 1.10;
    }
    monthlySalarySEK = Math.floor(monthlySalarySEK);
    data.push({ firstName, lastName, gender, age, region, monthlySalarySEK });
    break;
  }


}

let girls = data.filter(x => x.gender === 'female').map(x => x.monthlySalarySEK);
let boys = data.filter(x => x.gender === 'male').map(x => x.monthlySalarySEK);
let malmo = data.filter(x => x.region === 'Malmö').map(x => x.monthlySalarySEK);
let gbg = data.filter(x => x.region === 'Göteborg').map(x => x.monthlySalarySEK);
let sthm = data.filter(x => x.region === 'Stockholm').map(x => x.monthlySalarySEK);

console.log("girls", s.mean(girls));
console.log("boys", s.mean(boys));
console.log('malmo', s.mean(malmo));
console.log('gbg', s.mean(gbg));
console.log('sthm', s.mean(sthm));

fs.writeFileSync('salaries.json', JSON.stringify(data, '', '  '), 'utf-8');