//==============================================================================
// check.js
//==============================================================================
//==============================================================================
// flatten
// takes goal and rules as arguments
// return flattened version of the goal
// in terms of base relations and builtins
//==============================================================================

var residues;
var lambda = [];

function flatten (p,rules)
 {
    residues = unwind(p,rules);
  var newrules = seq();
  for (var i=0; i<residues.length; i++)
      {newrules.push(seq('rule',p).concat(residues[i]))}
  return newrules}

function unwind (p,rules)
 {thing = p;
  residues = seq();
  unwindexp(p,seq(),nil,nil,rules);
  return residues}

function unwindexp (p,pl,al,rs,rules)
 {
    if (symbolp(p)) {return unwindsymbol(p,pl,al,rs,rules)};
  if (p[0] == 'not') {return unwindnot(p[1],pl,al,rs,rules)};
  if (p[0] == 'and') {return unwindand(p,pl,al,rs,rules)};
  if (p[0] == 'or') {return unwindor(p,pl,al,rs,rules)};
  if (p[0] == 'same') {return unwindexit(pl,al,cons(p,rs),rules)};
  if (p[0] == 'distinct') {return unwindexit(pl,al,cons(p,rs),rules)};
  if (staticp(p[0])) {return unwindstatic(p,pl,al,rs,rules)};
  if (!viewp(p[0],rules)) {return unwindexit(pl,al,cons(p,rs),rules)};
  return unwinddb(p,pl,al,rs,rules)}

function unwindnot (p,pl,al,rs,rules)
 {if (symbolp(p))
     {return unwindnotsymbol(p,pl,al,rs,rules)};
  if (p[0] == 'not') {return unwindexp(p[1],pl,al,rs,rules)};
  if (p[0] == 'and') {return unwindnotand(p,pl,al,rs,rules)};
  if (p[0] == 'or') {return unwindor(p,pl,al,rs,rules)};
  if (p[0] == 'same') {return unwindexit(pl,al,cons(makenegation(p),rs),rules)};
  if (p[0] == 'distinct') {return unwindexit(pl,al,cons(makenegation(p),rs),rules)};
  if (!viewp(p[0],rules)) {return unwindexit(pl,al,cons(makenegation(p),rs),rules)};
  return false}

function unwindsymbol (p,pl,al,rs,rules)
 {if (p == 'true') {return unwindexit(pl,al,rs,rules)};
  if (p == 'false') {return false};
  return unwinddb(p,pl,al,rs,rules)}

function unwindnotsymbol (p,pl,al,rs,rules)
 {if (p == 'true') {return false};
  if (p == 'false') {return unwindexit(pl,al,rs,rules)};
  return false}

function unwindand (p,pl,al,rs,rules)
 {return unwindexit(append(tail(p),pl),al,rs,rules)}

function unwindnotand (p,pl,al,rs,rules)
 {for (var i=0; i<p.length; i++) {unwindnot(p[i],pl,al,rs,rules)};
  return false}

function unwindor (p,pl,al,rs,rules)
 {for (var i=0; i<p.length; i++) {unwindexp(p[i],pl,al,rs,rules)};
  return false}

function unwindnotor (p,pl,al,rs,rules)
 {var nl = seq();
  for (var i=1; i<p.length; i++) {nl[i-1] = maknegation(p[i])};
  return unwindexit(append(nl,pl),al,rs,rules)}

function unwindstatic (p,pl,al,rs,rules)
 {
    var data = indexees(p[0],lambda);
  for (var i=0; i<data.length; i++)
      {var bl = unify(p,data[i],al);
       if (bl!==false) {unwindexit(pl,bl,rs,rules)}};
  return false}

function unwinddb (p,pl,al,rs,rules)
 {var copy;
  var bl;
  for (var i=0; i<rules.length; i++)
      {copy = standardize(rules[i]);
       if (copy[0]==='rule')
          {bl = unify(copy[1],p,al);
           if (bl!==false) {unwindexp(copy[2],copy.slice(3).concat(pl),bl,rs,rules)}}
       else {bl = unify(copy,p,al);
             if (bl!==false) {unwindexit(pl,bl,rs,rules)}}};
  return false}

function unwindexit (pl,al,rs,rules)
 {if (pl.length!==0) {return unwindexp(pl[0],tail(pl),al,rs,rules)};
  var n = len(rs)-1; 
  var exp = new Array(n+1);
  for (var r=rs; r!=nil; r=cdr(r)) {exp[n]=plug(car(r),al); n=n-1};
  residues[residues.length] = exp;
  return false}

//==============================================================================
// checkp
//==============================================================================

function checkp (p,facts,rules)
 {return checkexp(p,seq(),nil,facts,rules)}

function checkexp (p,pl,al,facts,rules)
 {if (symbolp(p)) {return checksymbol(p,pl,al,facts,rules)};
  if (p[0]==='same') {return checksame(p,pl,al,facts,rules)};
  if (p[0]==='distinct') {return checkdistinct(p,pl,al,facts,rules)};
  if (p[0]==='leq') {return checkleq(p,pl,al,facts,rules)};
  if (p[0]==='not') {return checknot(p[1],pl,al,facts,rules)};
  if (p[0]==='and') {return checkand(p,pl,al,facts,rules)};
  if (p[0]==='or') {return checkor(p,pl,al,facts,rules)};
  if (staticp(p[0])) {return checkstatic(p,pl,al,facts,rules)};
  //if (!viewp(p[0],rules)) {return checkexit(pl,al,facts,rules)};
  return checkview(p,pl,al,facts,rules)}

function checknot (p,pl,al,facts,rules)
 {if (symbolp(p)) {return checknotsymbol(p,pl,al,facts,rules)};
  if (p[0]==='same') {return checkdistinct(p,pl,al,facts,rules)};
  if (p[0]==='distinct') {return checksame(p,pl,al,facts,rules)};
  //if (p[0]==='leq') {return checknotleq(p,pl,al,facts,rules)};
  if (p[0]==='not') {return checkexp(p[1],pl,al,facts,rules)};
  if (p[0]==='and') {return checknotand(p,pl,al,facts,rules)};
  if (p[0]==='or') {return checkor(p,pl,al,facts,rules)};
  if (staticp(p[0])) {return checknotstatic(p,pl,al,facts,rules)};
  //if (!viewp(p[0],rules)) {return checkexit(pl,al,facts,rules)};
  return false}

function checksymbol (p,pl,al,facts,rules)
 {if (p==='true') {return checkexit(pl,al,facts,rules)};
  if (p==='false') {return false};
  return checkview(p,pl,al,facts,rules)}

function checknotsymbol (p,pl,al,facts,rules)
 {if (p==='true') {return false};
  if (p==='false') {return checkexit(pl,al,facts,rules)};
  return false}

function checksame (p,pl,al,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (equalp(x,y)) {return checkexit(pl,al,facts,rules)};
  return false}

function checkdistinct (p,pl,al,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (equalp(x,y)) {return false};
  return checkexit(pl,al,facts,rules)}

function checksymleq (p,pl,al,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (x<=y) {return checkexit(pl,al,facts,rules)};
  return false}

function checkand (p,pl,al,facts,rules)
 {return checkexit(tail(p).concat(pl),al,facts,rules)}

function checknotand (p,pl,al,facts,rules)
 {for (var i=0; i<p.length; i++)
      {if (checknot(p[i],pl,al,facts,rules)) {return true}};
  return false}

function checkor (p,pl,al,facts,rules)
 {for (var i=0; i<p.length; i++)
      {if (checkexp(p[i],pl,al,facts,rules)) {return true}};
  return false}

function checknotor (p,pl,al,facts,rules)
 {var nl = seq();
  for (var i=1; i<p.length; i++) {nl[i-1] = maknegation(p[i])};
  return checkexit(nl.concat(pl),al,facts,rules)}

function checkstatic (p,pl,al,facts,rules)
 {var data = indexees(p[0],facts);
  for (var i=0; i<data.length; i++)
      {var bl = unify(p,data[i],al);
       if (bl===false) {continue};
       if (checkexit(pl,bl,facts,rules)) {return true}};
  return false}

function checknotstatic (p,pl,al,facts,rules)
 {var data = indexees(p[0],facts);
  for (var i=0; i<data.length; i++)
      {var bl = unify(p,data[i],al);
       if (bl===false) {continue};
       return false};
  return checkexit(pl,bl,facts,rules)}

function checkview (p,pl,al,facts,rules)
 {var copy;
  var bl;
  for (var i=0; i<rules.length; i++)
      {copy = standardize(rules[i]);
       if (copy[0]==='rule')
          {bl = unify(copy[1],p,al);
           if (bl===false) {continue};
           if (checkexp(copy[2],copy.slice(3).concat(pl),bl,facts,rules))
              {return true}}
       else {bl = unify(copy,p,al);
             if (bl===false) {continue};
             if (checkexit(pl,bl,facts,rules)) {return true}}};
  return false}

function checkexit (pl,al,facts,rules)
 {if (pl.length===0) {return true};
  return checkexp(pl[0],tail(pl),al,facts,rules)}

//==============================================================================
// hypocheck
//==============================================================================

function hypocheckp (p,adds,facts,rules)
 {return hypocheckexp(p,seq(),nil,adds,facts,rules)}

function hypocheckexp (p,pl,al,adds,facts,rules)
 {if (symbolp(p)) {return hypochecksymbol(p,pl,al,adds,facts,rules)};
  if (p[0]==='same') {return hypochecksame(p,pl,al,adds,facts,rules)};
  if (p[0]==='distinct') {return hypocheckdistinct(p,pl,al,adds,facts,rules)};
  //if (p[0]==='symleq') {return hypochecksymleq(p,pl,al,adds,facts,rules)};
  if (p[0]==='not') {return hypochecknot(p[1],pl,al,adds,facts,rules)};
  if (p[0]==='and') {return hypocheckand(p,pl,al,adds,facts,rules)};
  if (p[0]==='or') {return hypocheckor(p,pl,al,adds,facts,rules)};
  if (staticp(p[0])) {return hypocheckstatic(p,pl,al,adds,facts,rules)};
  if (!viewp(p[0],rules)) {return hypocheckbase(p,pl,al,adds,facts,rules)};
  return hypocheckview(p,pl,al,adds,facts,rules)}

function hypochecknot (p,pl,al,adds,facts,rules)
 {if (symbolp(p)) {return hypochecknotsymbol(p,pl,al,adds,facts,rules)};
  if (p[0]==='same') {return hypocheckdistinct(p,pl,al,adds,facts,rules)};
  if (p[0]==='distinct') {return hypochecksame(p,pl,al,adds,facts,rules)};
  //if (p[0]==='symleq') {return hypochecknotsymleq(p,pl,al,adds,facts,rules)};
  if (p[0]==='not') {return hypocheckexp(p[1],pl,al,adds,facts,rules)};
  if (p[0]==='and') {return hypochecknotand(p,pl,al,adds,facts,rules)};
  if (p[0]==='or') {return hypocheckor(p,pl,al,adds,facts,rules)};
  if (staticp(p[0])) {return hypochecknotstatic(p,pl,al,adds,facts,rules)};
  if (!viewp(p[0],rules)) {return hypochecknotbase(p,pl,al,adds,facts,rules)};
  return false}

function hypochecksymbol (p,pl,al,adds,facts,rules)
 {if (p==='true') {return hypocheckexit(pl,al,adds,facts,rules)};
  if (p==='false') {return false};
  return hypocheckview(p,pl,al,adds,facts,rules)}

function hypochecknotsymbol (p,pl,al,adds,facts,rules)
 {if (p==='true') {return false};
  if (p==='false') {return hypocheckexit(pl,al,adds,facts,rules)};
  return false}

function hypochecksame (p,pl,al,adds,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (equalp(x,y))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  if (findp(seq('same',x,y),adds))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  return false}

function hypocheckdistinct (p,pl,al,adds,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (equalp(x,y)) {return false};
  if (primitivep(x) && primitivep(y))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  if (findp(seq('distinct',x,y),adds))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  return false}

function hypocheckleq (p,pl,al,adds,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (findleqp(x,y,adds))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  return false}

function hypochecksymleq (p,pl,al,adds,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (findsymleqp(x,y,adds))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  return false}

function hypochecksymleq (p,pl,al,adds,facts,rules)
 {var x = plug(p[1],al);
  var y = plug(p[2],al);
  if (primitivep(x) && primitivep(y))
     {if (x<=y) {return hypocheckexit(pl,al,adds,facts,rules)};
      return false};
  if (findp(seq('leq',x,y),adds))
     {return hypocheckexit(pl,al,adds,facts,rules)};
  return false}

function hypocheckand (p,pl,al,adds,facts,rules)
 {return hypocheckexit(tail(p).concat(pl),al,adds,facts,rules)}

function hypochecknotand (p,pl,al,adds,facts,rules)
 {for (var i=0; i<p.length; i++)
      {if (hypochecknot(p[i],pl,al,adds,facts,rules)) {return true}};
  return false}

function hypocheckor (p,pl,al,adds,facts,rules)
 {for (var i=0; i<p.length; i++)
      {if (hypocheckexp(p[i],pl,al,adds,facts,rules)) {return true}};
  return false}

function hypochecknotor (p,pl,al,adds,facts,rules)
 {var nl = seq();
  for (var i=1; i<p.length; i++) {nl[i-1] = maknegation(p[i])};
  return hypocheckexit(nl.concat(pl),al,adds,facts,rules)}

function hypocheckstatic (p,pl,al,adds,facts,rules)
 {var data = indexees(p[0],facts);
  for (var i=0; i<data.length; i++)
      {var bl = unify(p,data[i],al);
       if (bl===false) {continue};
       if (hypocheckexit(pl,bl,adds,facts,rules)) {return true}};
  return false}

function hypochecknotstatic (p,pl,al,adds,facts,rules)
 {var data = indexees(p[0],facts);
  for (var i=0; i<data.length; i++)
      {var bl = unify(p,data[i],al);
       if (bl!==false) {return false}};
  return hypocheckexit(pl,bl,adds,facts,rules)}

function hypocheckbase (p,pl,al,adds,facts,rules)
 {for (var i=0; i<adds.length; i++)
      {var bl = unify(p,adds[i],al);
       if (bl===false) {continue};
       if (hypocheckexit(pl,bl,adds,facts,rules)) {return true}};
  return false}

function hypochecknotbase (p,pl,al,adds,facts,rules)
 {for (var i=0; i<adds.length; i++)
      {var bl = unify(p,adds[i],al);
       if (bl!==false) {return false}};
  return hypocheckexit(pl,bl,adds,facts,rules)}

function hypocheckview (p,pl,al,adds,facts,rules)
 {var copy;
  var bl;
  for (var i=0; i<rules.length; i++)
      {copy = standardize(rules[i]);
       if (copy[0]==='rule')
          {bl = unify(copy[1],p,al);
           if (bl===false) {continue};
           if (hypocheckexp(copy[2],copy.slice(3).concat(pl),bl,adds,facts,rules))
              {return true}}
       else {bl = unify(copy,p,al);
             if (bl===false) {continue};
             if (hypocheckexit(pl,bl,adds,facts,rules)) {return true}}};
  return false}

function hypocheckexit (pl,al,adds,facts,rules)
 {if (pl.length===0) {return true};
  return hypocheckexp(pl[0],tail(pl),al,adds,facts,rules)}

//==============================================================================
// Helpers
//==============================================================================

function primitivep (x)
 {return !skolemp(x)}

function skolemp (x)
 {if (symbolp(x)) {return (x==='z' || x[0]==='v')};
  for (var i=1; i<x.length; i++)
      {if (skolemp(x[i])) {return true}};
  return false}

//==============================================================================

function staticp (p)
 {return (p==='policy.type' ||
          p==='policy.insurer' ||
          p==='policy.insuree' ||
          p==='policy.vehicle' ||
          p==='policy.startdate' ||
          p==='policy.enddate' ||
          p==='person.spouse' ||
          p==='country.continent')}

//==============================================================================

function findleqp (x,y,facts)
 {if (equalp(x,y)) {return true};
  if (numberp(x))
     {if (numberp(y)) {return Number(x)<=Number(y)};
      for (var i=0; i<facts.length; i++)
          {if (symbolp(facts[i])) {continue};
           if (facts[i][0]!=='leq') {continue};
           if (!numberp(facts[i][1])) {continue};
           if (Number(x)>Number(facts[i][1])) {continue};
           if (findleqp(facts[i][2],y,facts)) {return true}}};
  for (var i=0; i<facts.length; i++)
      {if (symbolp(facts[i])) {continue};
       if (facts[i][0]!=='leq') {continue};
       if (!equalp(facts[i][1],x)) {continue};
       if (findleqp(facts[i][2],y,facts)) {return true}};
  return false}

function findsymleqp (x,y,facts)
 {if (equalp(x,y)) {return true};
  if (numberp(x))
     {if (numberp(y)) {return Number(x)<=Number(y)};
      for (var i=0; i<facts.length; i++)
          {if (symbolp(facts[i])) {continue};
           if (facts[i][0]!=='symleq') {continue};
           if (!number(facts[i][1])) {continue};
           if (Number(x)>Number(facts[i][1])) {continue};
           if (findsymleqp(facts[i][2],y)) {return true}}};
  for (var i=0; i<facts.length; i++)
      {if (symbolp(facts[i])) {continue};
       if (facts[i][0]!=='symleq') {continue};
       if (!equalp(facts[i][1],x)) {continue};
       if (findsymleqp(facts[i][2],y)) {return true}};
  return false}

//==============================================================================
//==============================================================================
//==============================================================================