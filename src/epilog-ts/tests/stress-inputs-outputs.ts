

const STRESS_TEST_DATASET_INPUT = "type(aflac_hospital_cash,product)\nproduct.insurer(aflac_hospital_cash,aflac)\nproduct.description(aflac_hospital_cash,\"../sources/aflac/A49100CA.pdf\")\nproduct.rulebase(aflac_hospital_cash,\"../sources/aflac/af9100.hrf\")\ntype(axa_travel_policy,product)\nproduct.insurer(axa_travel_policy,axa)\nproduct.description(axa_travel_policy,\"../sources/axa/axa_travel_policy.pdf\")\nproduct.rulebase(axa_travel_policy,\"../sources/axa/axa_travel_policy.hrf\")\ntype(calcas_auto_insurance,product)\nproduct.insurer(calcas_auto_insurance,calcas)\nproduct.description(calcas_auto_insurance,\"../sources/calcas/forthcoming.txt\")\ntype(chubb_hospital_cash,product)\nproduct.insurer(chubb_hospital_cash,chubb)\nproduct.description(chubb_hospital_cash,\"../sources/chubb/Hospital Cash.pdf\")\nproduct.rulebase(chubb_hospital_cash,\"\")\ntype(codex_plana,product)\nproduct.insurer(codex_plana,codex)\nproduct.description(codex_plana,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_plana,\"\")\ntype(codex_planb,product)\nproduct.insurer(codex_planb,codex)\nproduct.description(codex_planb,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_planb,\"\")\ntype(codex_planc,product)\nproduct.insurer(codex_planc,codex)\nproduct.description(codex_planc,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_planc,\"\")\ntype(codex_pland,product)\nproduct.insurer(codex_pland,codex)\nproduct.description(codex_pland,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_pland,\"\")\ntype(codex_plane,product)\nproduct.insurer(codex_plane,codex)\nproduct.description(codex_plane,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_plane,\"\")\ntype(codex_planf,product)\nproduct.insurer(codex_planf,codex)\nproduct.description(codex_planf,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_planf,\"\")\ntype(codex_plang,product)\nproduct.insurer(codex_plang,codex)\nproduct.description(codex_plang,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_plang,\"\")\ntype(codex_planh,product)\nproduct.insurer(codex_planh,codex)\nproduct.description(codex_planh,\"../sources/codex/plans.txt\")\nproduct.rulebase(codex_planh,\"\")\ntype(hertz_rental_insurance,product)\nproduct.insurer(hertz_rental_insurance,hertz)\ntype(lifesecure_hospital_cash,product)\nproduct.insurer(lifesecure_hospital_cash,lifesecure)\nproduct.description(lifesecure_hospital_cash,\"../sources/lifesecure/LS-HR-0002 CA 0715.pdf\")\nproduct.rulebase(lifesecure_hospital_cash,\"\")\ntype(visa_signature,product)\nproduct.insurer(visa_signature,visa)\nproduct.description(visa_signature,\"../sources/visa/guide-to-benefits.pdf\")\nproduct.rulebase(visa_signature,\"../sources/visa/visa_signature.hrf\")\ntype(policy1234567821,policy)\npolicy.type(policy1234567821,chubb_hospital_cash)\npolicy.insuree(policy1234567821,steve_squirrel)\npolicy.dependent(policy1234567821,sally_squirrel)\npolicy.dependent(policy1234567821,susan_squirrel)\npolicy.startdate(policy1234567821,2023_01_01)\npolicy.enddate(policy1234567821,2023_12_31)\ntype(policy1234567822,policy)\npolicy.type(policy1234567822,axa_travel_policy)\npolicy.insuree(policy1234567822,sally_squirrel)\npolicy.insuree(policy1234567822,sibyl_squirrel)\npolicy.insuree(policy1234567822,steve_squirrel)\npolicy.insuree(policy1234567822,susan_squirrel)\npolicy.vehicle(policy1234567822,vehicle31)\npolicy.startdate(policy1234567822,2023_01_01)\npolicy.enddate(policy1234567822,2023_12_31)\ntype(policy1234567823,policy)\npolicy.type(policy1234567823,codex_plana)\npolicy.insuree(policy1234567823,steve_squirrel)\npolicy.startdate(policy1234567823,2023_01_01)\npolicy.enddate(policy1234567823,2023_12_31)\ntype(policy1234567824,policy)\npolicy.type(policy1234567824,codex_planb)\npolicy.insuree(policy1234567824,steve_squirrel)\npolicy.startdate(policy1234567824,2023_01_01)\npolicy.enddate(policy1234567824,2023_12_31)\ntype(policy1234567825,policy)\npolicy.type(policy1234567825,codex_planc)\npolicy.insuree(policy1234567825,steve_squirrel)\npolicy.startdate(policy1234567825,2023_01_01)\npolicy.enddate(policy1234567825,2023_12_31)\ntype(policy1234567826,policy)\npolicy.type(policy1234567826,codex_pland)\npolicy.insuree(policy1234567826,steve_squirrel)\npolicy.startdate(policy1234567826,2023_01_01)\npolicy.enddate(policy1234567826,2023_12_31)\ntype(policy1234567830,policy)\npolicy.type(policy1234567830,visa_signature)\npolicy.insuree(policy1234567830,steve_squirrel)\npolicy.startdate(policy1234567830,2023_01_01)\npolicy.enddate(policy1234567830,2023_12_31)\ntype(policy1234567840,policy)\npolicy.type(policy1234567840,visa_signature)\npolicy.insuree(policy1234567840,genesereth)\npolicy.startdate(policy1234567840,2023_01_01)\npolicy.enddate(policy1234567840,2023_12_31)\ntype(claim21,hospitalizationclaim)\nclaim.claimant(claim21,steve_squirrel)\nclaim.date(claim21,2023_11_30)\nclaim.patient(claim21,sally_squirrel)\nclaim.hospital(claim21,johns_hopkins)\nclaim.physician(claim21,kildare)\nclaim.physicianref(claim21,yes)\nclaim.diagnosis(claim21,sprained_ankle)\nclaim.startdate(claim21,2023_08_23)";
const STRESS_TEST_DATASET_OUTPUT = "type(aflac_hospital_cash, product) product.insurer(aflac_hospital_cash, aflac) product.description(aflac_hospital_cash, \"../sources/aflac/A49100CA.pdf\") product.rulebase(aflac_hospital_cash, \"../sources/aflac/af9100.hrf\") type(axa_travel_policy, product) product.insurer(axa_travel_policy, axa) product.description(axa_travel_policy, \"../sources/axa/axa_travel_policy.pdf\") product.rulebase(axa_travel_policy, \"../sources/axa/axa_travel_policy.hrf\") type(calcas_auto_insurance, product) product.insurer(calcas_auto_insurance, calcas) product.description(calcas_auto_insurance, \"../sources/calcas/forthcoming.txt\") type(chubb_hospital_cash, product) product.insurer(chubb_hospital_cash, chubb) product.description(chubb_hospital_cash, \"../sources/chubb/Hospital Cash.pdf\") product.rulebase(chubb_hospital_cash, \"\") type(codex_plana, product) product.insurer(codex_plana, codex) product.description(codex_plana, \"../sources/codex/plans.txt\") product.rulebase(codex_plana, \"\") type(codex_planb, product) product.insurer(codex_planb, codex) product.description(codex_planb, \"../sources/codex/plans.txt\") product.rulebase(codex_planb, \"\") type(codex_planc, product) product.insurer(codex_planc, codex) product.description(codex_planc, \"../sources/codex/plans.txt\") product.rulebase(codex_planc, \"\") type(codex_pland, product) product.insurer(codex_pland, codex) product.description(codex_pland, \"../sources/codex/plans.txt\") product.rulebase(codex_pland, \"\") type(codex_plane, product) product.insurer(codex_plane, codex) product.description(codex_plane, \"../sources/codex/plans.txt\") product.rulebase(codex_plane, \"\") type(codex_planf, product) product.insurer(codex_planf, codex) product.description(codex_planf, \"../sources/codex/plans.txt\") product.rulebase(codex_planf, \"\") type(codex_plang, product) product.insurer(codex_plang, codex) product.description(codex_plang, \"../sources/codex/plans.txt\") product.rulebase(codex_plang, \"\") type(codex_planh, product) product.insurer(codex_planh, codex) product.description(codex_planh, \"../sources/codex/plans.txt\") product.rulebase(codex_planh, \"\") type(hertz_rental_insurance, product) product.insurer(hertz_rental_insurance, hertz) type(lifesecure_hospital_cash, product) product.insurer(lifesecure_hospital_cash, lifesecure) product.description(lifesecure_hospital_cash, \"../sources/lifesecure/LS-HR-0002 CA 0715.pdf\") product.rulebase(lifesecure_hospital_cash, \"\") type(visa_signature, product) product.insurer(visa_signature, visa) product.description(visa_signature, \"../sources/visa/guide-to-benefits.pdf\") product.rulebase(visa_signature, \"../sources/visa/visa_signature.hrf\") type(policy1234567821, policy) policy.type(policy1234567821, chubb_hospital_cash) policy.insuree(policy1234567821, steve_squirrel) policy.dependent(policy1234567821, sally_squirrel) policy.dependent(policy1234567821, susan_squirrel) policy.startdate(policy1234567821, 2023_01_01) policy.enddate(policy1234567821, 2023_12_31) type(policy1234567822, policy) policy.type(policy1234567822, axa_travel_policy) policy.insuree(policy1234567822, sally_squirrel) policy.insuree(policy1234567822, sibyl_squirrel) policy.insuree(policy1234567822, steve_squirrel) policy.insuree(policy1234567822, susan_squirrel) policy.vehicle(policy1234567822, vehicle31) policy.startdate(policy1234567822, 2023_01_01) policy.enddate(policy1234567822, 2023_12_31) type(policy1234567823, policy) policy.type(policy1234567823, codex_plana) policy.insuree(policy1234567823, steve_squirrel) policy.startdate(policy1234567823, 2023_01_01) policy.enddate(policy1234567823, 2023_12_31) type(policy1234567824, policy) policy.type(policy1234567824, codex_planb) policy.insuree(policy1234567824, steve_squirrel) policy.startdate(policy1234567824, 2023_01_01) policy.enddate(policy1234567824, 2023_12_31) type(policy1234567825, policy) policy.type(policy1234567825, codex_planc) policy.insuree(policy1234567825, steve_squirrel) policy.startdate(policy1234567825, 2023_01_01) policy.enddate(policy1234567825, 2023_12_31) type(policy1234567826, policy) policy.type(policy1234567826, codex_pland) policy.insuree(policy1234567826, steve_squirrel) policy.startdate(policy1234567826, 2023_01_01) policy.enddate(policy1234567826, 2023_12_31) type(policy1234567830, policy) policy.type(policy1234567830, visa_signature) policy.insuree(policy1234567830, steve_squirrel) policy.startdate(policy1234567830, 2023_01_01) policy.enddate(policy1234567830, 2023_12_31) type(policy1234567840, policy) policy.type(policy1234567840, visa_signature) policy.insuree(policy1234567840, genesereth) policy.startdate(policy1234567840, 2023_01_01) policy.enddate(policy1234567840, 2023_12_31) type(claim21, hospitalizationclaim) claim.claimant(claim21, steve_squirrel) claim.date(claim21, 2023_11_30) claim.patient(claim21, sally_squirrel) claim.hospital(claim21, johns_hopkins) claim.physician(claim21, kildare) claim.physicianref(claim21, yes) claim.diagnosis(claim21, sprained_ankle) claim.startdate(claim21, 2023_08_23)";

const STRESS_TEST_RULESET_INPUT = 'covers(Policy,C) :- policy.type(Policy,axa_travel_policy) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & claim.claimant(C,I) & claim.lessee(C,I) & claim.driver(C,I) & claim.activity(C,street)\ncovers(Policy,Z) :- policy.type(Policy,chubb_hospital_cash) & policy.insuree(Policy,I) & hospitalization.patient(Z,I) & policy_in_effect(Policy,Z) & complete_day(Z) & evaluate(countofall(E,exclusion(Z,E)),0)\ncovers(Policy,Z) :- policy.type(Policy,chubb_hospital_cash) & policy.insuree(Policy,I) & person.parent(C,I) & hospitalization.patient(Z,C) & policy_in_effect(Policy,Z) & complete_day(Z) & evaluate(countofall(E,exclusion(Z,E)),0)\npolicy_in_effect(P,Z) :- policy.startdate(P,PS) & policy.enddate(P,PE) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE) & overlap(PS,PE,ZS,ZE)\npartial_day(Z) :- duration(Z,DURATION) & leq(DURATION,86400000) & distinct(DURATION,86400000)\ncomplete_day(Z) :- duration(Z,DURATION) & leq(86400000,DURATION)\nduration(Z,DURATION) :- hospitalization.startdate(Z,SD) & hospitalization.starttime(Z,ST) & hospitalization.enddate(Z,ED) & hospitalization.endtime(Z,ET) & datetimetotimestamp(SD,ST,SS) & datetimetotimestamp(ED,ET,ES) & evaluate(minus(ES,SS),DURATION)\nexclusion(Z,4.3m) :- hospitalization.patient(Z,P) & hospitalization.patient(Y,P) & distinct(Y,Z) & hospitalization.diagnosis(Z,D) & hospitalization.diagnosis(Y,D) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Y,YE) & evaluate(stringmin(YE,ZS),YE)\nexclusion(C,4.3i) :- claim.hospitalization(C,Z) & hospitalization.cause(Z,X) & accident.activity(X,skydiving)\nperson.policy(X,Y) :- policy.insuree(Y,X)\nperson.policy(X,Y) :- policy.dependent(Y,X)\nperson.claim(X,Y) :- hospitalization.patient(H,X) & claim.hospitalization(Y,H)\npolicy.claim(X,Y) :- claim.policy(Y,X)\ncovers(Policy,Z) :- policy.type(Policy,codex_plana) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,I) & hospitalization.hospital(Z,H) & hospital.country(H,usa) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_plana) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.spouse(P,I) & hospitalization.hospital(Z,H) & hospital.country(H,usa) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_plana) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.parent(P,I) & hospitalization.hospital(Z,H) & hospital.country(H,usa) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_planb) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,I) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_planc) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.spouse(P,I) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_pland) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.parent(P,I) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_plane) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.parent(P,I) & hospitalization.hospital(Z,H) & hospital.country(H,C) & country.continent(C,europe) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_planf) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.parent(P,I) & hospitalization.hospital(Z,H) & hospital.country(H,C) & country.continent(C,south_america) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_plang) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.parent(P,I) & hospitalization.hospital(Z,H) & hospital.country(H,C) & country.continent(C,asia) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE)\ncovers(Policy,Z) :- policy.type(Policy,codex_planh) & policy.insuree(Policy,I) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & hospitalization.patient(Z,P) & person.spouse(P,I) & hospitalization.hospital(Z,H) & hospital.country(H,C) & country.continent(C,oceania) & hospitalization.startdate(Z,ZS) & hospitalization.enddate(Z,ZE) & symleq(PS,ZS) & symleq(ZE,PE)\ncovers(Policy,C) :- covered(Policy,C)\ncovered(P,C) :- policy.type(P,visa_signature) & policy.startdate(Policy,PS) & policy.enddate(Policy,PE) & policy.insuree(P,I) & claim.claimant(C,I) & claim.lessee(C,I) & claim.locale(C,L) & claim.rentalstart(C,S) & claim.rentalend(C,E) & claim.driver(C,I) & claim.activity(C,street) & claim.country(C,usa) & rentalcoverage(S,E,L)\nrentalcoverage(S,E,usa) :- evaluate(datediff(E,S),D) & leq(D,15)\nrentalcoverage(S,E,L) :- distinct(L,usa)\nevaluate(datediff(GE,GS),D) & leq(D,31)\nexcluded(P,C) :- policy.type(P,visa_signature) & repair.vehicle(C,V) & vehicle.type(V,T)\nspecial_type(bus)\nspecial_type(limousine)\nspecial_type(moped)\nspecial_type(motorbike)\nspecial_type(motorcycle)\nspecial_type(pickup)\nspecial_type(rv)\nspecial_type(truck)\nexcluded(P,R) :- policy.type(P,visa_signature) & repair.cause(R,C) & collision.activity(C,offroad)\nexcluded(P,R) :- policy.type(P,visa_signature) & repair.cause(R,C) & collision.country(C,W) & outlier(W)\noutlier(ireland)\noutlier(israel)\noutlier(jamaica)\noutlier(northern_ireland)\nexcluded(P,R) :- policy.type(P,visa_signature) & policy.vehicle(P,V) & antique_vehicle(V,Y)\nantique_vehicle(V,Y) :- vehicle.year(V,Y)\nexcluded(P,R) :- policy.type(P,visa_signature) & policy.vehicle(P,V) & vehicle.make(V,M) & luxury_vehicle(M)\nluxury_vehicle(aston_martin)\nluxury_vehicle(bentley)\nluxury_vehicle(bricklin)\nluxury_vehicle(daimler)\nluxury_vehicle(delorean)\nluxury_vehicle(excalibur)\nluxury_vehicle(ferrari)\nluxury_vehicle(jensen)\nluxury_vehicle(lamborghini)\nluxury_vehicle(lotus)\nluxury_vehicle(maserati)\nluxury_vehicle(porsche)\nluxury_vehicle(rolls_royce)\npolicy.insurer(P,C) :- policy.type(P,T) & product.insurer(T,C)\nclaim.subject(C,Z) :- claim.hospitalization(C,Z)\nclaim.subject(C,R) :- claim.repair(C,R)\nclaim.recommendation(C,pay) :- claim.hospitalization(C,Z) & covers(P,Z)\nclaim.recommendation(C,decline) :- claim.hospitalization(C,Z) & partial_day(Z)\nclaim.recommendation(C,decline) :- claim.hospitalization(C,Z) & exclusion(Z,E)\nclaim.recommendation(C,pay) :- covers(P,C)\noverlap(XS,XE,YS,YE) :- evaluate(stringmin(YS,XE),YS) & evaluate(stringmin(XS,YE),XS)\ndatetimetotimestamp(DATE,TIME,STAMP) :- evaluate(parsedate(DATE),[Y,M,D]) & evaluate(parsetime(TIME),[H,N,S]) & evaluate(maketimestamp(Y,M,D,H,N,S),STAMP)\nparsedate(DATE) := map(readstring,tail(matches(stringify(DATE),"(....)_(..)_(..)")))\nparsetime(TIME) := map(readstring,tail(matches(stringify(TIME),"(..)_(..)_(..)")))\nhead(X!L) := X\ntail(X!L) := L\nillegal(C) :- countofall(A,claim.activity(C,A),0)\nillegal(C) :- claim.repairstart(C,S) & claim.repairend(C,E) & symless(E,S)\n';
const STRESS_TEST_RULESET_OUTPUT = 'covers(Policy, C) :- policy.type(Policy, axa_travel_policy) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & claim.claimant(C, I) & claim.lessee(C, I) & claim.driver(C, I) & claim.activity(C, street)\ncovers(Policy, Z) :- policy.type(Policy, chubb_hospital_cash) & policy.insuree(Policy, I) & hospitalization.patient(Z, I) & policy_in_effect(Policy, Z) & complete_day(Z) & evaluate(countofall(E, exclusion(Z, E)), 0)\ncovers(Policy, Z) :- policy.type(Policy, chubb_hospital_cash) & policy.insuree(Policy, I) & person.parent(C, I) & hospitalization.patient(Z, C) & policy_in_effect(Policy, Z) & complete_day(Z) & evaluate(countofall(E, exclusion(Z, E)), 0)\npolicy_in_effect(P, Z) :- policy.startdate(P, PS) & policy.enddate(P, PE) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE) & overlap(PS, PE, ZS, ZE)\npartial_day(Z) :- duration(Z, DURATION) & leq(DURATION, 86400000) & distinct(DURATION, 86400000)\ncomplete_day(Z) :- duration(Z, DURATION) & leq(86400000, DURATION)\nduration(Z, DURATION) :- hospitalization.startdate(Z, SD) & hospitalization.starttime(Z, ST) & hospitalization.enddate(Z, ED) & hospitalization.endtime(Z, ET) & datetimetotimestamp(SD, ST, SS) & datetimetotimestamp(ED, ET, ES) & evaluate(minus(ES, SS), DURATION)\nexclusion(Z, 4.3m) :- hospitalization.patient(Z, P) & hospitalization.patient(Y, P) & distinct(Y, Z) & hospitalization.diagnosis(Z, D) & hospitalization.diagnosis(Y, D) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Y, YE) & evaluate(stringmin(YE, ZS), YE)\nexclusion(C, 4.3i) :- claim.hospitalization(C, Z) & hospitalization.cause(Z, X) & accident.activity(X, skydiving)\nperson.policy(X, Y) :- policy.insuree(Y, X)\nperson.policy(X, Y) :- policy.dependent(Y, X)\nperson.claim(X, Y) :- hospitalization.patient(H, X) & claim.hospitalization(Y, H)\npolicy.claim(X, Y) :- claim.policy(Y, X)\ncovers(Policy, Z) :- policy.type(Policy, codex_plana) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, I) & hospitalization.hospital(Z, H) & hospital.country(H, usa) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_plana) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.spouse(P, I) & hospitalization.hospital(Z, H) & hospital.country(H, usa) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_plana) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.parent(P, I) & hospitalization.hospital(Z, H) & hospital.country(H, usa) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_planb) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, I) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_planc) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.spouse(P, I) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_pland) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.parent(P, I) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_plane) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.parent(P, I) & hospitalization.hospital(Z, H) & hospital.country(H, C) & country.continent(C, europe) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_planf) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.parent(P, I) & hospitalization.hospital(Z, H) & hospital.country(H, C) & country.continent(C, south_america) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_plang) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.parent(P, I) & hospitalization.hospital(Z, H) & hospital.country(H, C) & country.continent(C, asia) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE)\ncovers(Policy, Z) :- policy.type(Policy, codex_planh) & policy.insuree(Policy, I) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & hospitalization.patient(Z, P) & person.spouse(P, I) & hospitalization.hospital(Z, H) & hospital.country(H, C) & country.continent(C, oceania) & hospitalization.startdate(Z, ZS) & hospitalization.enddate(Z, ZE) & symleq(PS, ZS) & symleq(ZE, PE)\ncovers(Policy, C) :- covered(Policy, C)\ncovered(P, C) :- policy.type(P, visa_signature) & policy.startdate(Policy, PS) & policy.enddate(Policy, PE) & policy.insuree(P, I) & claim.claimant(C, I) & claim.lessee(C, I) & claim.locale(C, L) & claim.rentalstart(C, S) & claim.rentalend(C, E) & claim.driver(C, I) & claim.activity(C, street) & claim.country(C, usa) & rentalcoverage(S, E, L)\nrentalcoverage(S, E, usa) :- evaluate(datediff(E, S), D) & leq(D, 15)\nrentalcoverage(S, E, L) :- distinct(L, usa)\nand(evaluate(datediff(GE, GS), D), leq(D, 31))\nexcluded(P, C) :- policy.type(P, visa_signature) & repair.vehicle(C, V) & vehicle.type(V, T)\nspecial_type(bus)\nspecial_type(limousine)\nspecial_type(moped)\nspecial_type(motorbike)\nspecial_type(motorcycle)\nspecial_type(pickup)\nspecial_type(rv)\nspecial_type(truck)\nexcluded(P, R) :- policy.type(P, visa_signature) & repair.cause(R, C) & collision.activity(C, offroad)\nexcluded(P, R) :- policy.type(P, visa_signature) & repair.cause(R, C) & collision.country(C, W) & outlier(W)\noutlier(ireland)\noutlier(israel)\noutlier(jamaica)\noutlier(northern_ireland)\nexcluded(P, R) :- policy.type(P, visa_signature) & policy.vehicle(P, V) & antique_vehicle(V, Y)\nantique_vehicle(V, Y) :- vehicle.year(V, Y)\nexcluded(P, R) :- policy.type(P, visa_signature) & policy.vehicle(P, V) & vehicle.make(V, M) & luxury_vehicle(M)\nluxury_vehicle(aston_martin)\nluxury_vehicle(bentley)\nluxury_vehicle(bricklin)\nluxury_vehicle(daimler)\nluxury_vehicle(delorean)\nluxury_vehicle(excalibur)\nluxury_vehicle(ferrari)\nluxury_vehicle(jensen)\nluxury_vehicle(lamborghini)\nluxury_vehicle(lotus)\nluxury_vehicle(maserati)\nluxury_vehicle(porsche)\nluxury_vehicle(rolls_royce)\npolicy.insurer(P, C) :- policy.type(P, T) & product.insurer(T, C)\nclaim.subject(C, Z) :- claim.hospitalization(C, Z)\nclaim.subject(C, R) :- claim.repair(C, R)\nclaim.recommendation(C, pay) :- claim.hospitalization(C, Z) & covers(P, Z)\nclaim.recommendation(C, decline) :- claim.hospitalization(C, Z) & partial_day(Z)\nclaim.recommendation(C, decline) :- claim.hospitalization(C, Z) & exclusion(Z, E)\nclaim.recommendation(C, pay) :- covers(P, C)\noverlap(XS, XE, YS, YE) :- evaluate(stringmin(YS, XE), YS) & evaluate(stringmin(XS, YE), XS)\ndatetimetotimestamp(DATE, TIME, STAMP) :- evaluate(parsedate(DATE), cons(Y, cons(M, cons(D, nil)))) & evaluate(parsetime(TIME), cons(H, cons(N, cons(S, nil)))) & evaluate(maketimestamp(Y, M, D, H, N, S), STAMP)\nillegal(C) :- countofall(A, claim.activity(C, A), 0)\nillegal(C) :- claim.repairstart(C, S) & claim.repairend(C, E) & symless(E, S)'

export {
    STRESS_TEST_DATASET_INPUT,
    STRESS_TEST_DATASET_OUTPUT,

    STRESS_TEST_RULESET_INPUT,
    STRESS_TEST_RULESET_OUTPUT
}